export enum QueryRuleOPEnum {
  EQ = 'eq',
  NEQ = 'neq',
  GT = 'gt',
  GTE = 'gte',
  LT = 'lt',
  LTE = 'lte',
  IN = 'in',
  CS = 'cs',
  CIS = 'cis'
}

export type QueryFilterType = {
  op: 'and' | 'or';
  rules: {
    field: string;
    op: QueryRuleOPEnum;
    value: string | number | string[];
  }[]
};
