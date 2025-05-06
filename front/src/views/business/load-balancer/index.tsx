import { computed, defineComponent, provide } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { Senarios, useWhereAmI } from '@/hooks/useWhereAmI';
import { MENU_BUSINESS_LOAD_BALANCER_LB_VIEW, MENU_BUSINESS_LOAD_BALANCER_TG_VIEW } from '@/constants/menu-symbol';
import './index.scss';

export default defineComponent({
  name: 'LoadBalancer',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const { whereAmI } = useWhereAmI();

    const TAB_LIST = [
      { routeName: MENU_BUSINESS_LOAD_BALANCER_LB_VIEW, label: '负载均衡视角' },
      { routeName: MENU_BUSINESS_LOAD_BALANCER_TG_VIEW, label: '目标组视角' },
    ];

    const createClbActionName = computed(() => {
      if (whereAmI.value === Senarios.business) return 'biz_clb_resource_create';
      return 'clb_resource_create';
    });
    const deleteClbActionName = computed(() => {
      if (whereAmI.value === Senarios.business) return 'biz_clb_resource_delete';
      return 'clb_resource_delete';
    });
    provide('createClbActionName', createClbActionName);
    provide('deleteClbActionName', deleteClbActionName);

    const isActive = (name: symbol) => {
      return route.matched?.[2]?.name === name;
    };

    const handleTabChange = (name: symbol) => {
      router.push({ name });
    };

    return () => (
      <div class='business-loadbalancer-module'>
        <header class='module-header'>
          <section class='title-wrap'>负载均衡</section>
          <section class='tab-list-wrap'>
            {TAB_LIST.map(({ routeName, label }) => {
              return (
                <div
                  key={routeName}
                  class={`tab-item${isActive(routeName) ? ' active' : ''}`}
                  onClick={() => handleTabChange(routeName)}>
                  {label}
                </div>
              );
            })}
          </section>
        </header>
        <section class='module-page-container'>
          <RouterView></RouterView>
        </section>
      </div>
    );
  },
});
