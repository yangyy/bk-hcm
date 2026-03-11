<script setup lang="ts">
import { computed, ref } from 'vue';
import type { ModelPropertySearch } from '@/model/typings';
import { QueryRuleOPEnum } from '@/typings';
import type { IConditionItem } from './typings';
import { getOperatorsForType } from './constants';
import ConditionItem from './condition-item.vue';

defineOptions({ name: 'AdvancedConditionPanel' });

const props = defineProps<{
  conditionFields: ModelPropertySearch[];
  conditions: IConditionItem[];
}>();

const emit = defineEmits<{
  (e: 'update:conditions', val: IConditionItem[]): void;
}>();

const fieldPopoverRef = ref();

const availableFields = computed(() => {
  const usedFields = new Set(props.conditions.map((c) => c.field));
  return props.conditionFields.filter((f) => !usedFields.has(f.id));
});

const fieldMap = computed(() => {
  const map: Record<string, ModelPropertySearch> = {};
  props.conditionFields.forEach((f) => {
    map[f.id] = f;
  });
  return map;
});

const addCondition = (field: ModelPropertySearch) => {
  const operators = getOperatorsForType(field.type, field.meta?.search?.props?.operators);
  const defaultOp = field.meta?.search?.op ?? operators[0] ?? QueryRuleOPEnum.EQ;

  const newCondition: IConditionItem = {
    uid: `${field.id}_${Date.now()}`,
    field: field.id,
    op: defaultOp as QueryRuleOPEnum,
    value: undefined,
  };

  emit('update:conditions', [...props.conditions, newCondition]);
};

const openFieldSelect = () => {
  fieldPopoverRef.value?.show();
};

const updateCondition = (index: number, updated: IConditionItem) => {
  const list = [...props.conditions];
  list[index] = updated;
  emit('update:conditions', list);
};

const removeCondition = (index: number) => {
  const list = props.conditions.filter((_, i) => i !== index);
  emit('update:conditions', list);
};

defineExpose({ openFieldSelect });
</script>

<template>
  <div v-if="conditionFields.length" class="condition-panel">
    <div class="condition-list">
      <condition-item
        v-for="(cond, index) in conditions"
        :key="cond.uid"
        :condition="cond"
        :field="fieldMap[cond.field]"
        @update:condition="updateCondition(index, $event)"
        @remove="removeCondition(index)"
      />
    </div>

    <bk-popover
      v-if="availableFields.length"
      ref="fieldPopoverRef"
      trigger="click"
      theme="light"
      placement="bottom-start"
    >
      <div class="add-condition-btn">
        <i class="hcm-icon bkhcm-icon-plus-circle-shape" />
      </div>
      <template #content>
        <div class="field-select-list">
          <div v-for="field in availableFields" :key="field.id" class="field-select-item" @click="addCondition(field)">
            {{ field.name }}
          </div>
        </div>
      </template>
    </bk-popover>
  </div>
</template>

<style scoped lang="scss">
.condition-panel {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.condition-list {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.add-condition-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  flex-shrink: 0;
  color: #3a84ff;
  font-size: 16px;

  &:hover {
    color: #699df4;
  }
}

.field-select-list {
  max-height: 240px;
  overflow-y: auto;
  min-width: 120px;

  .field-select-item {
    padding: 8px 16px;
    font-size: 12px;
    color: #63656e;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background: #f0f1f5;
      color: #3a84ff;
    }
  }
}
</style>
