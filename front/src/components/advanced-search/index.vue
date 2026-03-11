<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { Plus } from 'bkui-vue/lib/icon';
import { QueryRuleOPEnum } from '@/typings';
import type { ModelPropertySearch } from '@/model/typings';
import type { ISearchCondition } from '@/typings';
import type { IActiveTag, IConditionItem, IFavoriteItem, IFavoriteStorage } from './typings';
import { getOperatorsForType } from './constants';
import useFavorites from './use-favorites';
import SearchGrid from './search-grid.vue';
import FavoritesPopover from './favorites-popover.vue';
import ActiveTags from './active-tags.vue';

defineOptions({ name: 'AdvancedSearch' });

const props = withDefaults(
  defineProps<{
    fields: ModelPropertySearch[];
    defaultFieldIds?: string[];
    condition?: ISearchCondition;
    columnsPerRow?: number;
    collapsedRows?: number;
    favoritesKey?: string;
    favoriteStorage?: IFavoriteStorage;
  }>(),
  {
    defaultFieldIds: undefined,
    condition: () => ({}),
    columnsPerRow: 5,
    collapsedRows: 2,
    favoritesKey: '',
  },
);

const emit = defineEmits<{
  (e: 'search', condition: ISearchCondition): void;
  (e: 'reset'): void;
}>();

const formValues = ref<ISearchCondition>({});
const addedConditions = ref<IConditionItem[]>([]);
const searchGridRef = useTemplateRef<InstanceType<typeof SearchGrid>>('searchGridRef');
const addPopoverRef = useTemplateRef('addPopoverRef');
const panelExpanded = ref(true);
let initValues: ISearchCondition;

const { favorites, activeFavoriteId, addFavorite, updateFavorite, removeFavorite, selectFavorite, clearActive } =
  useFavorites(props.favoritesKey, props.favoriteStorage);

const isFavoriteActive = computed(() => activeFavoriteId.value !== null);

const fieldMap = computed(() => {
  const map: Record<string, ModelPropertySearch> = {};
  props.fields.forEach((f) => {
    map[f.id] = f;
  });
  return map;
});

const defaultFields = computed(() => {
  if (!props.defaultFieldIds) return props.fields;
  return props.defaultFieldIds.map((id) => fieldMap.value[id]).filter(Boolean);
});

const addableFields = computed(() => {
  if (!props.defaultFieldIds) return [];
  const defaultSet = new Set(props.defaultFieldIds);
  const addedSet = new Set(addedConditions.value.map((c) => c.field));
  return props.fields.filter((f) => !defaultSet.has(f.id) && !addedSet.has(f.id));
});

const hasAddableFields = computed(() => addableFields.value.length > 0);

watch(
  () => props.condition,
  (condition) => {
    formValues.value = { ...condition };
    if (!initValues) {
      initValues = { ...formValues.value };
    }
  },
  { deep: true, immediate: true },
);

const getMergedCondition = (): ISearchCondition => {
  const merged: ISearchCondition = { ...formValues.value };
  addedConditions.value.forEach((cond) => {
    if (cond.value !== undefined && cond.value !== '' && cond.value !== null) {
      merged[cond.field] = cond.value;
    }
  });
  return merged;
};

const handleSearch = () => {
  clearActive();
  emit('search', getMergedCondition());
};

const handleReset = () => {
  formValues.value = { ...initValues };
  addedConditions.value = [];
  clearActive();
  emit('reset');
};

const handleAddField = (field: ModelPropertySearch) => {
  const operators = getOperatorsForType(field.type, field.meta?.search?.props?.operators);
  const defaultOp = (field.meta?.search?.op ?? operators[0] ?? QueryRuleOPEnum.EQ) as QueryRuleOPEnum;
  addedConditions.value.push({
    uid: `${field.id}_${Date.now()}`,
    field: field.id,
    op: defaultOp,
    value: undefined,
  });
};

const handleUpdateCondition = (index: number, cond: IConditionItem) => {
  addedConditions.value[index] = cond;
};

const handleRemoveCondition = (uid: string) => {
  addedConditions.value = addedConditions.value.filter((c) => c.uid !== uid);
};

// Active tags
const activeTagList = computed<IActiveTag[]>(() => {
  const tags: IActiveTag[] = [];
  for (const field of defaultFields.value) {
    const val = formValues.value[field.id];
    if (isValuePresent(val)) {
      tags.push({ id: field.id, property: field, value: val });
    }
  }
  addedConditions.value.forEach((cond) => {
    if (isValuePresent(cond.value) && fieldMap.value[cond.field]) {
      tags.push({ id: cond.uid, property: fieldMap.value[cond.field], value: cond.value, op: cond.op });
    }
  });
  return tags;
});

const isValuePresent = (val: any): boolean => {
  if (val === undefined || val === null || val === '') return false;
  if (Array.isArray(val) && val.length === 0) return false;
  return true;
};

const handleRemoveTag = (tag: IActiveTag) => {
  if (Object.hasOwn(formValues.value, tag.id)) {
    const updated = { ...formValues.value };
    delete updated[tag.id];
    formValues.value = updated;
    return;
  }
  addedConditions.value = addedConditions.value.filter((c) => c.uid !== tag.id);
};

const handleClearAll = () => {
  handleReset();
};

const handleAddFavorite = (name: string) => {
  addFavorite(name, formValues.value, addedConditions.value);
};

const handleSelectFavorite = (item: IFavoriteItem) => {
  formValues.value = { ...item.condition };
  addedConditions.value = [...item.conditions];
  selectFavorite(item.id);
};

const handleRenameFavorite = (id: string, name: string) => {
  updateFavorite(id, name);
};

const handleRemoveFavorite = (id: string) => {
  removeFavorite(id);
};
</script>

<template>
  <div class="advanced-search">
    <!-- 填写态：完整搜索表单 -->
    <div v-show="panelExpanded" class="advanced-search__form">
      <search-grid
        ref="searchGridRef"
        :fields="defaultFields"
        :added-conditions="addedConditions"
        :field-map="fieldMap"
        :form-values="formValues"
        :columns-per-row="columnsPerRow"
        :collapsed-rows="collapsedRows"
        @update:form-values="formValues = $event"
        @update-condition="handleUpdateCondition"
        @remove-condition="handleRemoveCondition"
      >
        <template #actions>
          <!-- 收藏 -->
          <bk-popover v-if="favoritesKey" trigger="click" theme="light" placement="bottom-start">
            <div class="action-icon" :class="{ active: isFavoriteActive }">
              <i
                :class="['hcm-icon', isFavoriteActive ? 'bkhcm-icon-not-favorited active' : 'bkhcm-icon-not-favorited']"
              />
            </div>
            <template #content>
              <favorites-popover
                :favorites="favorites"
                :active-favorite-id="activeFavoriteId"
                @select="handleSelectFavorite"
                @add="handleAddFavorite"
                @rename="handleRenameFavorite"
                @remove="handleRemoveFavorite"
              />
            </template>
          </bk-popover>

          <!-- 添加字段 -->
          <bk-popover
            v-if="hasAddableFields"
            ref="addPopoverRef"
            trigger="click"
            theme="light"
            placement="bottom-start"
          >
            <div class="action-icon">
              <plus />
            </div>
            <template #content>
              <div class="field-select-list">
                <div
                  v-for="field in addableFields"
                  :key="field.id"
                  class="field-select-item"
                  @click="handleAddField(field)"
                >
                  {{ field.name }}
                </div>
              </div>
            </template>
          </bk-popover>

          <bk-button theme="primary" @click="handleSearch">查询</bk-button>
          <bk-button @click="handleReset">重置</bk-button>
        </template>
      </search-grid>
    </div>

    <!-- 详情态：仅展示当前有值的条件标签 -->
    <active-tags v-show="!panelExpanded" :tags="activeTagList" @remove="handleRemoveTag" @clear-all="handleClearAll" />

    <!-- 高级筛选 toggle -->
    <div class="panel-toggle" @click="panelExpanded = !panelExpanded">
      <span>高级筛选</span>
      <i :class="['hcm-icon', panelExpanded ? 'bkhcm-icon-angle-up-fill' : 'bkhcm-icon-angle-down-fill']" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.advanced-search {
  background: #fff;
  box-shadow: 0 2px 4px 0 #1919290d;
  border-radius: 2px;
  padding: 16px 24px;
  margin-bottom: 16px;
  position: relative;
  z-index: 3;
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 16px;
  color: #979ba5;

  &:hover {
    color: #3a84ff;
  }

  &.active {
    .hcm-icon {
      color: #ffb848;
    }
  }

  .hcm-icon {
    font-size: 16px;
    color: #c4c6cc;

    &.active {
      color: #ffb848;
    }
  }

  &:hover .hcm-icon {
    color: #979ba5;

    &.active {
      color: #ffb848;
    }
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

.panel-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  margin-top: 8px;
  font-size: 12px;
  color: #3a84ff;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: #699df4;
  }

  .hcm-icon {
    font-size: 14px;
  }
}

:deep(.bk-button) {
  min-width: 86px;
}
</style>
