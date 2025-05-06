import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_EIP, MENU_BUSINESS_EIP_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_EIP,
    path: 'ip',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '弹性IP',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_EIP_DETAILS,
    path: 'ip/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '弹性IP详情',
          relative: MENU_BUSINESS_EIP,
        },
      }),
    },
  },
] as RouteRecordRaw[];
