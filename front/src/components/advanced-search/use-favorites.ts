import { ref, onMounted } from 'vue';
import type { IFavoriteItem, IFavoriteStorage, IConditionItem } from './typings';
import type { ISearchCondition } from '@/typings';
import { localStorageFavoriteStorage } from './favorite-storage';

export default function useFavorites(key: string, storage?: IFavoriteStorage) {
  const adapter = storage ?? localStorageFavoriteStorage;
  const favorites = ref<IFavoriteItem[]>([]);
  const activeFavoriteId = ref<string | null>(null);

  const loadFavorites = async () => {
    favorites.value = await adapter.getList(key);
    favorites.value.forEach((f) => {
      f.isNew = false;
    });
  };

  const addFavorite = async (name: string, condition: ISearchCondition, conditions: IConditionItem[]) => {
    const item: IFavoriteItem = {
      id: `fav_${Date.now()}`,
      name,
      condition: { ...condition },
      conditions: [...conditions],
      createdAt: Date.now(),
      isNew: true,
    };
    await adapter.add(key, item);
    favorites.value.push(item);
    activeFavoriteId.value = item.id;
  };

  const updateFavorite = async (id: string, name: string) => {
    const item = favorites.value.find((f) => f.id === id);
    if (!item) return;
    item.name = name;
    item.isNew = false;
    await adapter.update(key, item);
  };

  const removeFavorite = async (id: string) => {
    await adapter.remove(key, id);
    favorites.value = favorites.value.filter((f) => f.id !== id);
    if (activeFavoriteId.value === id) {
      activeFavoriteId.value = null;
    }
  };

  const selectFavorite = (id: string) => {
    activeFavoriteId.value = id;
  };

  const clearActive = () => {
    activeFavoriteId.value = null;
  };

  onMounted(loadFavorites);

  return {
    favorites,
    activeFavoriteId,
    addFavorite,
    updateFavorite,
    removeFavorite,
    selectFavorite,
    clearActive,
  };
}
