export function delay<T>(value: T, ts: number = 1000): T {
  return new Promise<T>((resolve, reject) => {
    setTimeout(function () {
      resolve(value);
    }, ts);
  }) as any;
}

export function twoway<T>(context: T, field: keyof T) {
  if (context != null)
    return {
      value: context[field],
      onChange(value) {
        console.log(value);
        context[field] = value;
      },
    };
}

export interface Field<T = any> {
  update(value: T): boolean;
}

export function isField(target: any): target is Field {
  return (
    target !== null && target !== undefined && target.update instanceof Function
  );
}

type Func<T extends any[], U> = (...args: T) => U;
