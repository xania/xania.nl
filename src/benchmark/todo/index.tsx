import { jsxFactory } from "@xania/view/lib/jsx2";
import { Page, PageContent } from "../../layout/page";
import classes from "./index.module.scss";
import { Css, useContext } from "@xania/view";
import { List } from "@xania/view/lib/list";

const jsx = jsxFactory({ classes });

export function TodoApp() {
  return (
    <Page>
      <PageContent>
        <Css value="todoapp-container" />
        <section class="todoapp">
          <div>
            <header class="header">
              <h1>todos</h1>
              <input
                class="new-todo"
                placeholder="What needs to be done?"
                value=""
              />
            </header>
            <TodoList />
            <footer class="footer">
              <span class="todo-count">
                <strong>1</strong>
                <span> </span>
                <span>item</span>
                <span> left</span>
              </span>
              <ul class="filters">
                <li>
                  <a href="#/" class="selected">
                    All
                  </a>
                </li>
                <span> </span>
                <li>
                  <a href="#/active">Active</a>
                </li>
                <span> </span>
                <li>
                  <a href="#/completed">Completed</a>
                </li>
              </ul>
            </footer>
          </div>
        </section>
      </PageContent>
    </Page>
  );
}

function TodoList() {
  const item = useContext<TodoItem>();
  const items: TodoItem[] = [
    {
      label: "hello",
    },
  ];
  return (
    <ul class="todo-list">
      <List data={items}>
        <li>
          <div class="view">
            <input class="toggle" type="checkbox" />
            <label>{item("label")} bla</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" value="asdf" />
        </li>
      </List>
    </ul>
  );
}

interface TodoItem {
  label: string;
}
