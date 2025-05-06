import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { MENU_BUSINESS_TASK_MANAGEMENT, MENU_BUSINESS_TASK_MANAGEMENT_DETAILS } from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_TASK_MANAGEMENT,
    path: 'task/:resourceType?',
    component: () => import('./index.vue'),
    meta: {
      ...new Meta({
        activeKey: MENU_BUSINESS_TASK_MANAGEMENT,
        // 没有业务访问权限不会展示侧边栏导航，这里只是做一个权限优化的占位提示
        auth: {
          view: { type: 'biz_access' },
        },
        menu: {
          i18n: '任务管理',
          relative: MENU_BUSINESS_TASK_MANAGEMENT,
        },
      }),
    },
  },
  {
    name: MENU_BUSINESS_TASK_MANAGEMENT_DETAILS,
    path: 'task/:resourceType?/details/:id',
    component: () => import('./details/index.vue'),
    meta: {
      ...new Meta({
        activeKey: MENU_BUSINESS_TASK_MANAGEMENT,
        menu: {
          i18n: '任务详情',
          relative: MENU_BUSINESS_TASK_MANAGEMENT,
        },
      }),
    },
  },
] as RouteRecordRaw[];
