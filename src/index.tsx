import { Attrs, render } from "xania";
import "./main.css";
import { Link, Path, Route, useRouteContext } from "xania/router";
import { Layout } from "./layout";

import { Job } from "./services/jobs";
import { Page } from "./layout/page";
import { Subscribe } from "./components/subscriptions";
import { Cases } from "./components/cases";
import { NavItem } from "./components/ui/nav-item";
import { Relations } from "./components/relations";
import { Incasso } from "./components/incasso";
import {
  Forms,
  Pie,
  Inbox,
  Person,
  Bag,
  Exit,
  Table,
} from "./components/ui/svg";
import { Seo } from "./components/seo";
import { Viewer } from "./components/documents";

render(<App />, document.getElementById("app")!);

export async function App() {
  const routeContext = useRouteContext();
  return (
    <>
      <Attrs class="flex flex-row" />
      <Layout>
        <div class="border-box relative m-0 flex flex-auto flex-row overflow-auto bg-white p-0 align-middle dark:bg-gray-600">
          <Page>
            <ul class="space-y-2 font-medium">
              <NavItem>
                <Bag />
                <span class="ml-3">Home</span>
                <Link to="/" />
              </NavItem>
              <NavItem>
                <Inbox /> <span class="ml-3">Inbox</span>
                <span class="ml-3 inline-flex h-3 w-3 items-center justify-center rounded-full bg-blue-100 p-3 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
                <Link to="inbox" />
              </NavItem>
              <NavItem>
                <Bag /> <span class="ml-3">Cases</span>
                <Link to="cases" />
              </NavItem>
              <NavItem>
                <Person /> <span class="ml-3">Relations</span>
                <Link to="relations" />
              </NavItem>
              <NavItem>
                <Pie /> <span class="ml-3">Documents</span>
                <Link to="documents" />
              </NavItem>
              <NavItem>
                <Exit /> <span class="ml-3">Incasso</span>
                <Link to="incasso" />
              </NavItem>
              <NavItem>
                <Forms /> <span class="ml-3">Forms</span>
                <Link to="forms" />
              </NavItem>
              <NavItem>
                <Pie /> <span class="ml-3">Bronnen</span>
                <Link to="resources" />
              </NavItem>
              <NavItem>
                <Table /> <span class="ml-3">Seo</span>
                <Link to="seo" />
              </NavItem>
            </ul>
            {/* <div>{jobfeed().then(list(JobListItem))}</div> */}
          </Page>
          <Route>
            <Page>
              <Subscribe />
            </Page>
          </Route>
          <Route path="job/:id">
            <Page>{routeContext.params.prop("id")}</Page>
          </Route>
          <Route path="cases">
            <Cases />
          </Route>
          <Route path="relations">
            <Relations />
          </Route>
          <Route path="incasso">
            <Incasso />
          </Route>
          <Route path="documents">
            {import("./components/documents").then((mod) => (
              <mod.Viewer />
            ))}
          </Route>
          <Route path="inbox">
            <Page>inbox berichten</Page>
          </Route>
          <Route path="seo">
            <Seo />
          </Route>
        </div>
      </Layout>
    </>
  ) as any;
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
        <Link to={"job/" + String(index)} />
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

// measure(tree, sumStack, sumRecursive, sumRecursive2);

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

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
