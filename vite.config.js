import mkcert from "vite-plugin-mkcert";
import { start } from "./cosmos";
import secrets from "./src/secrets";

const { networkInterfaces } = require("os");

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

let host = null;
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
    if (net.family === familyV4Value && !net.internal) {
      if (!results[name]) {
        results[name] = [];
      }
      host = net.address;
    }
  }
}

/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 9091,
    host: ["::1:", host],
    proxy: {
      "/rem/backend/": {
        target: "http://localhost:5000",
        rewrite: (path) => path.replace(/^\/rem\/backend/, "/api"),
      },
      "/db": {
        target: "http://localhost:9595",
        rewrite: (path) => path.replace(/^\/db/, ""),
      },
      "/api": {
        target: "http://localhost:5263",
        rewrite: (path) => path.replace(/^\/api/, ""),
        changeOrigin: true,
      },
    },
  },
  root: "src",
  build: {
    outDir: "../dist",
  },
  logLevel: "info",
  resolve(dd) {
    console.log(dd);
  },
};

if (secrets) {
  start(secrets["xania.nl"]);
}
