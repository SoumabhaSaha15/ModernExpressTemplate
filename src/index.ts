import path from "path";
import cors from "cors";
import chalk from "chalk";
import express from "express";
import { connect } from "mongoose";
import router from "#/router/index";
import env from "#/configurations/env";
import cookieParser from "cookie-parser";
import listener from "#/utility/listener";
import swaggerUi from 'swagger-ui-express';
import sessionConfig from "#/configurations/session";
import errorHadler from "#/configurations/handle-error";
import { buildOpenApiSpec } from "#/configurations/open-api-docs";
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';
import { csrfSynchronisedProtection, csrfTokenMiddleware } from "#/configurations/csrf";

try {
  // dns.setServers(['8.8.8.8', '8.8.4.4']); // Set DNS servers to Google's public DNS servers. It is used to resolve mongo-atlas querySrv error.
  const CONNECTOR = await connect(env.DB_URI);
  const APP = express()
    .use(cors({ origin: env.CORS_URL, credentials: true }))
    .set('query parser', 'extended')
    .use(express.static(path.join('public'), { index: (env.NODE_ENV === 'production') ? ['index.html'] : false }))
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser())
    .use(sessionConfig(env))
    .use(csrfTokenMiddleware)
    .use(csrfSynchronisedProtection);
  if (env.NODE_ENV === 'production') APP.use('/api', router).get(/^\/(?!api\/).*/, (_, res) => res.sendFile(path.join('public', 'index.html')));
  if (env.NODE_ENV === 'development') {
    const SWAGGER_SPECS = buildOpenApiSpec(env);
    const theme = new SwaggerTheme();
    APP
      .use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(SWAGGER_SPECS, { explorer: true,customCss:theme.getBuffer(SwaggerThemeNameEnum.MATERIAL)}))
      .get('/docs.json', (_, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(SWAGGER_SPECS);
      })
      .use(router);
  }

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

