import { execute, Expression } from "./expression";

interface Rules {
  [name: string]: Expression;
}

export function apply(rules: Rules, target: any) {
  const changes = [];
  for (const name in rules) {
    const expr = rules[name];
    const result = execute(expr, target);
    if (target[name] !== result) {
      target[name] = result;
      changes.push(name);
    }
  }

  return changes.length > 0 ? changes : false;
}
