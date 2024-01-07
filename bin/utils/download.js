var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export function getOrganizationProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get(`https://gitee.com/api/v5/orgs/${organization}/repos`);
        const projects = res.data.map((item) => item.name);
        return projects;
    });
}
// 让用户选择版本
export function getProjectVersion(project) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios.get(`https://gitee.com/api/v5/repos/${organization}/${project}/tags`);
        const versions = res.data.map((item) => item.name);
        return versions;
    });
}
// 将回调形式变为promise形式 (node中的util模块)
const execPromisified = util.promisify(exec);
// 开始下载用户选择的项目及对应的版本
export function clone(version, project, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = `git clone --branch ${version} --depth 1 https://gitee.com/${organization}/${project}.git ${name}`;
        yield wrapLoading('create project', () => execPromisified(cmd));
        // 删除创建出来的项目中的git目录
        fs.rm(`${name}/.git`, { recursive: true });
    });
}
