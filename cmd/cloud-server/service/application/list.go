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

package application

import (
	"bytes"
	"fmt"
	"strings"

	"hcm/pkg/dal/dao/tools"
	"hcm/pkg/iam/meta"

	"github.com/tidwall/gjson"

	proto "hcm/pkg/api/cloud-server/application"
	dataproto "hcm/pkg/api/data-service"
	"hcm/pkg/criteria/errf"
	"hcm/pkg/rest"
	"hcm/pkg/runtime/filter"
)

// List ...
func (a *applicationSvc) List(cts *rest.Contexts) (interface{}, error) {
	req := new(proto.ApplicationListReq)
	if err := cts.DecodeInto(req); err != nil {
		return nil, err
	}

	if err := req.Validate(); err != nil {
		return nil, errf.NewFromErr(errf.InvalidParameter, err)
	}
	_, authorized, err := a.authorizer.Authorize(cts.Kit, meta.ResourceAttribute{Basic: &meta.Basic{
		Type:   meta.Application,
		Action: meta.Find,
	}})
	if err != nil {
		return nil, err
	}
	// 构造过滤条件
	reqFilter := &filter.Expression{
		Op:    filter.And,
		Rules: []filter.RuleFactory{},
	}
	if !authorized {
		// 没有单据管理权限的只能查询自己的单据
		req.Filter.Rules = append(req.Filter.Rules, tools.RuleEqual("applicant", cts.Kit.User))
	}

	// 加上请求里过滤条件
	if req.Filter != nil && !req.Filter.IsEmpty() {
		reqFilter.Rules = append(reqFilter.Rules, req.Filter)
	}

	resp, err := a.client.DataService().Global.Application.List(
		cts.Kit,
		&dataproto.ApplicationListReq{
			Filter: reqFilter,
			Page:   req.Page,
		},
	)
	if err != nil {
		return nil, err
	}

	for _, one := range resp.Details {
		one.Content = RemoveSenseField(one.Content)
	}

	return resp, nil
}

// RemoveSenseField 申请单据内容移除铭感信息，如主机密码等
func RemoveSenseField(content string) string {
	buffer := bytes.Buffer{}

	m := gjson.Parse(content).Map()
	for key, value := range m {
		if strings.Contains(key, "password") {
			continue
		}
		buffer.WriteString(fmt.Sprintf(`"%s":%s,`, key, value.Raw))
	}

	ext := buffer.String()
	if len(ext) == 0 {
		return "{}"
	}

	return fmt.Sprintf("{%s}", ext[:len(ext)-1])
}
