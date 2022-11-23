import { jsxFactory } from "@xania/view/lib/jsx2";
import { Page, PageContent } from "../../layout/page";
import classes from "./index.module.scss";
import { Css, State, useState } from "@xania/view";
import { useContext } from "@xania/view/lib/jsx2/use-context";
import { List } from "@xania/view/lib/list";
import { createListSource, ListSource } from "@xania/view/lib/list/list-source";
import * as Rx from "rxjs";
import * as Ro from "rxjs/operators";
import { ExpressionType } from "@xania/view/lib/jsx/expression";
import { observable } from "rxjs";

console.log(observable);

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
              <h1>todos</h1>
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

  function updateLabel(index: number, value: string) {
    props.items.updateAt(index, (item) => ({ ...item, label: value }));
  }

  function updateCompleted(index: number, value: boolean) {
    props.items.updateAt(index, (item) => ({ ...item, completed: value }));
  }

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
            // $((todoItem) =>
            //   Rx.from(todoItem).pipe(
            //     Ro.combineLatestWith(currentEditing),
            //     Ro.map(([x, y]) => [
            //       x.completed ? "completed" : null,
            //       x === y ? "editing" : null,
            //     ])
            //   )
            // ),
          ]}
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              checked={$("completed")}
              change={(evt) => updateCompleted(evt.index, evt.node.checked)}
              // change={(evt) => props.items.update(evt.index, item => item.completed.update(evt.node.checked)}
            />
            <label dblclick={(e) => currentEditing.next(e.key)}>
              {$("label")}
            </label>
            <button
              class="destroy"
              click={(e) => props.items.deleteAt(e.index)}
            ></button>
          </div>
          <input
            class="edit"
            value={$("label")}
            blur={() => currentEditing.next(null)}
            keyup={(evnt) => {
              if (evnt.event.key === "Enter") {
                updateLabel(evnt.index, evnt.node.value);
                currentEditing.next(null);
              } else if (evnt.event.key === "Escape") {
                updateLabel(evnt.index, evnt.values["label"]);
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

interface Stream<T, U> extends Rx.Subscribable<U> {
  pipe<A>(op1: Rx.OperatorFunction<T, A>): Stream<T, A>;
  pipe<A, B>(
    op1: Rx.OperatorFunction<T, A>,
    op2: Rx.OperatorFunction<A, B>
  ): Stream<T, B>;
  pipe<A, B, C>(
    op1: Rx.OperatorFunction<T, A>,
    op2: Rx.OperatorFunction<A, B>,
    op3: Rx.OperatorFunction<B, C>
  ): Stream<T, C>;
  pipe<A, B, C, D>(
    op1: Rx.OperatorFunction<T, A>,
    op2: Rx.OperatorFunction<A, B>,
    op3: Rx.OperatorFunction<B, C>,
    op4: Rx.OperatorFunction<C, D>
  ): Stream<T, D>;
  pipe<A, B, C, D>(
    op1: Rx.OperatorFunction<T, A>,
    op2: Rx.OperatorFunction<A, B>,
    op3: Rx.OperatorFunction<B, C>,
    op4: Rx.OperatorFunction<C, D>,
    ...operations
  ): Stream<T, unknown>;
}

function async<T, U>(fn: (data: T) => JSX.Subscribable<U>) {
  return (data) => ({
    type: ExpressionType.State,
    state: fn(data),
  });
}

function observe<T>(init: T): Stream<T, T> {
  const subject = new Rx.BehaviorSubject<T>(init);

  return createObserver(subject, subject);

  function createObserver<U>(subject: Rx.Subject<T>, output: Rx.Observable<U>) {
    return {
      next(values: T) {
        subject.next(values);
      },
      pipe(...ops) {
        return createObserver(subject, output.pipe.apply(output, ops));
      },
      subscribe(...args: any[]) {
        return output.subscribe(...args);
      },
    };
  }
}
