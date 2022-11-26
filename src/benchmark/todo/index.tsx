import { jsxFactory } from "@xania/view/lib/jsx2";
import { Page, PageContent } from "../../layout/page";
import { Css, State, useState } from "@xania/view";
import { useContext } from "@xania/view/lib/jsx2/use-context";
import { List } from "@xania/view/lib/list";
import { createListSource, ListSource } from "@xania/view/lib/list/list-source";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";

import classes from "./index.module.scss";

const jsx = jsxFactory({ classes });

export function TodoApp() {
  const newTodoText = useState("");
  const items = createListSource<TodoItem>([
    {
      label: "hello",
      completed: true,
    },
    {
      label: "hi",
      completed: false,
    },
    {
      label: "hoi",
      completed: false,
    },
  ]);
  function addTodo() {
    if (newTodoText.value) {
      const newItem: TodoItem = {
        label: newTodoText.value,
        completed: false,
      };
      items.append(newItem);
      newTodoText.update("");
    }
  }

  return (
    <Page>
      <PageContent>
        <Css value="todoapp-container" />
        <section class="todoapp">
          <div>
            <header class="header">
              <h1>todos </h1>
              <input
                class="new-todo"
                placeholder="What needs to be done?"
                value={newTodoText}
                keyup={(e) => (
                  newTodoText.update(e.node.value),
                  e.event.key === "Enter" && addTodo()
                )}
              />
            </header>
            <TodoList items={items} />
            <footer class="footer">
              <span class="todo-count">
                <strong>
                  {items.map((l) => {
                    const itemsLeft = l.filter((e) => !e.completed).length;
                    return itemsLeft === 1 ? "1 item" : `${itemsLeft} items`;
                  })}
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
  items: ListSource<TodoItem>;
}

function TodoList(props: TodoListProps) {
  const $ = useContext<TodoItem>();
  const currentEditing = new Rx.BehaviorSubject<symbol>(null);

  return (
    <ul class="todo-list">
      <List source={props.items}>
        <li
          class={[
            $((_, { key }) =>
              currentEditing.pipe(Ro.map((x) => (key == x ? "editing" : null)))
            ),
            $((todoItem) =>
              todoItem.map((x) => (x.completed ? "completed" : null))
            ),
          ]}
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              checked={$("completed")}
              change={(evt) =>
                evt.data.get("completed").update(evt.node.checked)
              }
            />
            <label dblclick={(e) => currentEditing.next(e.key)}>
              {$("label")}
            </label>
            <button
              class="destroy"
              click={(e) => props.items.delete(e.values)}
            ></button>
          </div>
          <input
            class="edit"
            value={$("label")}
            blur={(evnt) => {
              evnt.node.value = evnt.data.get("label");
              currentEditing.next(null);
            }}
            keyup={(evnt) => {
              if (evnt.event.key === "Enter") {
                evnt.data.get("label").update(evnt.node.value);
                currentEditing.next(null);
              } else if (evnt.event.key === "Escape") {
                currentEditing.next(null);
              }
            }}
          >
            {$((_, { key, node }) =>
              currentEditing.pipe(
                Ro.map((x) =>
                  x === key ? focusInput(node as HTMLInputElement) : null
                )
              )
            )}
          </input>
        </li>
      </List>
    </ul>
  );
}

interface TodoItem {
  label: string;
  completed: boolean;
}

class Person {
  constructor(public firstName: string) {}
}

function focusInput(elt: HTMLInputElement) {
  elt.focus();
  elt.setSelectionRange(0, elt.value.length);
}

var state = new State<TodoItem>(null);
const completed = state.get("completed");

state.update({
  completed: true,
  label: "asfasdfasd",
});

completed.subscribe({
  next(value) {
    console.log("completed value: ", value);
  },
});

state.flush();
