import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import { wrapLoading } from '../utils/loading.js';
import { clone, getOrganizationProjects, getProjectVersion } from '../utils/download.js';
/**
 * 判断文件夹是否存在
 */
async function isExist(filename) {
  try {
    return await fs.stat(filename);
  } catch (error) {
    return null;
  }
}

export default async function (name, option) {
  const cwd = process.cwd();
  const targerDir = path.join(cwd, name);

  const stat = await isExist(targerDir);
  if (stat) {
    // 如果已经存并且force为true 递归删除
    if (option.force) {
      await fs.rm(targerDir, { recursive: true });
    } else {
      // 询问用户删除还是取消
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list', // list checkbox confirm
          message: '目录已经存在了，是否要删除',
          choices: [
            { name: 'overwrite', value: true },
            { name: 'cancel', value: false },
          ],
        },
      ]);
      if (action) {
        // 用户选择了overwrite
        await wrapLoading('remove', () =>
          fs.rm(targerDir, { recursive: true })
        );
      } else {
        // 用户选择了cancel
        return console.log('用户取消创建');
      }

    }
  }
  // 获取项目仓库拉取对应的代码
  const projects = await getOrganizationProjects()
  let { template } = await inquirer.prompt([
    {
      name: 'template',
      type: 'list', // list checkbox confirm
      message: '请选择模板',
      choices: projects
    },
  ]);
  
  // 获取项目仓库拉取对应的代码
  const versions = await getProjectVersion(template)
  let { version } = await inquirer.prompt([
    {
      name: 'version',
      type: 'list', // list checkbox confirm
      message: '请选择版本',
      choices: versions
    },
  ]);

  // 开始下载
  clone(version, template, name)
}
