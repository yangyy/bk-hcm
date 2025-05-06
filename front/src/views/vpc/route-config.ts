import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_VPC, MENU_BUSINESS_VPC_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_VPC,
    path: 'vpc',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: 'VPC',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_VPC_DETAILS,
    path: 'vpc/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: 'VPC详情',
          relative: MENU_BUSINESS_VPC,
        },
      }),
    },
  },
] as RouteRecordRaw[];
