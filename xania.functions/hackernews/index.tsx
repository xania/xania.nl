import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import jsx from "./jsx";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
) {
  const name = req.query.name || (req.body && req.body.name);
  context.res = {
    body: context.bindingDefinitions,
  };
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
