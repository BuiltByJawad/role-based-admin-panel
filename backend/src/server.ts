import "dotenv/config";
import { env } from "./config/env.js";
import { app } from "./app.js";

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.port}`);
});
