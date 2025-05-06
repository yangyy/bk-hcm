<script setup lang="ts">
import { ComputedRef, inject } from 'vue';
import { type IMenu } from '@/constants/menu';

defineProps<{ menu: IMenu }>();

const isBusinessNav = inject<ComputedRef<boolean>>('isBusinessNav');
const bizId = inject<ComputedRef<number>>('bizId');

const getMenuLink = (menu: IMenu) => {
  if (isBusinessNav.value) {
    return {
      name: menu.route.name,
      params: {
        bizId: bizId.value,
      },
    };
  }
  return menu.route;
};
</script>

<template>
  <router-link :to="getMenuLink(menu)">
    <bk-menu-item>
      <template #icon>
        <i :class="['hcm-icon', menu.icon]" />
      </template>
      {{ menu.i18n }}
    </bk-menu-item>
  </router-link>
</template>
