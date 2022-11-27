import { promises as fs } from "fs";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import chokidar from "chokidar";
import cleanup from "rollup-plugin-cleanup";

export default defineConfig({
  logLevel: "error",
  server: {
    port: 9091,
    // host: "0.0.0.0",
    proxy: {
      "/rem/api/": {
        target: "http://localhost:5000",
        rewrite: (path) => path.replace(/^\/rem\/api/, "/api"),
      },
      "/api": {
        target: "http://localhost:7071",
        changeOrigin: true,
      },
    },
    // watch: {
    //   ignored: ["xania-functions"],
    // },
  },
  root: "src",
  build: {
    minify: true,
    outDir: "../dist",
    rollupOptions: {
      plugins: [
        cleanup({
          comments: [],
        }),
      ],
    },
  },
});

// var watcher = chokidar.watch("./.netlify/functions-serve");

// watcher.on("all", function () {
//   touch("./src/index.tsx");
// });

// async function touch(filename: string) {
//   console.log("touch", filename);
//   const time = new Date();

//   await fs.utimes(filename, time, time).catch(async function (err) {
//     if ("ENOENT" !== err.code) {
//       throw err;
//     }
//     let fh = await fs.open(filename, "a");
//     await fh.close();
//   });
// }
