import { jsxFactory } from "@xania/view/lib/jsx2";
import { Page, PageContent } from "../../layout/page";
import classes from "./index.module.scss";
import { Css, State, useState } from "@xania/view";
import { useContext } from "@xania/view/lib/jsx2/use-context";
import { List, useListSource } from "@xania/view/lib/list";
import * as Rx from "rxjs";

const jsx = jsxFactory({ classes });

export function TodoApp() {
  const newTodoText = useState("", false);
  const items = useListSource<TodoItem>([
    {
      label: "hello",
      completed: new State(true),
    },
  ]);
  function addTodo(todoText: string) {
    const newItem: TodoItem = { label: todoText, completed: new State(false) };
    items.update((l) => [...l, newItem]);
    newTodoText.update("");
  }

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
                value={newTodoText}
                keyup={(e) => e.event.key === "Enter" && addTodo(e.node.value)}
              />
            </header>
            <TodoList items={items} />
            <footer class="footer">
              <span class="todo-count">
                <strong>
                  {items.map((l) =>
                    l.length === 1 ? "1 item" : `${l.length} items`
                  )}
                </strong>
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

interface TodoListProps {
  items: State<TodoItem[]>;
}

function TodoList(props: TodoListProps) {
  const $ = useContext<TodoItem>();
  const currentEditing = useState<TodoItem | null>(null);

  function updateLabel(todoItem: TodoItem, value: string) {
    todoItem.label = value;
    props.items.update((l) => [...l]);
  }

  function updateCompleted(todoItem: TodoItem, value: boolean) {
    todoItem.completed.update(value);
  }

  function destroyItem(todoItem: TodoItem) {
    console.log("destroy", todoItem.label);
    props.items.update((l) => l.filter((e) => e !== todoItem));
    console.log("new list", props.items.current);
  }

  return (
    <ul class="todo-list">
      <List source={props.items}>
        <li
          class={[
            $(currentEditing.bind((x, y) => (x === y ? "editing" : null))),
            $((e) => e.completed.map((x) => (x ? "completed" : null))),
          ]}
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              checked={$("completed")}
              change={(evt) => updateCompleted(evt.values, evt.node.checked)}
            />
            <label dblclick={(e) => currentEditing.update(e.values)}>
              {$("label")}
            </label>
            <button
              class="destroy"
              click={(e) => destroyItem(e.values)}
            ></button>
          </div>
          <input
            class="edit"
            value={$("label")}
            blur={() => currentEditing.update(null)}
            keyup={(evnt) => {
              if (evnt.event.key === "Enter") {
                updateLabel(evnt.values, evnt.node.value);
                currentEditing.update(null);
              } else if (evnt.event.key === "Escape") {
                updateLabel(evnt.values, evnt.values["label"]);
                currentEditing.update(null);
              }
            }}
          >
            {$((todoItem, { node: inputElt }) =>
              currentEditing
                .when((c) => c === todoItem)
                .then((_) => focusInput(inputElt as HTMLInputElement))
            )}
          </input>
        </li>
      </List>
    </ul>
  );
}

interface TodoItem {
  label: string;
  completed: State<boolean>;
}

function focusInput(elt: HTMLInputElement) {
  elt.focus();
  elt.setSelectionRange(0, elt.value.length);
}
