<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { IFavoriteItem } from './typings';

defineOptions({ name: 'AdvancedSearchFavorites' });

defineProps<{
  favorites: IFavoriteItem[];
  activeFavoriteId: string | null;
}>();

const emit = defineEmits<{
  (e: 'select', item: IFavoriteItem): void;
  (e: 'add' | 'remove', value: string): void;
  (e: 'rename', id: string, name: string): void;
}>();

const isAdding = ref(false);
const editingId = ref<string | null>(null);
const inputValue = ref('');
const inputRef = ref<HTMLInputElement>();

const startAdd = () => {
  isAdding.value = true;
  inputValue.value = '';
  nextTick(() => inputRef.value?.focus());
};

const confirmAdd = () => {
  const name = inputValue.value.trim();
  if (name) {
    emit('add', name);
  }
  isAdding.value = false;
  inputValue.value = '';
};

const startEdit = (item: IFavoriteItem) => {
  editingId.value = item.id;
  inputValue.value = item.name;
  nextTick(() => inputRef.value?.focus());
};

const confirmEdit = () => {
  if (editingId.value && inputValue.value.trim()) {
    emit('rename', editingId.value, inputValue.value.trim());
  }
  editingId.value = null;
  inputValue.value = '';
};

const handleInputKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (isAdding.value) confirmAdd();
    else if (editingId.value) confirmEdit();
  }
};

const handleInputBlur = () => {
  if (isAdding.value) confirmAdd();
  else if (editingId.value) confirmEdit();
};
</script>

<template>
  <div class="favorites-content">
    <div class="favorites-add" @click="startAdd">
      <template v-if="!isAdding">
        <i class="hcm-icon bkhcm-icon-plus-circle-shape" />
        <span>新增收藏</span>
      </template>
      <input
        v-else
        ref="inputRef"
        v-model="inputValue"
        class="favorites-input"
        placeholder="输入收藏名称"
        @keydown="handleInputKeydown"
        @blur="handleInputBlur"
        @click.stop
      />
    </div>

    <div
      v-for="item in favorites"
      :key="item.id"
      class="favorite-item"
      :class="{ active: activeFavoriteId === item.id }"
      @click="emit('select', item)"
    >
      <template v-if="editingId === item.id">
        <input
          ref="inputRef"
          v-model="inputValue"
          class="favorites-input"
          @keydown="handleInputKeydown"
          @blur="handleInputBlur"
          @click.stop
        />
      </template>
      <template v-else>
        <i class="hcm-icon bkhcm-icon-not-favorited favorite-icon" />
        <span class="favorite-name">{{ item.name }}</span>
        <bk-tag v-if="item.isNew" theme="info" size="small" class="new-tag">NEW</bk-tag>
        <div class="favorite-actions" @click.stop>
          <i class="hcm-icon bkhcm-icon-bianji" @click="startEdit(item)" />
          <i class="hcm-icon bkhcm-icon-delete" @click="emit('remove', item.id)" />
        </div>
      </template>
    </div>

    <div v-if="!favorites.length && !isAdding" class="favorites-empty">暂无收藏</div>
  </div>
</template>

<style scoped lang="scss">
.favorites-content {
  min-width: 240px;
  max-height: 320px;
  overflow-y: auto;
}

.favorites-add {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-size: 12px;
  color: #3a84ff;
  cursor: pointer;
  border-bottom: 1px solid #f0f1f5;

  &:hover {
    background: #f0f1f5;
  }

  .hcm-icon {
    font-size: 14px;
  }
}

.favorites-input {
  width: 100%;
  height: 28px;
  padding: 0 8px;
  font-size: 12px;
  border: 1px solid #3a84ff;
  border-radius: 2px;
  outline: none;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 12px;
  color: #63656e;
  cursor: pointer;
  position: relative;

  &:hover {
    background: #f0f1f5;
    .favorite-actions {
      display: flex;
    }
  }

  &.active {
    color: #3a84ff;
    .favorite-icon {
      color: #ffb848;
    }
  }

  .favorite-icon {
    font-size: 14px;
    color: #c4c6cc;
    flex-shrink: 0;
  }

  .favorite-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .new-tag {
    flex-shrink: 0;
  }

  .favorite-actions {
    display: none;
    gap: 8px;
    flex-shrink: 0;

    .hcm-icon {
      font-size: 14px;
      color: #979ba5;

      &:hover {
        color: #3a84ff;
      }
    }
  }
}

.favorites-empty {
  padding: 24px 16px;
  text-align: center;
  font-size: 12px;
  color: #c4c6cc;
}
</style>
