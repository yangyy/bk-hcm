import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_NIF, MENU_BUSINESS_NIF_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_NIF,
    path: 'network-interface',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '网络接口',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_NIF_DETAILS,
    path: 'network-interface/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '网络接口详情',
          relative: MENU_BUSINESS_NIF,
        },
      }),
    },
  },
] as RouteRecordRaw[];
