export function empty(path: string[]) {
  if (path.length === 0) return { length: 0 };
}

export function regex(pattern: RegExp) {
  return (path: string[]) => {
    if (path.length != 0) {
      var match = pattern.exec(path[0]);
      if (match) {
        return Promise.resolve({
          length: 1,
          params: match.groups,
        });
      }
    }
  };
}
