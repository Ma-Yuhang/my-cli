#! /usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// .json文件在import语法中不能使用,所以不能直接导入package.json
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = require(join(__dirname, '../package.json'));

program.version(`my-cli@${pkg.version}`).usage('my-cli <command> [options]');

// 1.通过脚手架创建一个项目 create（拉去仓库中的模板，下载方式可以采用github gitee gitlab）
// 2.配置拉取的信息，配置系统文件 config
program
  .command('create <project-name>')
  .description('create a project')
  .option('-f, --force', 'overwrite target directory')
  .action(async (name, option) => {
    (await import('./commands/create.js')).default(name, option);
  });

// my-cli config --set a 1
// my-cli config --get a
program
  .command('config [value]')
  .description('inspect config')
  .option('-g, --get <path>', 'get value')
  .option('-s, --set <path> <value>', 'set value')
  .option('-d, --delete <path>', 'delete value')
  .action(async (value, option) => {
    (await import('./commands/config.js')).default(value, option);
  });

program.addHelpText(
  'after',
  `\nRun ${chalk.blueBright(
    'my-cli <command> --help'
  )} for detailed usage of given command`
);

// process.argv执行命令时后边传递的参数 如my-cli --help
program.parse(process.argv);
