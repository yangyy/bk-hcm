<script setup lang="ts">
import { computed } from 'vue';
import type { ModelPropertySearch } from '@/model/typings';
import type { QueryRuleOPEnum } from '@/typings';
import type { IConditionItem } from './typings';
import { getOperatorsForType, getOperatorLabel, hasOperatorSelector } from './constants';

defineOptions({ name: 'AdvancedConditionItem' });

const props = defineProps<{
  condition: IConditionItem;
  field: ModelPropertySearch;
}>();

const emit = defineEmits<{
  (e: 'update:condition', val: IConditionItem): void;
  (e: 'remove'): void;
}>();

const operators = computed(() => {
  const customOps = props.field.meta?.search?.props?.operators as QueryRuleOPEnum[] | undefined;
  return getOperatorsForType(props.field.type, customOps);
});

const showOperator = computed(() => {
  const hide = props.field.meta?.search?.props?.hideOperator as boolean | undefined;
  return hasOperatorSelector(props.field.type, hide);
});

const updateOp = (op: QueryRuleOPEnum) => {
  emit('update:condition', { ...props.condition, op });
};

const updateValue = (value: any) => {
  emit('update:condition', { ...props.condition, value });
};

const getSearchCompProps = () => {
  const extra = props.field.meta?.search?.props ?? {};
  return {
    option: props.field.option,
    ...extra,
  };
};
</script>

<template>
  <div class="condition-item">
    <div class="condition-field" @click.stop>
      <span class="field-name">{{ field.name }}</span>
      <i class="hcm-icon bkhcm-icon-close-circle-fill remove-btn" @click="emit('remove')" />
    </div>

    <div v-if="showOperator" class="condition-op">
      <bk-select :model-value="condition.op" :clearable="false" @update:model-value="updateOp">
        <bk-option v-for="op in operators" :key="op" :id="op" :name="getOperatorLabel(op)" />
      </bk-select>
    </div>

    <div class="condition-value">
      <component
        :is="`hcm-search-${field.type}`"
        :model-value="condition.value"
        v-bind="getSearchCompProps()"
        @update:model-value="updateValue"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.condition-item {
  display: flex;
  align-items: center;
  height: 48px;
  min-width: 272px;
  flex: 1 1 272px;
  max-width: 380px;
}

.condition-field {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 0 12px;
  font-size: 12px;
  color: #63656e;
  white-space: nowrap;
  height: 100%;
  border: 1px solid #dcdee5;
  border-right: none;
  background: #fafbfd;
  cursor: default;

  .remove-btn {
    display: none;
    font-size: 14px;
    color: #c4c6cc;
    cursor: pointer;

    &:hover {
      color: #ea3636;
    }
  }

  &:hover .remove-btn {
    display: inline;
  }
}

.condition-op {
  flex-shrink: 0;
  width: 80px;
  height: 100%;

  :deep(.bk-select) {
    width: 100%;
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-select .bk-select-trigger) {
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-select .bk-select-tag),
  :deep(.bk-select .bk-input) {
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-select .bk-input--text) {
    height: 100% !important;
    border-radius: 0;
  }
}

.condition-value {
  flex: 1;
  min-width: 0;
  height: 100%;

  :deep(.bk-select),
  :deep(.bk-input),
  :deep(.bk-date-picker),
  :deep(.bk-tag-input) {
    width: 100%;
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-select .bk-select-trigger) {
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-select .bk-select-tag) {
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-input .bk-input--text) {
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-date-picker .bk-date-picker-rel) {
    height: 100%;

    > div {
      height: 100%;
    }
  }

  :deep(.bk-date-picker .bk-date-picker-editor) {
    height: 100% !important;
    line-height: inherit;
    border-radius: 0;
  }

  :deep(.bk-date-picker .icon-wrapper) {
    height: 100% !important;
    display: flex;
    align-items: center;
  }

  :deep(.bk-tag-input .bk-tag-input-trigger) {
    height: 100% !important;
    border-radius: 0;

    .placeholder {
      height: 100% !important;
      line-height: inherit;
      display: flex;
      align-items: center;
    }
  }
}
</style>
