// import business from '@/router/module/business';
import type { RouteRecordRaw } from 'vue-router';

import host from '@/views/host/route-config';
import drive from '@/views/drive/route-config';
import vpc from '@/views/vpc/route-config';
import subnet from '@/views/subnet/route-config';
import eip from '@/views/eip/route-config';
import networkInterface from '@/views/network-interface/route-config';
import routeTable from '@/views/route-table/route-config';
import securityGroup from '@/views/security-group/route-config';
import loadBalancer from '@/views/load-balancer/route-config';
import cert from '@/views/cert/route-config';
import operationLog from '@/views/operation-log/route-config';
import task from '@/views/task/route-config';

import serviceApply from '@/views/service/route-config';

import statusError from '@/views/status/error.vue';
import statusBusiness from '@/views/status/business.vue';
import statusPermission from '@/views/status/permission.vue';
import { MENU_BUSINESS } from '@/constants/menu-symbol';

const injectStatusComponents = (routes: RouteRecordRaw[]) => {
  routes.forEach((route) => {
    route.components = {
      default: route.component,
      error: statusError,
    };

    if (route.meta?.owner === MENU_BUSINESS) {
      route.components.permission = statusBusiness;
    } else {
      route.components.permission = statusPermission;
    }
  });

  return routes;
};

export const businessViews = injectStatusComponents([
  ...host,
  ...drive,
  ...vpc,
  ...subnet,
  ...eip,
  ...networkInterface,
  ...routeTable,
  ...securityGroup,
  ...loadBalancer,
  ...cert,
  ...operationLog,
  ...task,
]);

export const serviceViews = injectStatusComponents([...serviceApply]);

export default {
  ...businessViews,
  ...serviceViews,
};
