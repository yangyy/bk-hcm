<script lang="ts" setup>
import { computed, reactive, onMounted, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { provideBreadcrumb } from '@/hooks/use-breadcrumb';
import { providePermissionDialog } from '@/hooks/use-permission-dialog';
import HcmHeader from '@/components/layout/header.vue';
import HcmMenu from '@/components/layout/menu.vue';
import HcmFooter from '@/components/layout/footer.vue';
import HcmMainContent from '@/components/layout/main-content.vue';
import Notice from '@/views/notice/index.vue';
import PermissionApplyDialog from '@/components/permission/apply-dialog.vue';
import { MENU_BUSINESS_HOST, MENU_RESOURCE } from '@/constants/menu-symbol';

const { ENABLE_NOTICE } = window.PROJECT_CONFIG;
const { t } = useI18n();
const route = useRoute();

const isNeedSideMenu = computed(() => ![MENU_RESOURCE].includes(route.matched[0]?.name as symbol));
const hasFooter = computed(() => route.name === MENU_BUSINESS_HOST);

// 面包屑
provideBreadcrumb();

// 权限申请弹窗
const permissionDialogContext = providePermissionDialog();

// 导航布局状态
const navigationState = reactive({
  collapse: false,
});

const permissionDialogRef = useTemplateRef<InstanceType<typeof PermissionApplyDialog>>('permission-dialog');

onMounted(() => {
  window.hcmPermissionDialog = permissionDialogRef.value;
});

const handleCollapse = (collapse: boolean) => {
  navigationState.collapse = !collapse;
};
</script>

<template>
  <bk-navigation
    :class="['hcm-app', { 'has-footer': hasFooter }]"
    navigation-type="top-bottom"
    :side-title="t('海垒')"
    :default-open="!navigationState.collapse"
    :need-menu="isNeedSideMenu"
    @toggle="handleCollapse"
  >
    <template #side-icon>
      <img src="@/assets/image/logo.png" width="28" />
    </template>
    <template #header>
      <hcm-header />
    </template>
    <template #default>
      <hcm-main-content />
    </template>
    <template #menu>
      <hcm-menu />
    </template>
    <template #footer v-if="hasFooter">
      <hcm-footer />
    </template>
  </bk-navigation>
  <notice v-if="ENABLE_NOTICE === 'true'" />
  <permission-apply-dialog
    ref="permission-dialog"
    v-model="permissionDialogContext.isShow"
    :permission="permissionDialogContext.permission"
    :done="permissionDialogContext.done"
  />
</template>

<style lang="scss" scoped>
.hcm-app {
  :deep(.bk-navigation-wrapper) {
    .navigation-container {
      .container-content {
        padding: 0;
      }
    }
  }

  &.has-footer {
    :deep(.main-content) {
      height: calc(100% - 52px);
    }
  }

  :deep(.bk-navigation-wrapper) {
    .navigation-nav {
      .nav-slider {
        background-color: #2c354d;

        .business-selector-global {
          margin: 0 8px 10px 8px;
        }

        .bk-menu {
          background-color: #2c354d;

          .menu-warp {
            background-color: #2c354d;
          }
        }
      }
    }
  }
}
</style>
