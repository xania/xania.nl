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
    bind(callback: Callback) {
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
      if (root != null) {
        return (
          this[field] ??
          (this[field] = new Field(subject, () => root, null, field))
        );
      }
    },
  };
}

class Field<T, K extends keyof T> {
  private listeners: Function[] = [];
  constructor(
    private observer: Rx.Observer<any>,
    private parent: () => T,
    private updateParent: (value: Partial<T>) => any,
    private name: K
  ) {}

  change = (callback: (value: T[K]) => void) => {
    this.listeners.push(callback);
  };

  valueOf = () => {
    const { parent, name } = this;
    const context = parent();
    if (context) return context[name];
    else return undefined;
  };

  update = (value: T[K]) => {
    const { parent, name, observer } = this;
    const context = parent();

    for (const listener of this.listeners) {
      listener(value);
    }

    if (context) {
      context[name] = value;
    } else {
      this.updateParent({ [name]: value } as any);
    }

    observer.next(this);
    return true;
  };

  get<P extends keyof T[K]>(name: P) {
    return new Field(this.observer, this.valueOf, this.update, name);
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

  asInt() {
    const field = this;
    return {
      valueOf() {
        return field.valueOf();
      },
      update(value) {
        return field.update(parseInt(value) as any);
      },
    };
  }
}
