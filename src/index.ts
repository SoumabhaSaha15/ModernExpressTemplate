import path from "path";
import cors from "cors";
import chalk from "chalk";
import express from "express";
import { connect } from "mongoose";
import router from "#/router/index";
import env from "#/configurations/env";
import cookieParser from "cookie-parser";
import listener from "#/utility/listener";
import sessionConfig from "#/configurations/session";
import errorHadler from "#/configurations/handle-error";
import { csrfSynchronisedProtection, csrfTokenMiddleware } from "#/configurations/csrf";

try {

  const CONNECTOR = await connect(env.DB_URI);

  const APP = express()
    .use(cors({ origin: env.CORS_URL, credentials: true }))
    .set('query parser', 'extended')
    .use(express.static(path.join('public'), { index: (env.NODE_ENV === 'production')? ['index.html'] : false }))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(sessionConfig(env))
    .use(csrfTokenMiddleware)
    .use(csrfSynchronisedProtection);
  if (env.NODE_ENV === 'production') APP.use('/api', router).get(/^\/(?!api\/).*/, (_, res) => res.sendFile(path.join('public', 'index.html')));
  if (env.NODE_ENV === 'development') APP.use(router);

  const SERVER = APP
    .use(errorHadler)
    .listen(env.PORT, listener(env));

  process.on("SIGINT", async () => {
    console.log(chalk.yellow.bold("Server closed. Database disconnected."));
    await CONNECTOR.disconnect();
    SERVER.close(async (error) => {
      if (error) console.log(chalk.red.bold(error.message || "Error during server shutdown."));
      process.exit(0);
    });
  });
} catch (error) {
  console.error(error);
  process.exit(0);
}
// dns.setServers(['8.8.8.8', '8.8.4.4']);
