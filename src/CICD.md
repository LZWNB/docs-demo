## CICD

### 概念

持续集成，持续部署<br />
支持集群部署，全自动流程

### 项目目录结构
```
| utils
    | build.js  // 打包项目
    | compressFile.js // 压缩文件
    | handleCommand.js // 调用ssh，运行linux命令
    | helper.js // 命令行工具
    | ssh.js    // 连接ssh
    | uploadFile.js   // 上传文件到服务器
| app.js
| config.js
| package.json
| README.md
```

### 连接服务器

ssh 连接服务器

- 格式：

  ```
  $ ssh 账号@IP地址
  ```

  例如：
  `ssh root@192.168.1.1`,如何再输入密码

- 成功连接之后

### 常用命令

- `ls`: 查看目录
- `cd [文件名]`: 进入指定文件夹
- `cd ..`: 返回上级目录
- `mkdir [文件名]`: 创建目录
- `touch [文件名]`: 创建文件
- `cat [文件名]`: 查看文件

如果需要修改文件内容，可以使用vim编辑器：
- `vim [文件名]`: 进入编辑模式，按下`i`键编辑，保存并退出按下`esc`然后输入`：wq`

### 需要安装的依赖包
- 为了实现在部署时可以在命令行快捷地选择项目，可以安装`inquirer`:
```
$ npm install inquirer
```

- 使用`archiver`进行压缩
```
$ npm install archiver
```

- 使用`node-ssh`进行连接ssh
```
$ npm install node-ssh  
```


### config.js
服务器配置项
```js
// 配置文件 
// SSH连接服务器

const config = [
    {
        name: '项目-A',
        value: '项目-A',
        ssh:{
            host: '192.168.1.1', // 服务器IP
            port: 22,
            username: 'root', // 登录账号
            password: '123456', // 登录密码
            passphrase: '', // 密钥 没有的话空着就行
        },
        targetDir: 'E:/project/demo-name/dist', // 本地项目打包后的目录，也是需要上传的目录
        targetFile: 'dist.zip', // 压缩之后的名称
        deployDir: '/home/[项目文件夹名字]/', // 服务器部署的目录
        // 在'/home/[项目文件夹名字]/'目录下新建'web'目录，作为项目发布目录
        releaseDir: 'web', //发布目录

    },
    {
        // ...配置其他服务器，配置项参考上面
    }
]

export default config
```

### helper.js
```js
// 命令行工具
import inquirer from "inquirer";
import config from "./config.js";

export default async function commadLine () {
    const res = await inquirer.prompt([
        {
            type: "list",
            name: "project",  // [!code highlight]
            message: "请选择部署的项目",
            choices: config  // [!code highlight]
        },
    ])
    return config.find(item => item.value === res.project)
}
```

- 最终的命令行选择结果会返回一个res对象
- 这里的`name`的值就是最终命令行选择结果的对象里面的`key`，`choices`就是key对应的`value`
