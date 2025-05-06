import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import {
  MENU_SERVICE,
  MENU_SERVICE_APPLY_MANAGEMENT,
  MENU_SERVICE_APPLY_MANAGEMENT_DETAILS,
} from '@/constants/menu-symbol';

// TODO 兼容
// /#/service/my-apply?type=cloudMachines -> /#/service/apply

export default [
  {
    name: MENU_SERVICE_APPLY_MANAGEMENT,
    path: 'apply',
    component: () => import('@/views/service/apply-list/index'),
    meta: {
      ...new Meta({
        owner: MENU_SERVICE,
        menu: {
          i18n: '单据管理',
          relative: MENU_SERVICE,
        },
      }),
    },
  },
  {
    name: MENU_SERVICE_APPLY_MANAGEMENT_DETAILS,
    path: 'apply/details/:id',
    component: () => import('@/views/service/apply-detail/index'),
    meta: {
      ...new Meta({
        owner: MENU_SERVICE,
        menu: {
          i18n: '申请单详情',
          relative: MENU_SERVICE_APPLY_MANAGEMENT,
        },
      }),
    },
  },
] as RouteRecordRaw[];
