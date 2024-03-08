/*
 *
 * TencentBlueKing is pleased to support the open source community by making
 * 蓝鲸智云 - 混合云管理平台 (BlueKing - Hybrid Cloud Management System) available.
 * Copyright (C) 2024 THL A29 Limited,
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

package clb

import (
	"encoding/json"
	"fmt"

	cloudserver "hcm/pkg/api/cloud-server"
	protoclb "hcm/pkg/api/hc-service/clb"
	"hcm/pkg/criteria/enumor"
	"hcm/pkg/criteria/errf"
	"hcm/pkg/iam/meta"
	"hcm/pkg/kit"
	"hcm/pkg/logs"
	"hcm/pkg/rest"
)

func (svc *clbSvc) BatchCreateCLB(cts *rest.Contexts) (any, error) {

	req := new(cloudserver.ResourceCreateReq)
	if err := cts.DecodeInto(req); err != nil {
		logs.Errorf("create clb request decode failed, err: %v, rid: %s", err, cts.Kit.Rid)
		return nil, errf.NewFromErr(errf.DecodeRequestFailed, err)
	}

	// 权限校验
	authRes := meta.ResourceAttribute{Basic: &meta.Basic{
		Type:       meta.Clb,
		Action:     meta.Create,
		ResourceID: req.AccountID,
	}}
	if err := svc.authorizer.AuthorizeWithPerm(cts.Kit, authRes); err != nil {
		logs.Errorf("create load balancer auth failed, err: %v, account id: %s, rid: %s",
			err, req.AccountID, cts.Kit.Rid)
		return nil, err
	}

	accountInfo, err := svc.client.DataService().Global.Cloud.
		GetResBasicInfo(cts.Kit, enumor.AccountCloudResType, req.AccountID)
	if err != nil {
		logs.Errorf("get account basic info failed, err: %v, rid: %s", err, cts.Kit.Rid)
		return nil, err
	}

	switch accountInfo.Vendor {
	case enumor.TCloud:
		return svc.batchCreateTCloudCLB(cts.Kit, req.Data)
	default:
		return nil, fmt.Errorf("vendor: %s not support", accountInfo.Vendor)
	}

}

func (svc *clbSvc) batchCreateTCloudCLB(kt *kit.Kit, rawReq json.RawMessage) (any, error) {
	req := new(protoclb.TCloudBatchCreateReq)
	if err := json.Unmarshal(rawReq, req); err != nil {
		return nil, errf.NewFromErr(errf.DecodeRequestFailed, err)
	}
	// 参数校验
	if err := req.Validate(); err != nil {
		return nil, errf.NewFromErr(errf.InvalidParameter, err)
	}

	return svc.client.HCService().TCloud.Clb.BatchCreate(kt, req)
}
