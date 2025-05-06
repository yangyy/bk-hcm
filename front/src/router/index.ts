import {
  createRouter,
  RouteRecordRaw,
  NavigationGuardNext,
  createWebHashHistory,
  RouteLocationNormalized,
} from 'vue-router';
import {
  // MENU_BILL,
  MENU_BUSINESS,
  MENU_BUSINESS_HOST,
  // MENU_RESOURCE,
  // MENU_SCHEME,
  MENU_SERVICE,
} from '@/constants/menu-symbol';
import { businessViews, serviceViews } from '@/views';
// import resource from './module/resource';
// import resourceInside from './module/resource-inside';
// import service from './module/service';
// import serviceInside from './module/service-inside';
// import business from './module/business';
// import scheme from './module/scheme';
// import bill from './module/bill';
// import i18n from '@/language/i18n';
import { useCommonStore } from '@/store';
import { useVerify } from '@/hooks';
import { isArray, isRegExp, isString } from 'lodash';

// const { t } = i18n.global;

const statusRouters = [
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/status/404.vue'),
  },
  {
    name: 'error',
    path: '/error',
    component: () => import('@/views/status/error.vue'),
  },
];

const redirectRouters = [
  {
    path: '/:pathMatch(.*)*',
    redirect: {
      name: '404',
    },
  },
  {
    path: '/',
    redirect: {
      name: MENU_BUSINESS,
    },
  },
];

const routes: RouteRecordRaw[] = [
  ...redirectRouters,
  ...statusRouters,
  {
    name: MENU_BUSINESS,
    path: '/business/:bizId(\\d+)?',
    redirect: {
      name: MENU_BUSINESS_HOST,
    },
    children: businessViews,
  },
  {
    name: MENU_SERVICE,
    path: '/service',
    children: serviceViews,
  },
  // {
  //   name: MENU_BILL,
  //   path: '/bill',
  //   children: businessViews,
  // },
  // {
  //   name: MENU_RESOURCE,
  //   path: '/resource',
  //   children: businessViews,
  // },
  // {
  //   name: MENU_SCHEME,
  //   path: '/resource',
  //   children: businessViews,
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 进入目标页面
const toCurrentPage = (
  authVerifyData: {
    permissionAction: Record<string, boolean>;
    urlParams: {
      system_id: string;
      actions: Array<{
        id: string;
        name: string;
        related_resource_types: Array<any>;
      }>;
    };
  },
  currentFindAuthData: {
    action: string;
    id: string;
    path: string;
    type: string;
  },
  next: NavigationGuardNext,
  to?: RouteLocationNormalized,
) => {
  // 是否需要鉴权
  const needAuth = !!currentFindAuthData?.id;
  // 是否有权限
  const hasAuth = !!authVerifyData?.permissionAction?.[currentFindAuthData?.id];

  if (!needAuth) {
    if (to?.name === '403') next(!!authVerifyData?.permissionAction?.biz_access ? { path: '/' } : undefined);
    else next();
    return;
  }

  if (hasAuth) next();
  else next({ name: '403', params: { id: currentFindAuthData?.id } });
};

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const commonStore = useCommonStore();
  const { pageAuthData, authVerifyData } = commonStore; // 所有需要检验的查看权限数据
  const currentFindAuthData = pageAuthData.find((e: any) => {
    const { path } = e;
    if (isString(path)) return path === to.path;
    if (isArray(path)) return path.includes(to.path);
    if (isRegExp(path)) return path.test(to.path);
    return undefined;
  });

  // if (to.path === '/service/my-approval') {
  //   window.open(`${BK_ITSM_URL}/#/workbench/ticket/approval`);
  //   window.location.reload();
  // }
  if (from.path === '/') {
    // 刷新或者首次进入请求权限接口
    const { getAuthVerifyData } = useVerify(); // 权限中心权限
    getAuthVerifyData(pageAuthData).then(() => {
      const { authVerifyData } = commonStore;
      toCurrentPage(authVerifyData, currentFindAuthData as any, next, to);
    });
  } else if (['/scheme/recommendation', '/scheme/deployment/list'].includes(to.path)) {
    next();
  } else {
    toCurrentPage(authVerifyData, currentFindAuthData as any, next);
  }
});

export default router;
