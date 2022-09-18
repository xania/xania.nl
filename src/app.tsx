import * as jsx from "@xania/view";
import { render } from "@xania/view";
import { operator, variable, value } from "./rules/expression";
import { createBrowser } from "./router/browser-router";
import { Outlet } from "./router/outlet";
import { route } from "./router/view-resolver";
import { apply } from "./rules";
import { HomeComponent } from "./home";
import { InvoiceApp } from "./invoices";
import { MenuCard } from "./menucard";

function App() {
  return (
    <div>
      <Outlet
        router={createBrowser([])}
        routes={[
          route(empty, HomeComponent),
          route(["a"], AdminComponent),
          route(["invoices"], InvoiceApp),
          route(["menucard"], MenuCard),
        ]}
      />
    </div>
  );
}

Reflect.construct(HomeComponent, []);

function AdminComponent() {
  return {
    view: <div>Admin asdf</div>,
    routes: [],
  };
}

function empty(path: string[]) {
  if (path.length === 0) return { length: 0 };
}

function regex(pattern: RegExp) {
  return (path: string[]) => {
    var match = pattern.exec(path[0]);
    if (match)
      return Promise.resolve({
        length: 1,
      });
  };
}

render(<App />, "#app");

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
