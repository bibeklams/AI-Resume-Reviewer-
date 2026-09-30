import { env } from "./config/env.js";
import app from "./app.js";

const port = env.PORT;

app.listen(port, () => {
  console.log(`server is running at http://loaclhost:${port}`);
});
