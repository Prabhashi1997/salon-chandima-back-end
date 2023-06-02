export type IndexDefinition = {
  Unique: { [field: string]: { idx: string; msg: string } };
};

export default class Utils {
  static getIndexErrorMessage = (def: IndexDefinition, idx: string): { name: string; errors: string[] }[] => {
    const d = Object.entries(def.Unique).find((value) => value[1].idx === idx);
    if (d) {
      return [{ name: d[0], errors: [d[1].msg] }];
    }
    return [{ name: 'unknown', errors: ['Unknown error'] }];
  };

  static removeNull = <T>(value: T): any => {
    if (value !== null && value !== undefined) {
      if (Array.isArray(value)) {
        return value.map((v) => Utils.removeNull(v));
      } else if (typeof value === 'object') {
        return Object.fromEntries(
          Object.entries(value)
            .map((v) => [v[0], Utils.removeNull(v[1])])
            .filter((v) => v[1] !== null),
        );
      }
    }
    return value as any;
  };

  static selectFields = <T>(value: T, ...fields: string[]): Partial<T> => {
    if (Array.isArray(value)) {
      return value.map((v) => Utils.selectFields(v, ...fields)) as any;
    }
    return Object.fromEntries(Object.entries(value).filter((f) => fields.indexOf(f[0]) !== -1)) as T;
  };
}
