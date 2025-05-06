import type { RouteRecordRaw } from 'vue-router';
import Meta from '@/router/meta';
import { LBRouteName } from '@/constants';
import {
  MENU_BUSINESS,
  MENU_BUSINESS_LOAD_BALANCER,
  MENU_BUSINESS_LOAD_BALANCER_LB_VIEW,
  MENU_BUSINESS_LOAD_BALANCER_TG_VIEW,
} from '@/constants/menu-symbol';

export default [
  {
    name: MENU_BUSINESS_LOAD_BALANCER,
    path: 'loadbalancer',
    component: () => import('@/views/business/load-balancer/index'),
    redirect: { name: MENU_BUSINESS_LOAD_BALANCER_LB_VIEW },
    children: [
      {
        name: MENU_BUSINESS_LOAD_BALANCER_LB_VIEW,
        path: 'clb-view',
        component: () => import('@/views/business/load-balancer/clb-view/index'),
        children: [
          {
            path: '',
            name: LBRouteName.allLbs,
            component: () => import('@/views/business/load-balancer/clb-view/all-clbs-manager/index'),
            props(route) {
              return route.query;
            },
            meta: {
              type: 'all',
              isFilterAccount: true,
            },
          },
          {
            path: 'lb/:id',
            name: LBRouteName.lb,
            component: () => import('@/views/business/load-balancer/clb-view/specific-clb-manager/index'),
            props(route) {
              return { ...route.params, ...route.query };
            },
            meta: {
              type: 'lb',
              rootRoutePath: '/business/loadbalancer/clb-view',
            },
          },
          {
            path: 'listener/:id',
            name: LBRouteName.listener,
            component: () => import('@/views/business/load-balancer/clb-view/specific-listener-manager/index'),
            props(route) {
              return { ...route.params, ...route.query };
            },
            meta: {
              type: 'listener',
              rootRoutePath: '/business/loadbalancer/clb-view',
            },
          },
          {
            path: 'domain/:id',
            name: LBRouteName.domain,
            component: () => import('@/views/business/load-balancer/clb-view/specific-domain-manager/index'),
            props(route) {
              return { ...route.params, ...route.query };
            },
            meta: {
              type: 'domain',
              rootRoutePath: '/business/loadbalancer/clb-view',
            },
          },
        ],
      },
      {
        name: MENU_BUSINESS_LOAD_BALANCER_TG_VIEW,
        path: 'group-view',
        component: () => import('@/views/business/load-balancer/group-view/index'),
        children: [
          {
            path: '',
            name: LBRouteName.allTgs,
            component: () => import('@/views/business/load-balancer/group-view/all-groups-manager/index'),
            props(route) {
              return route.query;
            },
          },
          {
            path: ':id',
            name: LBRouteName.tg,
            component: () => import('@/views/business/load-balancer/group-view/specific-target-group-manager/index'),
            props(route) {
              return { ...route.params, ...route.query };
            },
            meta: {
              rootRoutePath: '/business/loadbalancer/group-view',
            },
          },
        ],
        meta: {
          isFilterAccount: true,
        },
      },
    ],
    meta: {
      ...new Meta({
        owner: MENU_BUSINESS,
        menu: {
          i18n: '负载均衡',
          relative: MENU_BUSINESS,
        },
        layout: {
          breadcrumb: {
            show: false,
          },
        },
      }),
    },
  },
] as RouteRecordRaw[];
