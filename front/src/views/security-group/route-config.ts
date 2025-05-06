import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import {
  MENU_BUSINESS,
  MENU_BUSINESS_SECURITY_GROUP,
  MENU_BUSINESS_SECURITY_GROUP_DETAILS,
} from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_SECURITY_GROUP,
    path: 'security',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '安全组',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_SECURITY_GROUP_DETAILS,
    path: 'security/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '安全组详情',
          relative: MENU_BUSINESS_SECURITY_GROUP,
        },
      }),
    },
  },
] as RouteRecordRaw[];
