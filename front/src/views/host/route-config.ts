import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_HOST, MENU_BUSINESS_HOST_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_HOST,
    path: 'host',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        auth: {
          view: { type: 'biz_access' },
        },
        menu: {
          i18n: '主机',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_HOST_DETAILS,
    path: 'host/details/:hostId',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '主机详情',
          relative: MENU_BUSINESS_HOST,
        },
      }),
    },
  },
] as RouteRecordRaw[];
