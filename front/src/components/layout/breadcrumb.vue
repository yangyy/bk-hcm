<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useBreadcrumb from '@/hooks/use-breadcrumb';
import type { RouteMetaConfig } from '@/router/meta';
import routerAction from '@/router/utils/action';
import { HistoryStorage } from '@/router/utils/history-storage';

const breadcrumb = useBreadcrumb();
const route = useRoute();

const currentTitle = computed(() => {
  const routeMeta = route.meta as RouteMetaConfig;
  return breadcrumb.data.title ?? routeMeta?.menu?.i18n;
});

const defaultFrom = computed(() => {
  const routeMeta = route.meta as RouteMetaConfig;
  const menu = routeMeta.menu || {};
  if (menu.relative) {
    return { name: Array.isArray(menu.relative) ? menu.relative[0] : menu.relative };
  }
  return null;
});

const from = computed(() => {
  if (Object.hasOwn(route.query, '_f')) {
    try {
      return HistoryStorage.pop();
    } catch (error) {
      return defaultFrom.value;
    }
  }
  return defaultFrom.value;
});

const handleBack = () => {
  routerAction.redirect(from.value, { back: true });
};
</script>

<template>
  <div class="hcm-breadcrumb">
    <div class="breadcrumb-content">
      <i v-if="from" @click="handleBack" class="icon hcm-icon bkhcm-icon-arrows--left-line pr10 back-icon" />
      <span class="breadcrumb-name">{{ currentTitle }}</span>
    </div>
    <div id="breadcrumbExtra" class="breadcrumb-extra"></div>
  </div>
</template>

<style lang="scss" scoped>
.hcm-breadcrumb {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.04);
}

.breadcrumb-content {
  display: flex;
  align-items: center;

  .breadcrumb-name {
    font-size: 16px;
    letter-spacing: 0;
    color: #313238;
  }

  .back-icon {
    font-weight: bold;
    font-size: 16px;
    color: #3a84ff;
    cursor: pointer;
  }
}

.breadcrumb-extra {
  margin-left: auto;
}
</style>
