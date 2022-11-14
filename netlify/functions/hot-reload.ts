import { promises as fs } from "fs";
import { schedule } from "@netlify/functions";

export const handler = schedule("0 * * * *", function () {
  touch("./src/index.tsx");
});

async function touch(filename: string) {
  console.log("touch", filename);
  const time = new Date();

  await fs.utimes(filename, time, time).catch(async function (err) {
    if ("ENOENT" !== err.code) {
      throw err;
    }
    let fh = await fs.open(filename, "a");
    await fh.close();
  });
}
