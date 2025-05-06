import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_SUBNET, MENU_BUSINESS_SUBNET_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_SUBNET,
    path: 'subnet',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '子网',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_SUBNET_DETAILS,
    path: 'subnet/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '子网详情',
          relative: MENU_BUSINESS_SUBNET,
        },
      }),
    },
  },
] as RouteRecordRaw[];
