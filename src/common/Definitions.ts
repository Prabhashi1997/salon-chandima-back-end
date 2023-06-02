export interface DataTableResponse<T> {
  total: number;
  data: T[];
}

export type SelectValue = { id: number | string; value: string; type?: string };
export type SelectValues = SelectValue[];
