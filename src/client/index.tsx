import { createRoot } from "hono/jsx/dom/client";
import { Root } from "./components/Root";

const spaRoot = document.getElementById("spa-root");
if (spaRoot) {
  const root = createRoot(spaRoot);
  root.render(<Root />);
}
