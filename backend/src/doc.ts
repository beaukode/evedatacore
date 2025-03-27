import { mkdirSync, writeFileSync } from "fs";
import { Documentation } from "express-zod-api";
import { routes } from "./routes";
import { escape } from "lodash-es";
// Ensure ./doc folder exists
mkdirSync("./doc", { recursive: true });

const doc = new Documentation({
  routing: routes,
  config: {
    cors: false,
  },
  version: "0.0.0",
  title: "EVE Datacore API",
  serverUrl: "https://evedataco.re",
});

const yaml = doc.getSpecAsYaml();
const json = doc.getSpecAsJson(undefined, 2);
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="SwaggerUI" />
  <title>${escape(doc.getSpec().info.title)}</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin></script>
  <script>
    var spec = ${doc.getSpecAsJson()}
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        spec,
        dom_id: '#swagger-ui',
      });
    };
  </script>
</body>
</html>`;

writeFileSync("./doc/openapi.yaml", yaml);
writeFileSync("./doc/openapi.json", json);
writeFileSync("./doc/index.html", html);
