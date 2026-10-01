import chalk from "chalk";
import boxen from "boxen";
import { type Env } from "#/configurations/env";
export default  (env: Env)=> (err: Error | undefined) => {
  if (err) console.error(err);
  process.on(
    "unhandledRejection",
    (reason) => console.log(chalk.red.bold("Unhandled Rejection:\n"), reason)
  );

  const content = [
    `${chalk.bold.green('EXPRESS SERVER READY')} ${chalk.dim(`(v5.x)`)}`,
    '',
    `  ${chalk.dim('➜')}  ${chalk.bold('Local:')}    ${chalk.cyan.underline(`http://localhost:${env.PORT}`)}`,
    `  ${chalk.dim('➜')}  ${chalk.bold('Network:')}  ${chalk.cyan.underline(`http://127.0.0.1:${env.PORT}`)}`,
    '',
    chalk.dim(`  Ready to accept connections`),
  ].join('\n');
  console.log(
    boxen(content, {
      padding: { top: 1, bottom: 1, left: 2, right: 3 },
      margin: 1,
      borderStyle: 'round',
      borderColor: 'blue',
    }),
  );
};
