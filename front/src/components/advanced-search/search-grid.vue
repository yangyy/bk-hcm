<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ModelPropertySearch } from '@/model/typings';
import type { QueryRuleOPEnum, ISearchCondition } from '@/typings';
import type { IConditionItem } from './typings';
import { getOperatorsForType, getOperatorLabel, hasOperatorSelector } from './constants';

defineOptions({ name: 'AdvancedSearchGrid' });

const props = withDefaults(
  defineProps<{
    fields: ModelPropertySearch[];
    addedConditions: IConditionItem[];
    fieldMap: Record<string, ModelPropertySearch>;
    formValues: ISearchCondition;
    columnsPerRow?: number;
    collapsedRows?: number;
  }>(),
  {
    columnsPerRow: 5,
    collapsedRows: 2,
  },
);

const emit = defineEmits<{
  (e: 'update:formValues', val: ISearchCondition): void;
  (e: 'updateCondition', index: number, cond: IConditionItem): void;
  (e: 'removeCondition', uid: string): void;
}>();

const expanded = ref(false);

const defaultFieldRows = computed(() => Math.ceil(props.fields.length / props.columnsPerRow));
const needsExpand = computed(() => defaultFieldRows.value > props.collapsedRows);

const maxVisibleFields = computed(() => {
  if (expanded.value || !needsExpand.value) return Infinity;
  return props.collapsedRows * props.columnsPerRow;
});

const isFieldVisible = (index: number) => index < maxVisibleFields.value;

const toggleExpand = () => {
  expanded.value = !expanded.value;
};

const updateValue = (fieldId: string, value: any) => {
  emit('update:formValues', { ...props.formValues, [fieldId]: value });
};

const getSearchCompProps = (field: ModelPropertySearch) => {
  const extra = field.meta?.search?.props ?? {};
  return { option: field.option, ...extra };
};

const getConditionField = (cond: IConditionItem) => props.fieldMap[cond.field];

const showConditionOp = (cond: IConditionItem) => {
  const field = getConditionField(cond);
  if (!field) return false;
  return hasOperatorSelector(field.type, field.meta?.search?.props?.hideOperator as boolean | undefined);
};

const getConditionOps = (cond: IConditionItem) => {
  const field = getConditionField(cond);
  if (!field) return [];
  return getOperatorsForType(field.type, field.meta?.search?.props?.operators as QueryRuleOPEnum[] | undefined);
};

const updateConditionOp = (index: number, op: QueryRuleOPEnum) => {
  emit('updateCondition', index, { ...props.addedConditions[index], op });
};

const updateConditionValue = (index: number, value: any) => {
  emit('updateCondition', index, { ...props.addedConditions[index], value });
};

defineExpose({ expanded, needsExpand, toggleExpand });
</script>

<template>
  <div class="search-grid-wrapper">
    <!-- 默认字段区域 -->
    <div class="search-grid" :style="{ '--columns': columnsPerRow }">
      <div v-for="(field, idx) in fields" :key="field.id" v-show="isFieldVisible(idx)" class="grid-item">
        <div class="item-label">{{ field.name }}</div>
        <div class="item-control">
          <component
            :is="`hcm-search-${field.type}`"
            :model-value="formValues[field.id]"
            v-bind="getSearchCompProps(field)"
            @update:model-value="updateValue(field.id, $event)"
          />
        </div>
      </div>
    </div>

    <!-- 展开/收起控制 -->
    <div v-if="needsExpand" class="expand-toggle" @click="toggleExpand">
      <i :class="['hcm-icon', expanded ? 'bkhcm-icon-angle-up-fill' : 'bkhcm-icon-angle-down-fill']" />
    </div>

    <!-- 动态添加的字段 + 操作按钮 -->
    <div class="search-grid search-grid--conditions" :style="{ '--columns': columnsPerRow }">
      <div v-for="(cond, idx) in addedConditions" :key="cond.uid" class="grid-item grid-item--added">
        <div class="item-label item-label--removable">
          <span>{{ getConditionField(cond)?.name }}</span>
          <i class="hcm-icon bkhcm-icon-close-circle-fill remove-btn" @click="emit('removeCondition', cond.uid)" />
        </div>
        <div v-if="showConditionOp(cond)" class="item-op">
          <bk-select :model-value="cond.op" :clearable="false" @update:model-value="updateConditionOp(idx, $event)">
            <bk-option v-for="op in getConditionOps(cond)" :key="op" :id="op" :name="getOperatorLabel(op)" />
          </bk-select>
        </div>
        <div class="item-control">
          <component
            :is="`hcm-search-${getConditionField(cond)?.type}`"
            :model-value="cond.value"
            v-bind="getSearchCompProps(getConditionField(cond))"
            @update:model-value="updateConditionValue(idx, $event)"
          />
        </div>
      </div>

      <div class="grid-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.search-grid-wrapper {
  position: relative;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  padding: 1px 0 0 1px;
}

.grid-item {
  display: flex;
  height: 48px;
  margin: -1px 0 0 -1px;
  z-index: 0;

  &:focus-within {
    z-index: 1;
  }
}

.item-label {
  flex-shrink: 0;
  padding: 0 12px;
  font-size: 12px;
  color: #63656e;
  white-space: nowrap;
  border: 1px solid #dcdee5;
  border-right: none;
  background: #fafbfd;
  height: 100%;
  display: flex;
  align-items: center;
}

.item-label--removable {
  gap: 4px;
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

.item-op {
  flex-shrink: 0;
  width: 80px;
  height: 100%;
  position: relative;
  z-index: 1;

  & + .item-control {
    margin-left: -1px;
  }

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

.item-control {
  flex: 1;
  min-width: 0;
  height: 100%;
  position: relative;

  &:focus-within {
    z-index: 2;
  }

  :deep(.bk-select),
  :deep(.bk-input),
  :deep(.bk-date-picker) {
    width: 100%;
    height: 100% !important;
    border-radius: 0;
  }

  :deep(.bk-tag-input) {
    width: 100%;
    height: 100% !important;
    border: 1px solid #c4c6cc;
    border-radius: 0;
    display: flex;
    align-items: center;
  }

  :deep(.bk-tag-input:focus-within) {
    border-color: #3a84ff;
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

  :deep(.bk-select .bk-input--text),
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
    border: none !important;
    border-radius: 0;
    width: 100%;

    &.active {
      height: auto !important;
      min-height: 100%;
      position: relative;
      z-index: 3;
      background: #fff;
      border: 1px solid #3a84ff !important;
      box-shadow: 0 4px 8px -2px rgba(0, 0, 0, 0.1);

      .tag-list {
        max-height: none !important;
        overflow: visible !important;
        flex-wrap: wrap;
      }
    }
  }
}

.search-grid--conditions {
  margin-top: -1px;
}

.grid-actions {
  display: flex;
  align-items: center;
  height: 48px;
  flex-shrink: 0;
  margin-top: -1px;
}

.expand-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 24px;
  margin: 0 auto;
  font-size: 14px;
  color: #3a84ff;
  cursor: pointer;
  user-select: none;
  border: 1px solid #dcdee5;
  border-top: none;
  border-radius: 0 0 4px 4px;
  background: #fff;

  &:hover {
    background: #f0f1f5;
  }
}
</style>

<style lang="scss">
.search-grid .grid-item:has(.popover-show),
.search-grid .grid-item:has(.bk-tag-input-trigger.active) {
  z-index: 1;
}

.search-grid .bk-tag-input:has(.bk-tag-input-trigger.active) {
  border-color: transparent !important;
  overflow: visible !important;
}
</style>
