<script setup lang="ts">
import { ref, watch } from 'vue';
import { PaginationType, SortType } from '@/typings';
import { ModelPropertyColumn } from '@/model/typings';
import useTableSettings from '@/hooks/use-table-settings';
import useSelection from '@/views/resource/resource-manage/hooks/use-selection';
import { useBusinessGlobalStore } from '@/store/business-global';
import { IExclusiveClusterItem } from '@/store/load-balancer/exclusive-cluster';
import { UNASSIGNED_BIZ_ID } from './constants';

export interface IDataListProps {
  columns: ModelPropertyColumn[];
  list: IExclusiveClusterItem[];
  pagination: PaginationType;
  loading?: boolean;
}

const props = withDefaults(defineProps<IDataListProps>(), {
  loading: false,
});

const emit = defineEmits<{
  assign: [row: IExclusiveClusterItem];
  'selection-change': [selection: IExclusiveClusterItem[]];
  'page-change': [page: number];
  'page-size-change': [limit: number];
  'column-sort': [sortType: SortType];
}>();

const { settings } = useTableSettings(props.columns);
const { selections, handleSelectionChange, resetSelections } = useSelection();
const businessGlobalStore = useBusinessGlobalStore();
const tableRef = ref();

const isUnassigned = (row: IExclusiveClusterItem) => row.bk_biz_id === UNASSIGNED_BIZ_ID;

const isCurRowSelectEnable = (row: IExclusiveClusterItem) => isUnassigned(row);

const isRowSelectEnable = ({ row, isCheckAll }: { row: IExclusiveClusterItem; isCheckAll: boolean }) => {
  if (isCheckAll) return true;
  return isCurRowSelectEnable(row);
};

const handleAssign = (row: IExclusiveClusterItem) => {
  emit('assign', row);
};

watch(
  () => props.list,
  () => {
    resetSelections();
    tableRef.value?.clearSelection();
  },
);

watch(
  () => selections.value,
  (val) => {
    emit('selection-change', val);
  },
  { deep: true },
);
</script>

<template>
  <bk-loading :loading="loading">
    <bk-table
      ref="tableRef"
      row-hover="auto"
      :data="list"
      :pagination="pagination"
      max-height="100%"
      :settings="settings"
      :is-row-select-enable="isRowSelectEnable"
      remote-pagination
      show-overflow-tooltip
      @page-limit-change="(limit: number) => emit('page-size-change', limit)"
      @page-value-change="(page: number) => emit('page-change', page)"
      @column-sort="(sortType: SortType) => emit('column-sort', sortType)"
      @selection-change="(selection: any) => handleSelectionChange(selection, isCurRowSelectEnable)"
      @select-all="(selection: any) => handleSelectionChange(selection, isCurRowSelectEnable, true)"
      row-key="id"
    >
      <bk-table-column type="selection" :width="40" :min-width="40" />
      <bk-table-column
        v-for="(column, index) in columns"
        :key="index"
        :prop="column.id"
        :label="column.name"
        :sort="column.sort"
        :width="column.width"
        :fixed="column.fixed"
        :show-overflow-tooltip="column.id !== 'assign_status'"
      >
        <template #default="{ row }">
          <template v-if="column.id === 'assign_status'">
            <bk-tag
              v-bk-tooltips="{
                content: businessGlobalStore.businessFullList.find((item) => item.id === row.bk_biz_id)?.name,
                disabled: !row.bk_biz_id || row.bk_biz_id === UNASSIGNED_BIZ_ID,
                theme: 'light',
              }"
              :theme="row.bk_biz_id === UNASSIGNED_BIZ_ID ? false : 'success'"
            >
              {{ row.bk_biz_id === UNASSIGNED_BIZ_ID ? '未分配' : '已分配' }}
            </bk-tag>
          </template>
          <display-value v-else :property="column" :value="row[column.id]" :display="column?.meta?.display" />
        </template>
      </bk-table-column>
      <bk-table-column :show-overflow-tooltip="false" label="操作" :width="100" fixed="right">
        <template #default="{ row }">
          <span v-bk-tooltips="{ content: '已分配', disabled: isUnassigned(row) }">
            <bk-button theme="primary" text :disabled="!isUnassigned(row)" @click="handleAssign(row)">分配</bk-button>
          </span>
        </template>
      </bk-table-column>
    </bk-table>
  </bk-loading>
</template>
