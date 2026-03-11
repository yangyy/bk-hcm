import type { IFavoriteItem, IFavoriteStorage } from './typings';

export class LocalStorageFavoriteStorage implements IFavoriteStorage {
  async getList(key: string): Promise<IFavoriteItem[]> {
    return this.read(key);
  }

  async add(key: string, item: IFavoriteItem): Promise<void> {
    const items = this.read(key);
    items.push(item);
    this.write(key, items);
  }

  async update(key: string, item: IFavoriteItem): Promise<void> {
    const items = this.read(key);
    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      this.write(key, items);
    }
  }

  async remove(key: string, id: string): Promise<void> {
    const items = this.read(key).filter((i) => i.id !== id);
    this.write(key, items);
  }

  private getStorageKey(key: string): string {
    return `hcm-search-favorites:${key}`;
  }

  private read(key: string): IFavoriteItem[] {
    try {
      const raw = localStorage.getItem(this.getStorageKey(key));
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private write(key: string, items: IFavoriteItem[]): void {
    localStorage.setItem(this.getStorageKey(key), JSON.stringify(items));
  }
}

export const localStorageFavoriteStorage = new LocalStorageFavoriteStorage();
