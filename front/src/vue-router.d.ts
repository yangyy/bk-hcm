import 'vue-router';
import type { RouteMetaConfig } from './router/meta';

// 扩展 RouteMeta 接口
declare module 'vue-router' {
  interface RouteMeta extends RouteMetaConfig {
    available?: boolean;
  }
}
