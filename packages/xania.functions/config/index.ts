export const optional = Symbol();

type Optional = typeof optional;

type ConfigValue = Optional | null | string | ConfigSection;

type ConfigSection = {
  [k: string]: ConfigValue;
};

type Initialized<T> = {
  [P in keyof T]: T[P] extends null
    ? string
    : T[P] extends Optional
    ? null | string
    : Initialized<T[P]>;
};

export function section<T extends ConfigSection>(
  name: string,
  config: T
): Initialized<T> | Error {
  const prefix = name + "_";
  for (const k in process.env) {
    if (k.startsWith(prefix)) {
      var keys = k.substring(prefix.length).split("__");

      let target: any = config;
      let key = keys[0];
      for (let i = 1; i < keys.length; i++) {
        target = target[key];
        if (!target) {
          break;
        }
        key = keys[i];
      }
      if (target) target[key] = process.env[k];
    }
  }

  // const verify
  const stack: [string[], ConfigValue][] = [[[], config]];

  while (stack.length) {
    const [path, value] = stack.pop() as (typeof stack)[number];
    if (value === null) {
      return new Error(
        `value is null at '${path.join(
          "."
        )}', please specify a value in settings OR assign a default value OR mark as optional

    // example
    import { optional, section } from "../config";
    const ${name}Config = section("${name}", { ${path.join(
          ": { "
        )}: optional }${new Array(path.length).fill("").join(" }")}, .... )`
      );
    } else if (value === optional) {
      continue;
    } else if (typeof value === "object") {
      for (const p in value) {
        stack.push([[...path, p], value[p]]);
      }
    }
  }

  return config as any;
}
