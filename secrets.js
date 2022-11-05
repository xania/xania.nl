const path = require("path");
const fs = require("fs");

function secrets() {
  let current = __dirname;
  while (current) {
    const file = path.resolve(current, "secrets.json");
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, { encoding: "utf-8" });
      return JSON.parse(content);
    }

    const parent = path.resolve(current, "..");
    if (parent != current) {
      current = parent;
    } else {
      break;
    }
  }
}
export default secrets();
