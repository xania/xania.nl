export default {
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
