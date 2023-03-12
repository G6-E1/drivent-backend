import app, { init } from "@/app";
import { createClient } from "redis";

const port = +process.env.PORT || 4000;

export const redis = createClient({
  url: process.env.REDIS_URL
});

init().then(() => {
  app.listen(port, () => {
    /* eslint-disable-next-line no-console */
    console.log(`Server is listening on port ${port}.`);
  });
});
