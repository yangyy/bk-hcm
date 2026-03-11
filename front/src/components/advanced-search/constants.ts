import { QueryRuleOPEnum } from '@/typings';
import type { ModelPropertyType } from '@/model/typings';

const { EQ, NEQ, GT, GTE, LT, LTE, IN, NIN, CS, CIS, JSON_EQ, JSON_NEQ, JSON_CONTAINS } = QueryRuleOPEnum;

export const OPERATOR_LABEL_MAP: Record<string, string> = {
  [EQ]: '=',
  [NEQ]: '!=',
  [GT]: '>',
  [GTE]: '>=',
  [LT]: '<',
  [LTE]: '<=',
  [IN]: '属于',
  [NIN]: '不属于',
  [CS]: '包含',
  [CIS]: '包含(忽略大小写)',
  [JSON_EQ]: '=',
  [JSON_NEQ]: '!=',
  [JSON_CONTAINS]: '包含',
};

export const DEFAULT_OPERATORS_MAP: Partial<Record<ModelPropertyType, QueryRuleOPEnum[]>> = {
  string: [EQ, NEQ, CS, CIS],
  number: [EQ, NEQ, GT, GTE, LT, LTE],
  enum: [IN, NIN],
  list: [IN, NIN],
  datetime: [],
  user: [IN, NIN],
  account: [IN, NIN],
  array: [IN, NIN],
  bool: [EQ],
  cert: [IN, NIN],
  ca: [EQ, NEQ],
  region: [IN, NIN],
  business: [IN, NIN],
  json: [JSON_EQ, JSON_NEQ, JSON_CONTAINS],
  'cloud-area': [IN, NIN],
};

export const getOperatorsForType = (
  type: ModelPropertyType,
  customOperators?: QueryRuleOPEnum[],
): QueryRuleOPEnum[] => {
  if (customOperators?.length) return customOperators;
  return DEFAULT_OPERATORS_MAP[type] ?? [EQ, NEQ];
};

export const getOperatorLabel = (op: QueryRuleOPEnum): string => {
  return OPERATOR_LABEL_MAP[op] ?? op;
};

export const hasOperatorSelector = (type: ModelPropertyType, hideOperator?: boolean): boolean => {
  if (hideOperator) return false;
  const ops = DEFAULT_OPERATORS_MAP[type];
  return Array.isArray(ops) && ops.length > 0;
};
