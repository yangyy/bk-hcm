import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS, MENU_BUSINESS_CERT } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_CERT,
    path: 'cert',
    component: () => import('@/views/business/cert-manager/index'),
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '证书托管',
          relative: MENU_BUSINESS,
        },
      }),
    },
  },
] as RouteRecordRaw[];
