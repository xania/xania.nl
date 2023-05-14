import { Attrs, render } from "xania";

export function Feedback() {
  return Attrs({
    class: "relative",
    click(e) {
      if (e.event.altKey) {
        e.event.preventDefault();
        const bounds = e.currentTarget.getBoundingClientRect();

        const top = e.event.y;
        const left = e.event.x - bounds.x;

        const result = render(
          <div
            class={`absolute z-40 border-2 border-solid border-red-400 bg-slate-300 p-4 opacity-80`}
          >
            feedback
          </div>,
          e.currentTarget as any
        );

        const div = result.nodes as any as HTMLDivElement;
        div.setAttribute("style", `top: ${top}px; left: ${left}px;`);
        console.log(div);
      }
    },
  });
}
