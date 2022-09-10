/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 8081,
  },
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        cvApp: "./src/index.html",
        invoiceApp: "./src/invoices/index.html",
      },
    },
  },
};
