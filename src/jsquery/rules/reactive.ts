const object = {};

export class Reactive<T> {
  constructor(public value: T) {}

  update<P extends keyof T>(k: P, func: (t: T) => T[P]) {
    const { value } = this;
    value[k] = func(value);
  }
}

var r = new Reactive({ firstName: "Ibrahim", age: 41 });

r.update("age", (p) => p.age + 1);
