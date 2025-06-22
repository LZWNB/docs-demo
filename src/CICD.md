# Node.js CICD 自动化部署系统

## 项目介绍

这是一个基于 Node.js 实现的 CICD 自动化部署系统，可以帮助开发团队快速、安全地将项目部署到远程服务器。系统支持多项目配置，可以通过命令行交互式选择需要部署的项目。

## 技术栈

- **Node.js**: 运行环境
- **node-ssh**: SSH 连接和远程命令执行
- **archiver**: 文件压缩
- **inquirer**: 命令行交互

## 核心功能

1. **多项目配置管理**

   - 支持多个项目的部署配置
   - 通过命令行交互式选择部署项目
   - 每个项目可独立配置部署参数

2. **自动化构建**

   - 自动执行项目构建命令
   - 支持自定义构建流程

3. **文件处理**

   - 自动压缩构建产物
   - 支持指定目标文件和目录

4. **远程部署**
   - 自动建立 SSH 连接
   - 文件上传至远程服务器
   - 执行远程解压和部署命令
   - 自动清理部署过程中的临时文件

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 配置部署信息

在 `config.js` 文件中配置部署信息：

```javascript
const config = [
  {
    name: "项目名称",
    value: "唯一标识",
    ssh: {
      host: "服务器地址",
      port: 22,
      username: "用户名",
      password: "密码",
    },
    targetDir: "本地构建目录",
    targetFile: "压缩包名称",
    deployDir: "远程部署目录",
    releaseDir: "发布目录名",
  },
];
```

### 3. 执行部署

```bash
node app.js
```

或者指定项目部署：

```bash
node app.js [项目标识]
```

## 源码解析

### 主程序入口 (app.js)

主程序负责协调整个部署流程，包括构建、压缩、上传和远程部署等步骤。

```javascript
import commanderLine from "./utils/helper.js";
import path from "node:path";
import compressFile from "./utils/compressFile.js";
import server from "./utils/ssh.js";
import uploadFile from "./utils/uploadFile.js";
import handleCommand from "./utils/handleCommand.js";
import build from "./utils/build.js";

// [!code highlight] 入口函数，协调整个部署流程
const main = async () => {
  const config = await commanderLine();
  const local = path.resolve(process.cwd(), config.targetFile);
  // [!code highlight] 执行项目构建
  build(config.targetDir);

  // [!code highlight] 压缩构建文件
  await compressFile(config.targetDir, local);
  // [!code highlight] 连接远程服务器
  await server.connectServer(config);
  // [!code highlight] 执行远程部署步骤
  await handleCommand(
    server.ssh,
    `rm -rf ${config.releaseDir}`,
    config.deployDir,
    "删除"
  );
  await uploadFile(server.ssh, config, local);
  await handleCommand(
    server.ssh,
    `unzip ${config.releaseDir}`,
    config.deployDir,
    "解压"
  );
  await handleCommand(
    server.ssh,
    `rm -rf ${config.releaseDir}`,
    config.deployDir,
    "删除"
  );
  await handleCommand(
    server.ssh,
    `mv dist ${config.releaseDir}`,
    config.deployDir,
    "重命名"
  );
  await server.ssh.dispose();
  console.log("🎉 部署成功！");
};
```

### 配置管理 (config.js)

配置文件管理多个项目的部署信息。

```javascript
// [!code highlight] 支持多项目配置
const config = [
  {
    name: "docs",
    value: "1",
    // [!code highlight] SSH连接配置
    ssh: {
      host: "服务器地址",
      port: 22,
      username: "用户名",
      password: "密码",
    },
    // [!code highlight] 部署路径配置
    targetDir: "本地构建目录",
    targetFile: "dist.zip",
    deployDir: "/home/cicd/",
    releaseDir: "web",
  },
];
```

### 构建工具 (utils/build.js)

负责执行项目的构建命令。

```javascript
import { execSync } from "child_process";

// [!code highlight] 执行npm构建命令
const build = (path) => {
  execSync(`npm run build`, {
    stdio: "inherit",
    cwd: path,
  });
};
```

### 文件压缩 (utils/compressFile.js)

使用 archiver 库压缩构建文件。

```javascript
import archiver from "archiver";
import fs from "node:fs";

// [!code highlight] 压缩构建文件为zip
function compressFile(targetFile, localFile) {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    const stream = fs.createWriteStream(localFile);
    // [!code highlight] 监听压缩完成事件
    stream.on("close", () => {
      console.log(
        `压缩完成，文件大小: ${(archive.pointer() / 1024 / 1024).toFixed(3)} MB`
      );
      resolve(true);
    });

    archive.pipe(stream);
    archive.directory(targetFile, "dist");
    archive.finalize();
  });
}
```

### 命令执行 (utils/handleCommand.js)

封装远程命令执行功能。

```javascript
// [!code highlight] 执行远程服务器命令
async function handleCommand(ssh, command, path, description) {
  await ssh.execCommand(command, {
    cwd: path,
  });
  console.log(`执行${description}命令成功`);
}
```

### 命令行工具 (utils/helper.js)

提供命令行交互功能。

```javascript
import inquirer from "inquirer";
import config from "../config.js";

// [!code highlight] 命令行交互选择项目
async function commanderLine() {
  if (process.argv.length >= 3) {
    return config.find((item) => item.value === process.argv[2]);
  }
  // [!code highlight] 使用inquirer提供交互式选择
  const { project } = await inquirer.prompt([
    {
      type: "list",
      message: "请选择要部署的项目",
      name: "project",
      choices: config,
    },
  ]);
  return config.find((item) => item.value === project);
}
```

### SSH 连接 (utils/ssh.js)

管理 SSH 连接。

```javascript
import * as ssh from "node-ssh";

// [!code highlight] 创建SSH连接
const sshClient = new ssh.NodeSSH();

async function connectServer(config) {
  await sshClient.connect(config.ssh);
  console.log("SSH连接成功");
}
```

### 文件上传 (utils/uploadFile.js)

处理文件上传功能。

```javascript
// [!code highlight] 上传本地文件到远程服务器
async function uploadFile(ssh, config, local) {
  await ssh.putFile(local, config.deployDir + config.releaseDir);
  console.log("打包上传成功");
}
```

## 部署流程

1. **项目选择**

   - 通过命令行交互或命令参数选择要部署的项目

2. **构建打包**

   - 执行项目构建命令
   - 将构建产物压缩打包

3. **远程部署**

   - 建立 SSH 连接
   - 清理远程服务器上的旧文件
   - 上传压缩包
   - 解压文件
   - 移动到目标目录

4. **完成部署**
   - 清理临时文件
   - 断开 SSH 连接

## 注意事项

1. 确保服务器的 SSH 连接信息正确
2. 远程服务器需要有适当的文件操作权限
3. 部署目录路径需要正确配置
4. 建议在生产环境使用密钥认证替代密码认证

## 扩展

> 可以使用`husky`编写 shell 脚本实现在`git commit`的时候自动触发 CICD 部署

1. 给需要部署的项目安装`husky`:

   ```bash
   npm install husky -D
   ```

2. 配置`husky`:
   - 在`.husky`目录下，和`_`文件夹同级创建一个`pre-commit`文件，内容如下：
   ```bash
   echo "run pre-commit"
   
   // 替换为CICD项目的目录
    cd E:/CICD/CICD

    node app.js '1'
    ```

::: tip
* `node app.js '1'`
* 这是默认选择config配置项里value值为1的配置作为默认部署配置，根据实际部署项目调整默认配置
:::