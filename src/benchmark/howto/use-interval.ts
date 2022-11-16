import { NextObserver } from "@xania/view/lib/util/is-subscibable";

/**
 * useInterval returns an observable, by including this within the view
 * (in this case as a content element of div) we can make sure the view
 * engine is subscribing to it during rendering and also eventually
 * unsubscribe during dispose / clean up
 *
 * also notice that nothing in the implementation is specific to xania
 */
export function useInterval<T>(callback: (prev?: T) => T, ms?: number) {
  return {
    subscribe(observer: NextObserver<any>) {
      let currentValue: T | undefined = callback();
      if (currentValue !== null && currentValue !== undefined)
        observer.next(currentValue);
      const timer = setInterval(function () {
        const newValue =
          currentValue === undefined ? callback() : callback(currentValue);
        if (
          newValue !== null &&
          newValue !== undefined &&
          newValue !== currentValue
        ) {
          observer.next(newValue);
          currentValue = newValue;
        }
      }, ms ?? 1000);
      return {
        unsubscribe() {
          clearInterval(timer);
          if (observer.complete instanceof Function) observer.complete();
        },
      };
    },
    error(err: any) {
      console.error(err);
    },
  };
}
