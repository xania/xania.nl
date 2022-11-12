import { promises as fs } from "fs";
import { AzureFunction, Context } from "@azure/functions";

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  touch("../src/index.tsx");
};

export default timerTrigger;

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
