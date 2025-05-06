import { type RouteLocationNormalizedLoaded } from 'vue-router';
import { useWhereAmI } from '@/hooks/useWhereAmI';
import { IAccountItem } from '@/typings';
import { ResourceTypeEnum } from '@/common/constant';
import { MENU_BUSINESS_CERT } from '@/constants/menu-symbol';

export default abstract class {
  accountFilter(
    list: IAccountItem[],
    {
      route,
      whereAmI,
      resourceType,
    }: {
      route: RouteLocationNormalizedLoaded;
      whereAmI: ReturnType<typeof useWhereAmI>;
      resourceType?: ResourceTypeEnum;
    },
  ) {
    const { isResourcePage } = whereAmI;
    // 负载均衡、目标组、证书托管、参数模板这四个暂时只腾讯云支持
    if (
      [MENU_BUSINESS_CERT].includes(route.name as symbol) ||
      (isResourcePage && route.query.type === 'certs') ||
      route.query.scene === 'template' ||
      (route.meta.isFilterAccount as boolean) ||
      resourceType === ResourceTypeEnum.CLB
    ) {
      return list.filter(this.filterfn);
    }
    return list;
  }

  abstract filterfn(value: IAccountItem, index: number, array: IAccountItem[]): unknown;
}
