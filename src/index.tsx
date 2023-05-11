import { Attrs, render } from "xania";
import "./main.css";
import { Link, Path, Route, RouteContext } from "xania/router";
import { Layout } from "./layout";

import { Prompt } from "./components/prompt";
import { Job, jobfeed } from "./services/jobs";
import { Page } from "./layout/page";

render(<App />, document.getElementById("app")!);

export function App() {
  return (
    <>
      <Attrs class="flex flex-row" />
      <Layout>
        <div class="border-box relative m-0 flex flex-auto flex-row overflow-auto bg-white p-0 align-middle dark:bg-gray-600">
          <Page>
            <input placeholder="Search...">
              <Prompt />
            </input>
            <div>{jobfeed().then(list(JobListItem))}</div>
          </Page>
          <Route path={jobRoute}>
            {(context: RouteContext) => <Page>{context.params?.id}</Page>}
          </Route>
        </div>
      </Layout>
    </>
  );
}

function list<T>(component: (data: T, index: number) => JSX.Children) {
  return (data: T[]) => {
    return data.map(component);
  };
}

function JobListItem(props: Job, index?: number) {
  return (
    <div>
      <a>
        {props.title}
        <Link to={String(index)} />
      </a>
    </div>
  );
}

function jobRoute(path: Path) {
  if (path.length === 0) return false;

  return {
    length: 1,
    params: { id: path[0] },
  };
}

type Node = { name: string; children: Node[] | null; value: number };
function buildTree(count: number, levels: number): Node[] | null {
  if (count === 0 || levels === 0) {
    return null;
  }
  const tree: Node[] = [];
  for (let i = 0; i < count; i++) {
    tree.push({
      name: "div",
      value: i,
      children: buildTree(count, levels - 1),
    });
  }
  return tree;
}

function sumRecursive(tree: Node[] | null, output: number[] = []) {
  if (tree instanceof Array) {
    let total = 0;
    let length = tree.length;
    while (length--) {
      const node = tree[length];
      output.push(node.value);
      const result = sumRecursive(node.children, output);
      total += result.total;
    }
    return { output, total };
  }
  return {
    output,
    total: 0,
  };
}

function sumRecursive2(
  tree: Node[] | null,
  result: { output: number[]; total: number } = { output: [], total: 0 }
) {
  if (tree instanceof Array) {
    let length = tree.length;
    let { output, total } = result;
    while (length--) {
      const node = tree[length];
      output.push(node.value);
      result.total += total;
      sumRecursive2(node.children, result);
    }
    return result;
  }
  return result;
}

const tree = buildTree(5, 10)!;

measure(tree, sumStack, sumRecursive, sumRecursive2);

function sumStack(tree: Node[] | null) {
  if (tree === null) {
    return [];
  }

  const output: number[] = [];
  const stack = [tree];
  let total = 0;
  let length = stack.length;
  while (length--) {
    const curr = stack[length]!;
    for (const { value, children } of curr) {
      total += value;
      output.push(value);
      if (children) {
        // stack.push(children);
        stack[length++] = children;
      }
    }
  }
  return { output, total };
}

type Func<T> = (arg: T) => any;

function measure<T>(tree: T, ...fns: Func<T>[]) {
  const results: Record<string, number> = {};
  for (const fn of fns) {
    results[fn.name] = 0;
  }
  for (let i = 0; i < 10; i++) {
    for (const fn of fns) {
      const start = performance.now();
      fn(tree);
      const end = performance.now();
      results[fn.name] += end - start;
    }
  }

  console.group(results);
}
