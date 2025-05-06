import type { RouteRecordRaw } from 'vue-router';
import {
  MENU_BUSINESS,
  MENU_SERVICE,
  // MENU_BILL,
  // MENU_RESOURCE,
  // MENU_SCHEME,
  MENU_BUSINESS_HOST,
  MENU_BUSINESS_DRIVE,
  MENU_BUSINESS_VPC,
  MENU_BUSINESS_SUBNET,
  MENU_BUSINESS_EIP,
  MENU_BUSINESS_NIF,
  MENU_BUSINESS_ROUTE_TABLE,
  MENU_BUSINESS_SECURITY_GROUP,
  MENU_BUSINESS_LOAD_BALANCER,
  MENU_BUSINESS_CERT,
  MENU_BUSINESS_OPERATION_LOG,
  MENU_BUSINESS_TASK_MANAGEMENT,
  MENU_BUSINESS_RECYCLE_BIN,
} from './menu-symbol';
import { businessViews } from '@/views';

export interface IMenu {
  id: symbol | string;
  i18n: string;
  icon?: string;
  group?: string;
  route?: {
    name?: symbol | string;
    path: string;
  };
  menu?: IMenu[];
  visibility?: boolean | (() => boolean);
}

// const { ENABLE_CLOUD_SELECTION, ENABLE_ACCOUNT_BILL } = window.PROJECT_CONFIG;

const getMenuRoute = (views: RouteRecordRaw[], symbol: symbol | string) => {
  const menuView = Array.isArray(views) ? views.find((view) => view.name === symbol) : views;
  if (menuView) {
    return {
      name: menuView.name,
      path: menuView.path,
    };
  }
  return { name: '', path: '' };
};

const menus: IMenu[] = [
  {
    id: MENU_BUSINESS,
    i18n: '资源管理',
    // false 为隐藏菜单，通过地址栏访问可见子菜单
    visibility: true,
    menu: [
      {
        id: MENU_BUSINESS_HOST,
        i18n: '主机',
        icon: 'bkhcm-icon-host',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_HOST),
      },
      {
        id: MENU_BUSINESS_DRIVE,
        i18n: '硬盘',
        icon: 'bkhcm-icon-disk',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_DRIVE),
      },
      {
        id: MENU_BUSINESS_VPC,
        i18n: 'VPC',
        icon: 'bkhcm-icon-vpc',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_VPC),
      },
      {
        id: MENU_BUSINESS_SUBNET,
        i18n: '子网',
        icon: 'bkhcm-icon-subnet',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_SUBNET),
      },
      {
        id: MENU_BUSINESS_EIP,
        i18n: '弹性IP',
        icon: 'bkhcm-icon-eip',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_EIP),
      },
      {
        id: MENU_BUSINESS_NIF,
        i18n: '网络接口',
        icon: 'bkhcm-icon-network-interface',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_NIF),
      },
      {
        id: MENU_BUSINESS_ROUTE_TABLE,
        i18n: '路由表',
        icon: 'bkhcm-icon-route-table',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_ROUTE_TABLE),
      },
      {
        id: MENU_BUSINESS_SECURITY_GROUP,
        i18n: '安全组',
        icon: 'bkhcm-icon-security-group',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_SECURITY_GROUP),
      },
      {
        id: MENU_BUSINESS_LOAD_BALANCER,
        i18n: '负载均衡',
        icon: 'bkhcm-icon-loadbalancer',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_LOAD_BALANCER),
      },
      {
        id: MENU_BUSINESS_CERT,
        i18n: '证书托管',
        icon: 'bkhcm-icon-cert',
        group: '资源',
        route: getMenuRoute(businessViews, MENU_BUSINESS_CERT),
      },
      {
        id: MENU_BUSINESS_OPERATION_LOG,
        i18n: '操作记录',
        icon: 'bkhcm-icon-operation-record',
        group: '其他',
        route: getMenuRoute(businessViews, MENU_BUSINESS_OPERATION_LOG),
      },
      {
        id: MENU_BUSINESS_TASK_MANAGEMENT,
        i18n: '任务管理',
        icon: 'bkhcm-icon-bushu',
        group: '其他',
        route: getMenuRoute(businessViews, MENU_BUSINESS_TASK_MANAGEMENT),
      },
      {
        id: MENU_BUSINESS_RECYCLE_BIN,
        i18n: '回收站',
        icon: 'bkhcm-icon-recyclebin',
        group: '回收站',
        route: getMenuRoute(businessViews, MENU_BUSINESS_RECYCLE_BIN),
      },
    ],
  },
  {
    id: MENU_SERVICE,
    i18n: '服务请求',
    menu: [
      {
        id: MENU_BUSINESS_HOST,
        i18n: '单据管理',
        icon: 'bkhcm-icon-my-apply',
        route: getMenuRoute(businessViews, MENU_BUSINESS_HOST),
      },
    ],
  },
  // {
  //   id: MENU_BILL,
  //   i18n: '账号管理',
  //   visibility: ENABLE_ACCOUNT_BILL === 'true',
  //   menu: [
  //     {
  //       id: MENU_BUSINESS_HOST,
  //       i18n: '云账号管理',
  //       icon: 'bkhcm-icon-my-apply',
  //       route: getMenuRoute(businessViews, MENU_BUSINESS_HOST),
  //     },
  //   ],
  // },
  // {
  //   id: MENU_RESOURCE,
  //   i18n: '资源接入',
  // },
  // {
  //   id: MENU_SCHEME,
  //   i18n: '资源选型',
  //   visibility: ENABLE_CLOUD_SELECTION === 'true',
  // },
];

export const getMenus = () => {
  return menus.filter((menu) => {
    if (!Object.prototype.hasOwnProperty.call(menu, 'visibility')) {
      return true;
    }

    if (typeof menu.visibility === 'function') {
      return menu.visibility();
    }

    return menu.visibility;
  });
};
