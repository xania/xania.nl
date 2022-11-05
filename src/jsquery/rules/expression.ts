const buildIn = {
  concat(...values: any[]) {
    let retval = "";
    for (let i = 0; i < values.length; i++) {
      retval += values[i];
    }
    return retval;
  },
  sum(...values: any[]) {
    let retval = 0;
    for (let i = 0; i < values.length; i++) {
      retval += values[i];
    }
    return retval;
  },
};

export function execute<T>(expr: Expression, scope: T) {
  var stack = [expr];
  var values: any[] = [];

  while (stack.length) {
    const curr = stack.pop();
    switch (curr.type) {
      case ExpressionType.Operator:
        stack.push({
          type: ExpressionType.Call,
          func: resolve(curr.name),
          scope: null,
          length: curr.operands.length,
        });
        for (const operand of curr.operands) stack.push(operand);
        break;
      case ExpressionType.Call:
        const args = [];
        for (let i = 0; i < curr.length; i++) {
          args.push(values.pop());
        }
        const retval = curr.func.apply(curr.scope, args);
        values.push(retval);
        break;
      case ExpressionType.Value:
        values.push(curr.value);
        break;
      case ExpressionType.Variable:
        values.push(resolve(curr.name));
        break;
      case ExpressionType.Member:
        stack.push({
          type: ExpressionType.Call,
          func: property,
          scope: null,
          length: 2,
        });
        values.push(curr.name);
        stack.push(curr.object);
        break;
    }
  }

  function resolve(name: string) {
    return scope[name] || buildIn[name] || fail("unable to resolve " + name);
  }

  function property(ctx: any, name: string) {
    return ctx[name];
  }

  return values[0];
}

export type Expression = Member | Variable | Operator | Value | Call;
export enum ExpressionType {
  Member = 1,
  Call = 2,
  Value = 3,
  Operator = 4,
  Variable = 5,
}

interface Member {
  type: ExpressionType.Member;
  object: Expression;
  name: string;
}
interface Call {
  type: ExpressionType.Call;
  func: (...values: any[]) => any;
  scope: any;
  length: number;
}
interface Value {
  type: ExpressionType.Value;
  value: any;
}

interface Operator {
  type: ExpressionType.Operator;
  name: string;
  operands: Expression[];
}

interface Variable {
  type: ExpressionType.Variable;
  name: string;
}

export function operator(name: string, ...operands: Expression[]): Operator {
  return {
    type: ExpressionType.Operator,
    name,
    operands,
  };
}

export function value(value: any): Value {
  return {
    type: ExpressionType.Value,
    value,
  };
}

export function member(object: Expression, name: string): Member {
  return {
    type: ExpressionType.Member,
    object,
    name,
  };
}

export function variable(name: string): Variable {
  return {
    type: ExpressionType.Variable,
    name,
  };
}

function fail(message: string) {
  throw new Error(message);
}
