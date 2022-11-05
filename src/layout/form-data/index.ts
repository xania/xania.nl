import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

export function useFormData<T>(root: T) {
  const subject = new Rx.Subject();

  type Callback = (data: T) => Promise<Partial<T> | void>;

  function apply(callback: Callback) {
    return async function () {
      try {
        return await callback(root);
      } catch (err) {
        console.error(err);
        return Promise.resolve();
      }
    };
  }

  return {
    onChange(callback: Callback) {
      return {
        render() {
          const subscription = subject
            .pipe(Ro.debounceTime(200), Ro.mergeMap(apply(callback)))
            .subscribe();

          return {
            dispose() {
              subscription.unsubscribe();
            },
          };
        },
      };
    },
    get<K extends keyof T>(field: K) {
      if (root != null) return new Field(subject, () => root, field);
    },
  };
}

class Field<T, K extends keyof T> {
  constructor(
    private observer: Rx.Observer<any>,
    private parent: () => T,
    private name: K
  ) {}

  valueOf = () => {
    const { parent, name } = this;
    const context = parent();
    return context[name];
  };

  update(value: T[K]) {
    const { parent, name, observer } = this;
    const context = parent();
    context[name] = value;

    observer.next(this);
    return true;
  }

  get<P extends keyof T[K]>(name: P) {
    return new Field(this.observer, this.valueOf, name);
  }

  asPerc() {
    const field = this;
    return {
      valueOf() {
        return (parseFloat(field.valueOf() as any) * 100).toFixed(2);
      },
      update(value) {
        return field.update((parseFloat(value) / 100) as any);
      },
    };
  }
}
