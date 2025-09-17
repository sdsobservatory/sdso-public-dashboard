import { Hono } from "hono";
import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";

import { getAssetImportTagsFromManifest } from "./utils";
import { Title } from "./lumisky";

const web = new Hono();

web.use(
  "*",
  jsxRenderer(
    ({ children }) => {
      const assetImportTags = getAssetImportTagsFromManifest();

      return (
        <html lang="en" data-bs-theme="dark">
          <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>{Title}</title>
            <link rel="icon" type="image/png" href="/img/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/img/favicon.svg" />
            <link rel="shortcut icon" href="/img/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
            <meta name="apple-mobile-web-app-title" content="LumiSky" />
            <link rel="manifest" href="/img/site.webmanifest" />
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
            ></link>
            <Style />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            {assetImportTags}
          </head>
          <body>
            {children}
          </body>
          <div class="text-center blockquote-footer">
            <p>
              <small>
                Powered by <a href="https://github.com/alexhelms/lumisky">LumiSky</a>
              </small>
            </p>
          </div>
        </html>
      );
    },
    { docType: true },
  ),
);

web.get("/", (c) => {
  return c.render(<div id="spa-root" data-root />);
});

export default web;
