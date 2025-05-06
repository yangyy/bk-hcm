import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_DRIVE, MENU_BUSINESS_DRIVE_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_DRIVE,
    path: 'drive',
    component: () => import('@/views/business/business-manage.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '硬盘',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_DRIVE_DETAILS,
    path: 'drive/details/:id',
    component: () => import('@/views/business/business-detail.vue'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '云硬盘',
          relative: MENU_BUSINESS_DRIVE,
        },
      }),
    },
  },
] as RouteRecordRaw[];
