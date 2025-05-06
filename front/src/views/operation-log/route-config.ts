import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import {
  MENU_BUSINESS,
  MENU_BUSINESS_OPERATION_LOG,
  MENU_BUSINESS_OPERATION_LOG_DETAILS,
} from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_OPERATION_LOG,
    path: 'record',
    component: () => import('@/views/resource/resource-manage/operationRecord/index'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '操作记录',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_OPERATION_LOG_DETAILS,
    path: 'record/details',
    component: () => import('@/views/resource/resource-manage/operationRecord/RecordDetail/index'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '操作记录详情',
          relative: MENU_BUSINESS_OPERATION_LOG,
        },
      }),
    },
  },
] as RouteRecordRaw[];
