import jsx from "../jsx";

export const createApp = (name: string) => <App name={name} />;

function Button(props: any, children: any[]) {
  return <button click={() => console.log("Hi")}>{children}</button>;
}

interface AppProps {
  name: string;
}
function App(props: AppProps) {
  return (
    <div>
      <div style="color: red; font-weight: bold; font-variant: small-caps; font-size: 30px">
        {props.name}
      </div>
      <Button>Click me!</Button>
    </div>
  );
}
