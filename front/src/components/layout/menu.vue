<script setup lang="ts">
import { computed, provide } from 'vue';
import { useRoute } from 'vue-router';
import { getMenus, type IMenu } from '@/constants/menu';
import { MENU_BUSINESS } from '@/constants/menu-symbol';
import GlobalBusinessSelector from '@/components/business-selector/global.vue';
import MenuItem from './menu-item.vue';

const route = useRoute();

const topMenus = getMenus();

const ungrouped = Symbol('ungrouped');

const currentMenus = computed(() => {
  const topMenu = topMenus.find((menu) => menu.id === route.matched[0]?.name);
  const menus = topMenu?.menu ?? [];
  const menuGroup = new Map<string | symbol, IMenu[]>();
  for (const menu of menus) {
    const group = menu.group ?? ungrouped;
    if (menuGroup.has(group)) {
      menuGroup.set(group, [...menuGroup.get(group), menu]);
    } else {
      menuGroup.set(group, [menu]);
    }
  }
  return menuGroup;
});

const isBusinessNav = computed(() => {
  const {
    matched: [topRoute],
  } = route;
  return topRoute?.name === MENU_BUSINESS;
});

const bizId = computed(() => Number(route.params.bizId));

const handleChangeBusiness = (_id: number) => {
  // console.log(id, 'handleChangeBusiness');
};

provide('isBusinessNav', isBusinessNav);
provide('bizId', bizId);
</script>

<template>
  <bk-menu>
    <global-business-selector :value="bizId" @change="handleChangeBusiness" v-if="isBusinessNav" />
    <bk-menu :unique-open="false" active-key="腾讯微视">
      <template v-for="[group, menus] of currentMenus">
        <template v-if="group === ungrouped">
          <menu-item v-for="menu in menus" :key="menu.id" :menu="menu" />
        </template>
        <bk-menu-group v-else :name="group" :key="group">
          <menu-item v-for="menu in menus" :key="menu.id" :menu="menu" />
        </bk-menu-group>
      </template>
    </bk-menu>
  </bk-menu>
</template>
