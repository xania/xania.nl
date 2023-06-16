import { Link } from "xania/router";

interface TitleProps {
  children: JSX.Children;
  close?: true;
}

export function Header(props: TitleProps) {
  return (
    <div class="small-caps p-2 text-center text-lg font-bold leading-6 text-gray-500">
      {props.children}
      {props.close && <Close />}
    </div>
  );
}

function Close() {
  return (
    <a class="absolute right-2 top-0 text-2xl">
      &times; <Link to=".." />
    </a>
  );
}
