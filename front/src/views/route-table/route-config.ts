import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_ROUTE_TABLE, MENU_BUSINESS_ROUTE_TABLE_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_ROUTE_TABLE,
    path: 'routing',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '路由表',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_ROUTE_TABLE_DETAILS,
    path: 'routing/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '路由表详情',
          relative: MENU_BUSINESS_ROUTE_TABLE,
        },
      }),
    },
  },
] as RouteRecordRaw[];
