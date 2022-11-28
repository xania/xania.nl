import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  const name = req.query.name || (req.body && req.body.name);
  context.res = {
    body: context.bindingDefinitions,
  };
};

const jsx = {
  createElement(name: string | Function, props: any, ...children: any[]) {
    if (name instanceof Function) {
      return name(props, children);
    }
    let retval = `<${name}`;

    if (props) {
      for (const k in props) {
        retval += ` ${k}=\"${props[k]}\"`;
      }
    }

    retval += `>`;

    if (children instanceof Array) {
      for (const child of children) retval += child;
    }

    retval += `</${name}>`;

    return retval;
  },
  createFragment() {},
};

function Button(props: any, children: any[]) {
  return <button click={() => console.log("Hi")}>{children}</button>;
}

interface AppProps {
  name: string;
}
function App(props: AppProps) {
  return (
    <div>
      <div style="color: red;">{props.name}</div>
      <Button>Click me!</Button>
    </div>
  );
}

export default httpTrigger;
