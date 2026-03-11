<script setup lang="ts">
import DisplayValue from '@/components/display-value/index.vue';
import type { IActiveTag } from './typings';
import { getOperatorLabel } from './constants';

defineOptions({ name: 'AdvancedSearchActiveTags' });

defineProps<{
  tags: IActiveTag[];
}>();

const emit = defineEmits<{
  (e: 'remove', tag: IActiveTag): void;
  (e: 'clear-all'): void;
}>();
</script>

<template>
  <div v-if="tags.length" class="active-tags">
    <div class="tags-list">
      <bk-tag v-for="tag in tags" :key="tag.id" closable @close="emit('remove', tag)">
        <span class="tag-field">{{ tag.property.name }}</span>
        <span v-if="tag.op" class="tag-op">{{ getOperatorLabel(tag.op) }}</span>
        <display-value :value="tag.value" :property="tag.property" :display="{ on: 'search' }" />
      </bk-tag>
    </div>
    <i class="hcm-icon bkhcm-icon-delete clear-btn" @click="emit('clear-all')" />
  </div>
</template>

<style scoped lang="scss">
.active-tags {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 4px 24px;
  border-top: 1px solid #f0f1f5;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  gap: 4px;
  min-width: 0;

  :deep(.bk-tag) {
    max-width: 240px;
  }

  .tag-field {
    margin-right: 2px;
    color: #313238;
  }

  .tag-op {
    margin-right: 2px;
    color: #979ba5;
  }
}

.clear-btn {
  flex-shrink: 0;
  font-size: 16px;
  color: #c4c6cc;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    color: #3a84ff;
  }
}
</style>
