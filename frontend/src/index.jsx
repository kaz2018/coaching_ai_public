import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 開発環境のみ、mockサーバーを起動する
if (import.meta.env.DEV === true) {
  console.log("This is the development environment.");
  import("./mocks/browser").then(({ worker }) => {
    worker.start();
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
