<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import useBreadcrumb from '@/hooks/use-breadcrumb';
import HcmBreadcrumb from './breadcrumb.vue';

const route = useRoute();
const breadcrumb = useBreadcrumb();

const showBreadcrumb = computed(() => breadcrumb.data.display);

const view = computed(() => route.meta.view);
</script>

<template>
  <div :class="['main-content', { 'no-breadcrumb': !showBreadcrumb }]">
    <hcm-breadcrumb v-if="showBreadcrumb" />
    <div class="main-layout g-scroller">
      <router-view :name="view" class="main-view" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .main-layout {
    height: calc(100% - 52px);
    overflow: auto;

    .main-view {
      min-width: 1089px;
      height: 100%;
      overflow: hidden;
    }

    &.no-breadcrumb {
      height: 100%;
    }
  }
}
</style>
