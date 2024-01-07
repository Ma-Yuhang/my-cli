var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import { wrapLoading } from '../utils/loading.js';
import { clone, getOrganizationProjects, getProjectVersion } from '../utils/download.js';
/**
 * 判断文件夹是否存在
 */
function isExist(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield fs.stat(filename);
        }
        catch (error) {
            return null;
        }
    });
}
export default function (name, option) {
    return __awaiter(this, void 0, void 0, function* () {
        const cwd = process.cwd();
        const targerDir = path.join(cwd, name);
        const stat = yield isExist(targerDir);
        if (stat) {
            // 如果已经存并且force为true 递归删除
            if (option.force) {
                yield fs.rm(targerDir, { recursive: true });
            }
            else {
                // 询问用户删除还是取消
                let { action } = yield inquirer.prompt([
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
                    yield wrapLoading('remove', () => fs.rm(targerDir, { recursive: true }));
                }
                else {
                    // 用户选择了cancel
                    return console.log('用户取消创建');
                }
            }
        }
        // 获取项目仓库拉取对应的代码
        const projects = yield getOrganizationProjects();
        let { template } = yield inquirer.prompt([
            {
                name: 'template',
                type: 'list', // list checkbox confirm
                message: '请选择模板',
                choices: projects
            },
        ]);
        // 获取项目仓库拉取对应的代码
        const versions = yield getProjectVersion(template);
        let { version } = yield inquirer.prompt([
            {
                name: 'version',
                type: 'list', // list checkbox confirm
                message: '请选择版本',
                choices: versions
            },
        ]);
        // 开始下载
        clone(version, template, name);
    });
}
