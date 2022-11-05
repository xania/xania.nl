import { operator, variable, value } from "./rules/expression";
import { apply } from "./rules";

export function JsQuery() {
  const person = {
    firstName: "Ibrahim",
    lastName: "Ben Salah",
    age: 41,
    x: 20,
    sum: 0,
    fullName: null,
  };

  const rules = {
    sum: operator("sum", value(3), variable("x"), variable("age")),
    fullName: operator(
      "concat",
      variable("firstName"),
      value(" "),
      variable("lastName")
    ),
  };

  apply(rules, person);

  console.log(person);
}
