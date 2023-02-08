/*
 * TencentBlueKing is pleased to support the open source community by making
 * 蓝鲸智云 - 混合云管理平台 (BlueKing - Hybrid Cloud Management System) available.
 * Copyright (C) 2022 THL A29 Limited,
 * a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://opensource.org/licenses/MIT
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 * We undertake not to change the open source license (MIT license) applicable
 *
 * to the current version of the project delivered to anyone in the future.
 */

package dao

import (
	"fmt"
	"strings"
	"time"

	"hcm/pkg/cc"
	"hcm/pkg/dal/dao/application"
	"hcm/pkg/dal/dao/audit"
	"hcm/pkg/dal/dao/auth"
	"hcm/pkg/dal/dao/cloud"
	"hcm/pkg/dal/dao/cloud/cvm"
	networkinterface "hcm/pkg/dal/dao/cloud/network-interface"
	"hcm/pkg/dal/dao/cloud/region"
	routetable "hcm/pkg/dal/dao/cloud/route-table"
	securitygroup "hcm/pkg/dal/dao/cloud/security-group"
	sgcvmrel "hcm/pkg/dal/dao/cloud/security-group-cvm-rel"
	subnetcvmrel "hcm/pkg/dal/dao/cloud/subnet-cvm-rel"
	vpccvmrel "hcm/pkg/dal/dao/cloud/vpc-cvm-rel"
	"hcm/pkg/dal/dao/cloud/zone"
	idgenerator "hcm/pkg/dal/dao/id-generator"
	"hcm/pkg/dal/dao/orm"
	"hcm/pkg/dal/table"
	"hcm/pkg/kit"
	"hcm/pkg/metrics"

	_ "github.com/go-sql-driver/mysql" // import mysql drive, used to create conn.
	"github.com/jmoiron/sqlx"
)

// ObjectDao 对象 Dao 接口
type ObjectDao interface {
	Name() table.Name
	SetOrm(o orm.Interface)
	SetIDGen(g idgenerator.IDGenInterface)
	Orm() orm.Interface
	IDGen() idgenerator.IDGenInterface
}

// ObjectDaoManager ...
type ObjectDaoManager struct {
	idGen idgenerator.IDGenInterface
	orm   orm.Interface
}

// SetOrm ...
func (m *ObjectDaoManager) SetOrm(o orm.Interface) {
	m.orm = o
}

// SetIDGen ...
func (m *ObjectDaoManager) SetIDGen(g idgenerator.IDGenInterface) {
	m.idGen = g
}

// Orm ...
func (m *ObjectDaoManager) Orm() orm.Interface {
	return m.orm
}

// IDGen ...
func (m *ObjectDaoManager) IDGen() idgenerator.IDGenInterface {
	return m.idGen
}

// Set defines all the DAO to be operated.
type Set interface {
	RegisterObjectDao(dao ObjectDao)
	GetObjectDao(name table.Name) ObjectDao

	Audit() audit.Interface
	Auth() auth.Auth
	Account() cloud.Account
	SecurityGroup() securitygroup.SecurityGroup
	SGCvmRel() sgcvmrel.Interface
	TCloudSGRule() securitygroup.TCloudSGRule
	AwsSGRule() securitygroup.AwsSGRule
	HuaWeiSGRule() securitygroup.HuaWeiSGRule
	AzureSGRule() securitygroup.AzureSGRule
	GcpFirewallRule() cloud.GcpFirewallRule
	Cloud() cloud.Cloud
	AccountBizRel() cloud.AccountBizRel
	Vpc() cloud.Vpc
	VpcCvmRel() vpccvmrel.Interface
	Subnet() cloud.Subnet
	SubnetCvmRel() subnetcvmrel.Interface
	HuaWeiRegion() region.HuaWeiRegion
	AzureRG() region.AzureRG
	AzureRegion() region.AzureRegion
	Zone() zone.Zone
	TCloudRegion() region.TCloudRegion
	AwsRegion() region.AwsRegion
	GcpRegion() region.GcpRegion
	Cvm() cvm.Interface
	RouteTable() routetable.RouteTable
	Route() routetable.Route
	Application() application.Application
	NetworkInterface() networkinterface.NetworkInterface

	Txn() *Txn
}

// NewDaoSet create the DAO set instance.
func NewDaoSet(opt cc.DataBase) (Set, error) {
	db, err := connect(opt.Resource)
	if err != nil {
		return nil, fmt.Errorf("init sharding failed, err: %v", err)
	}

	ormInst := orm.InitOrm(db, orm.MetricsRegisterer(metrics.Register()),
		orm.IngressLimiter(opt.Limiter.QPS, opt.Limiter.Burst), orm.SlowRequestMS(opt.MaxSlowLogLatencyMS))

	idGen := idgenerator.New(db, idgenerator.DefaultMaxRetryCount)

	s := &set{
		idGen:      idGen,
		orm:        ormInst,
		db:         db,
		audit:      audit.NewAudit(ormInst),
		objectDaos: make(map[table.Name]ObjectDao),
	}

	return s, nil
}

// connect to mysql
func connect(opt cc.ResourceDB) (*sqlx.DB, error) {
	db, err := sqlx.Connect("mysql", uri(opt))
	if err != nil {
		return nil, fmt.Errorf("connect to mysql failed, err: %v", err)
	}

	db.SetMaxOpenConns(int(opt.MaxOpenConn))
	db.SetMaxIdleConns(int(opt.MaxIdleConn))
	db.SetConnMaxLifetime(time.Duration(opt.MaxIdleTimeoutMin) * time.Minute)

	return db, nil
}

// uri generate the standard db connection string format uri.
func uri(opt cc.ResourceDB) string {
	return fmt.Sprintf(
		"%s:%s@tcp(%s)/%s?parseTime=true&timeout=%ds&readTimeout=%ds&writeTimeout=%ds&charset=%s",
		opt.User,
		opt.Password,
		strings.Join(opt.Endpoints, ","),
		opt.Database,
		opt.DialTimeoutSec,
		opt.ReadTimeoutSec,
		opt.WriteTimeoutSec,
		"utf8mb4",
	)
}

type set struct {
	idGen idgenerator.IDGenInterface
	orm   orm.Interface
	db    *sqlx.DB
	audit audit.Interface

	objectDaos map[table.Name]ObjectDao
}

// Zone return Zone dao.
func (s *set) Zone() zone.Zone {
	return &zone.ZoneDao{
		Orm:   s.orm,
		IDGen: s.idGen,
	}
}

// AzureRegion return AzureRegion dao.
func (s *set) AzureRegion() region.AzureRegion {
	return &region.AzureRegionDao{
		Orm:   s.orm,
		IDGen: s.idGen,
	}
}

// AzureRG return AzureRG dao.
func (s *set) AzureRG() region.AzureRG {
	return &region.AzureRGDao{
		Orm:   s.orm,
		IDGen: s.idGen,
	}
}

// HuaWeiRegion return HuaWeiRegion dao.
func (s *set) HuaWeiRegion() region.HuaWeiRegion {
	return &region.HuaWeiRegionDao{
		Orm:   s.orm,
		IDGen: s.idGen,
	}
}

// Account return account dao.
func (s *set) Account() cloud.Account {
	return &cloud.AccountDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// AccountBizRel returns account biz relation dao.
func (s *set) AccountBizRel() cloud.AccountBizRel {
	return &cloud.AccountBizRelDao{
		Orm: s.orm,
	}
}

// Vpc returns vpc dao.
func (s *set) Vpc() cloud.Vpc {
	return cloud.NewVpcDao(s.orm, s.idGen, s.audit)
}

// VpcCvmRel return vpc cvm rel dao.
func (s *set) VpcCvmRel() vpccvmrel.Interface {
	return &vpccvmrel.Dao{
		Orm: s.orm,
	}
}

// Subnet returns subnet dao.
func (s *set) Subnet() cloud.Subnet {
	return cloud.NewSubnetDao(s.orm, s.idGen, s.audit)
}

// SubnetCvmRel return subnet cvm rel dao.
func (s *set) SubnetCvmRel() subnetcvmrel.Interface {
	return &subnetcvmrel.Dao{
		Orm: s.orm,
	}
}

// Auth return auth dao.
func (s *set) Auth() auth.Auth {
	return &auth.AuthDao{
		Orm: s.orm,
	}
}

// Cloud return cloud dao.
func (s *set) Cloud() cloud.Cloud {
	return &cloud.CloudDao{
		Orm: s.orm,
	}
}

// RegisterObjectDao 注册 ObjectDao
func (s *set) RegisterObjectDao(dao ObjectDao) {
	dao.SetOrm(s.orm)
	dao.SetIDGen(s.idGen)

	tableName := dao.Name()
	s.objectDaos[tableName] = dao

	// 注册自己的表名
	tableName.Register()
}

// GetObjectDao 根据名称获取对应的 ObjectDao
func (s *set) GetObjectDao(name table.Name) ObjectDao {
	return s.objectDaos[name]
}

// Txn define dao set Txn.
type Txn struct {
	orm orm.Interface
}

// AutoTxn auto Txn.
func (t *Txn) AutoTxn(kt *kit.Kit, run orm.TxnFunc) (interface{}, error) {
	return t.orm.AutoTxn(kt, run)
}

// Txn return Txn.
func (s *set) Txn() *Txn {
	return &Txn{
		orm: s.orm,
	}
}

// SecurityGroup return security group dao.
func (s *set) SecurityGroup() securitygroup.SecurityGroup {
	return &securitygroup.SecurityGroupDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// SGCvmRel return security group cvm rel dao.
func (s *set) SGCvmRel() sgcvmrel.Interface {
	return &sgcvmrel.Dao{
		Orm: s.orm,
	}
}

// TCloudSGRule return tcloud security group rule dao.
func (s *set) TCloudSGRule() securitygroup.TCloudSGRule {
	return &securitygroup.TCloudSGRuleDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// GcpFirewallRule return gcp firewall rule dao.
func (s *set) GcpFirewallRule() cloud.GcpFirewallRule {
	return &cloud.GcpFirewallRuleDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// AwsSGRule return aws security group rule dao.
func (s *set) AwsSGRule() securitygroup.AwsSGRule {
	return &securitygroup.AwsSGRuleDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// HuaWeiSGRule return huawei security group rule dao.
func (s *set) HuaWeiSGRule() securitygroup.HuaWeiSGRule {
	return &securitygroup.HuaWeiSGRuleDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// AzureSGRule return azure security group rule dao.
func (s *set) AzureSGRule() securitygroup.AzureSGRule {
	return &securitygroup.AzureSGRuleDao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// Cvm return cvm dao.
func (s *set) Cvm() cvm.Interface {
	return &cvm.Dao{
		Orm:   s.orm,
		IDGen: s.idGen,
		Audit: s.audit,
	}
}

// TCloudRegion returns tcloud region dao.
func (s *set) TCloudRegion() region.TCloudRegion {
	return region.NewTCloudRegionDao(s.orm, s.idGen)
}

// AwsRegion returns aws region dao.
func (s *set) AwsRegion() region.AwsRegion {
	return region.NewAwsRegionDao(s.orm, s.idGen)
}

// GcpRegion returns gcp region dao.
func (s *set) GcpRegion() region.GcpRegion {
	return region.NewGcpRegionDao(s.orm, s.idGen)
}

// RouteTable returns route table dao.
func (s *set) RouteTable() routetable.RouteTable {
	return routetable.NewRouteTableDao(s.orm, s.idGen, s.audit)
}

// Route returns route dao.
func (s *set) Route() routetable.Route {
	return routetable.NewRouteDao(s.orm, s.idGen, s.audit)
}

// Audit return audit dao.
func (s *set) Audit() audit.Interface {
	return s.audit
}

// Application return application dao.
func (s *set) Application() application.Application {
	return &application.ApplicationDao{
		Orm:   s.orm,
		IDGen: s.idGen,
	}
}

// NetworkInterface return network interface dao.
func (s *set) NetworkInterface() networkinterface.NetworkInterface {
	return &networkinterface.NetworkInterfaceDao{
		Orm:   s.orm,
		IDGen: s.idGen,
	}
}
