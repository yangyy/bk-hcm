import type { QueryRuleOPEnum, ISearchCondition } from '@/typings';
import type { ModelPropertySearch } from '@/model/typings';

export interface IConditionItem {
  uid: string;
  field: string;
  op: QueryRuleOPEnum;
  value: any;
}

export interface IActiveTag {
  id: string;
  property: ModelPropertySearch;
  value: any;
  op?: QueryRuleOPEnum;
}

export interface IFavoriteItem {
  id: string;
  name: string;
  condition: ISearchCondition;
  conditions: IConditionItem[];
  createdAt: number;
  isNew?: boolean;
}

export interface IFavoriteStorage {
  getList(key: string): Promise<IFavoriteItem[]>;
  add(key: string, item: IFavoriteItem): Promise<void>;
  update(key: string, item: IFavoriteItem): Promise<void>;
  remove(key: string, id: string): Promise<void>;
}
