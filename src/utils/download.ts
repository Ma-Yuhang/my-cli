import axios from 'axios';
import { exec } from 'child_process';
import util from 'util';
import { wrapLoading } from './loading.js';
import fs from 'fs/promises';
export const defaultConfig = {
  organization: 'ma-yu-hang', // 组织名
};

const { organization } = defaultConfig;
// 获取仓库中所有的项目 让用户选择
export async function getOrganizationProjects() {
  const res = await axios.get(
    `https://gitee.com/api/v5/orgs/${organization}/repos`
  );
  const projects = res.data.map((item) => item.name);
  return projects;
}

// 让用户选择版本
export async function getProjectVersion(project) {
  const res = await axios.get(
    `https://gitee.com/api/v5/repos/${organization}/${project}/tags`
  );
  const versions = res.data.map((item) => item.name);
  return versions;
}

// 将回调形式变为promise形式 (node中的util模块)
const execPromisified = util.promisify(exec);
// 开始下载用户选择的项目及对应的版本
export async function clone(version, project, name) {
  const cmd = `git clone --branch ${version} --depth 1 https://gitee.com/${organization}/${project}.git ${name}`;
  await wrapLoading('create project', () => execPromisified(cmd));
  // 删除创建出来的项目中的git目录
  fs.rm(`${name}/.git`, { recursive: true });
}
