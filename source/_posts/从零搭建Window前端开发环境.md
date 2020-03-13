---
layout: post
title: 从零搭建Window前端开发环境
tags: javascript
category: 记录
description: 作为一个小前端，是否因为搭建环境烦恼过，是否因为npm等国外镜像踩坑过，不要怕，接下来跟着我一步步搭建适合自己的开发环境吧！！！
date: 2020/01/17
---


# 前言

作为一个小前端，是否因为搭建环境烦恼过，是否因为npm等国外镜像踩坑过，不要怕，接下来跟着我一步步搭建适合自己的开发环境吧！！！


# node

这个不用说了吧，我们经常和他打交道，无论是 `gulp`、`webpack`和`parcel`等打包工具，还是各种脚手架的工具，都离不开`node`环境的支持，接下来我就介绍一下我常用的一些工具和模块。

## nvm

管理`node`版本，通过`nvm`我们可以同时安装/切换不同的`node`版本

不过,`nvm`不支持`window`版本,但是有替代方案,就是`nvm-window`,具体为什么`nvm`为何不支持`windows`平台?这里就不做谈论了...

> ps: [nvm-window下载链接](https://www.lanzous.com/i8prjed)，如果网速快就不需要在这里下载了，[github下载链接](https://github.com/coreybutler/nvm-windows/releases)，建议下载`nvm-setup.zip`会帮你配置好环境变量

### 安装

如果没什么特别要求，无脑下一步即可

1. 如果之前已安装`node`,作者的建议是卸载原有的`node`版本,避免发生冲突

2. 配置setting.txt文件,主要是配置为国内镜像源镜像源
    配置文件在：C:\Users\用户名\AppData\Roaming\nvm下（如果和我一下，无脑下一步的话）

    ```
        node_mirror: https://npm.taobao.org/mirrors/node/
        npm_mirror: https://npm.taobao.org/mirrors/npm/
    ```

> ps: 如果遇到`Powershell`下禁止执行脚本的问题,请用管理员打开`Powershell`执行`set-ExecutionPolicy RemoteSigned`，选择y即可

### 常用命令

1. 可列出已安装的node版本 nvm list/nvm ls

    ```bash
    nvm ls
    ```
2. 安装指定版本的node nvm install <version> [arch]
    ```bash
    nvm install latest # latest表示安装最新版
    ```
    > ps: arch为可选的平台架构项（32位/64位），，默认为系统平台对应的版本，若设置为all，则同时安装两个版本。

3. 卸载指定版本 nvm uninstall <version>

    ```bash
    nvm uninstall 13.6.0 # latest表示安装最新版
    ```
4. 设置镜像源 nvm node_mirror <node_mirror_url>

    - 设置`node`镜像源
    ```bash
    nvm node_mirror https://npm.taobao.org/mirrors/node/
    ```
     - 设置`npm`镜像源
    ```bash
    nvm npm_mirror https://npm.taobao.org/mirrors/node/
    ```

## nrm

众所周知的一点，`npm` 日常会挂掉，还时不时丢包，所以我们需要一款切换源的工具，来帮我们解决这个问题。

> ps: 虽然可以手动切换源，但是相对来讲还是比较麻烦的，所以推荐使用工具来帮我们完成这件事

### 安裝

```bash
npm install -g nrm
```

### 常用命令

1. 列出当前支持切换的源
    ```bash
    nrm ls

    * npm -------- https://registry.npmjs.org/
    yarn ------- https://registry.yarnpkg.com/
    cnpm ------- http://r.cnpmjs.org/
    taobao ----- https://registry.npm.taobao.org/
    nj --------- https://registry.nodejitsu.com/
    npmMirror -- https://skimdb.npmjs.com/registry/
    edunpm ----- http://registry.enpmjs.org/
    ```

2. 使用taobao源作为默认的npm源

    ```bash
    nrm use taobao
        Registry has been set to: https://registry.npm.taobao.org/
    ```

3. 测试源速度

    - 测试一个源
    ```bash
    nrm test npm
    ```
    - 测试所有源
    ```bash
    nrm test
    ```

4. 访问源的主页

    ```bash
    nrm home taobao
    ```

    > ps: 此命令会在默认浏览器中打开淘宝源的主页：[https://registry.npm.taobao.org/](https://registry.npm.taobao.org/)

5. 添加/刪除 一个源

    - 添加源：nrm add <registry> <url> [home]，home参数主要用于访问源的主页（可选）

    ```bash
    nrm add gating http://npm.gatings.com/  http://gatings.cn/   
    ```

    - 刪除源：nrm del <registry>

    ```bash
    nrm del gating
    ```

    > ps: nrm del 命令不能删除nrm自己内置的源。



## 实用模块推荐

### anywhere

朴灵大佬的 `anywhere`, 随时随地可以创建一个静态服务器，用于查看 `vue` 或 `react` 打包后的代码，或者局域网内资源共享

```bash
npm i -g anywhere
anywhere  
```

### cloc

快速统计某文件夹下代码的数据量

```bash
npm i -g cloc
cloc --exclude-dir=node_modules . --exclude-ext=json,html # 排除node_modules,排除json,html文件
```

# Git

这个也不用我多说了吧，目前世界上最先进的分布式版本控制系统，也是最常用的版本控制工具，这里就不过多说明了，鉴于各位同学的网速文本，这里就放一下下载链接，另外，修改`git bash`主题可以参考我博客的这篇文章:[GitBash主题风格](http://www.gatings.cn/%E8%AE%B0%E5%BD%95/2018/11/01/GitBash%E4%B8%BB%E9%A2%98%E9%A3%8E%E6%A0%BC/)

> ps: [Git蓝奏云链接](https://www.lanzous.com/i8prqgh),[Git官网链接，网速快的小伙伴可以在这里下载](https://git-scm.com/)，同样是无脑下一步安装


# VS Code

个人觉得最适合前端开发的一款编辑器了，没有之一

## 安装

这个就不多介绍了，注意修改下安装路径和添加Code到环境变量即可。

> ps: 添加都环境变量主要是为了在终端输入 `code .` 或 `code xxx` 就能直接打开目录或文件。

## 编程字体（FiraCode）

`Fira Code`是`Fira Mono`字体的扩展，其中包含一组用于常见编程多字符组合的连字。

比如把输入的「!=」直接显示成「≠」或者把「>=」变成「≥」等等，以此来提高代码的可读性。

再比如，..或//，连字允许我们校正间距。下面是官方的对比图

![FiraCode](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/all_ligatures.png)

> ps: [FiraCode蓝奏云链接](https://www.lanzous.com/i8prj1a),[FiraCode官方链接](https://github.com/tonsky/FiraCode/releases),同上，网速慢的就下载蓝奏云的即可

## 快捷键

熟练使用快捷键是程序员的必备技

### 常用快捷键

1. `ctrl + p` 根据关键字快速打开一个文件
2. `ctrl + ,` 打开配置项
3. `ctrl + d` 快速选取多个相同的内容块
4. `ctrl + h` 选取所有相同的内容块
5. `alt + 鼠标左键` 选取多个
6. `ctrl + g` 跳到指定行
7. `ctrl + b` 切换侧边栏
8. `shift + alt + 上下箭头` 复制当前行
9. `ctrl + shift + k` 快速删除行
10. `alt + 数字键` 快速切换标签（数字键不是小键盘的数字键）
11. `shift + alt + f` 代码自动格式化
12. `ctrl + shift + p` 显示所有命令
13. `ctrl + tab` 切换不同的文件

### 修改左侧边栏快捷键

```json
({
  "key": "cmd+1",
  "command": "workbench.view.explorer"
},
{
  "key": "cmd+2",
  "command": "workbench.view.search"
},
{
  "key": "cmd+3",
  "command": "workbench.view.scm"
},
{
  "key": "cmd+4",
  "command": "workbench.view.debug"
},
{
  "key": "cmd+5",
  "command": "workbench.view.extensions"
},
{
    "key": "ctrl+6",
    "command": "workbench.view.extension.gitlens"
})
```

这里主要是针对于和`Chrome`切换tab栏的快捷键保持一致，方便记忆

> ps: `ctrl+6` 是因为我安装了 `GitLens` 这个拓展，可根据自己的需求把最后一个去掉


## 插件推荐

这里介绍一下我常用的插件

* `Auto Close Tag` 自动闭合 HTML 标签
* `Auto Rename Tag`  修改 HTML 标签时,自动修改匹配的标签(虽然有时候有bug)
* `Bracket Pair Colorizer` 用不同颜色高亮显示匹配的括号
* `Code Spell checker` 单词拼写检查
* `GitLens` 显示文件最近的 commit 和作者，显示当前行 commit 信息
* `HTML CSS Support` css提示
* `IntelliSense for css class names` html中class输入提示
* `JavaScript (ES6) code snippets` ES6语法代码段
* `jQuery Code Snippets` jQuery语法代码片段
* `npm Intellisense` 导入模块时，提示已安装模块名称
* `open in browser` 浏览器中查看
* `Path Intellisense` 路径完成提示
* `px2rem` px转rem，主要是用flexible.js 和响应式做适配使用
* `Settings Sync` 同步设置和插件到Gist,还可以分享第三方Gist共他人同步（下载）
* `vetur` Vue 语法高亮
* `vscode-icons`  文件图标
* `Vue VSCode Snippets` vue的代码片段
* `vscode wxml`  VS Code 提供 wxml 语法支持及代码片段
* `WakaTime` 记录你一天码代码的时间

> 附上一份vsc插件整理的pdf：[点我下载](https://www.lanzous.com/i8pua0d)

## VSCode 设置

这里附上个人的 `VSCode` 设置,并且已经加上注释

```json
{
    // 自动保存
    "files.autoSave": "afterDelay",
    "fileheader.Author": "gating",
    "fileheader.LastModifiedBy": "gating",
    // 控制资源管理器是否在把文件删除到废纸篓时进行确认。
    "explorer.confirmDelete": false,
    // 启用后，按下 TAB 键，将展开 Emmet 缩写。
    "emmet.triggerExpansionOnTab": true,
    // 在默认不支持 Emmet 的语言中启用 Emmet 缩写功能。
    "emmet.includeLanguages": {
        "javascript": "javascriptreact",
        "vue-html": "html",
        "vue": "html",
        "wxml": "html"
    },
    // 为指定的语法定义配置文件或使用带有特定规则的配置文件。
    "emmet.syntaxProfiles": {
        "vue-html": "html",
        "vue": "html"
    },
    // 配置语言的文件关联
    "files.associations": {
        "*.wxss": "css",
        "*.html": "html",
        "*.wpy": "vue"
    },
    // 控制编辑器是否显示控制字符。
    "editor.renderControlCharacters": true,
    // 设置vscode默认的终端
    "terminal.integrated.shell.windows": "C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "px2rem.rootFontSize": 75,
    "px2rem.isNeedNotes": false,
    // 控制在将设置编辑为 json 时，使用拆分 json 编辑器。
    "workbench.settings.useSplitJSON": true,
    // 使用 json 文件编辑器。
    "workbench.settings.editor": "json",
    //  当在 VS Code 中重命名或移动文件时，始终自动更新路径。
    "javascript.updateImportsOnFileMove.enabled": "always",
    "vetur.format.defaultFormatter.html": "prettier",
    "html-css-class-completion.includeGlobPattern": "**/*.{css,html,vue,jsx}",
    "vetur.format.options.tabSize": 4,
    // 配置图标主题
    "workbench.iconTheme": "vscode-icons",
    // 配置缩放等级
    "window.zoomLevel": 1,
    // 配置主题
    "workbench.colorTheme": "Dracula",
    // 配置字体
    "editor.fontFamily": "Fira Code",
    // 配置字体连字。
    "editor.fontLigatures": true,
    "sync.gist": "",
    // 控制是否在搜索中跟踪符号链接。
    "search.followSymlinks": false,
    // 控制在资源管理器内拖放移动文件或文件夹时是否进行确认。
    "explorer.confirmDragAndDrop": false,
    // 在保存时格式化文件。
    "editor.formatOnSave": true,
    // 设置路径别名
    "path-intellisense.mappings": {
        "@": "${workspaceRoot}/src/",
    }
}
```

> 如果觉得复制麻烦，并且也不想一个个安装插件，可以同步我的`Gist ID`，直接使用我的配置即可。。。ID：`9d1c53501e76056a81fb1e2c9a6f181b`

### 同步设置

1. 快捷键`ctrl + shift + p`,输入Sync，选择高级选项

2. 选中打开设置

3. 复制`9d1c53501e76056a81fb1e2c9a6f181b`到`Gist ID`栏，选择自动下载即可


# Chrome

使用人数最多，最强大的浏览器，也是前端开发必备的浏览器，丰富的拓展，搭配谷歌的同步功能，可以说一个账号走天下

## 快捷键

还是那句话,熟练使用快捷键是程序员的必备技...下面还是介绍我常用的快捷键

* `ctrl + j` 新标签页中打开"下载内容"页
* `ctrl + h` 新标签页中打开"历史记录"页
* `ctrl + n` 打开新窗口
* `ctrl + t` 打开一个新的Tab
* `ctrl + u` 查看页面源代码
* `ctrl + w` 关闭当前窗口
* `ctrl + 数字键` 快速跳转到和数字键对应的Tab，ctrl+9为最后一个
* `ctrl + shift + n` 以无痕模式打开新窗口（可用于多个窗口的cookie不共享，便于调试）
* `ctrl + tab` 切换不同的tab页
* `ctrl + g` 查找栏中搜索字词相匹配的下一条内容
* `ctrl + shift + g` 查找栏中搜索字词相匹配的上一条内容
* `shift + esc` 任务管理器


## 拓展插件

* `AdBlockPlus` 屏蔽烦人的广告（必装插件）
* `Charset` 修改当前页面的编码，因谷歌升级了 55 以上之后，精简编码功能
* `CSS Used` 用来获取某个元素渲染后的styles（样式），即computed后的样式，扒代码小能手
* `JSON-handle` 格式化JSON文件,访问JSON文件（数据）时获得更愉悦的体验
* `SwitchyOmega` 管理和切换多个代理设置（小飞机必备插件）,具体怎么使用还是百度下吧，这里就不教学了
* `Tampermonkey` 有猴子插件，用于管理用户自定义的脚本（必装插件）
* `React Developer Tools` 开发React应用时必装的一款拓展
* `Vue.js devtools` 同上，都是辅助开发的拓展
* `Wappalyzer` 当前网站所使用技术栈(图个新鲜，挺有意思的)

> ps: 油猴子脚本下载：[https://greasyfork.org/zh-CN](https://greasyfork.org/zh-CN)

# Postman

作为前端，最常打交道的就是后端了，所以我们需要一个调试`API`的工具，而`Postman`就是一款非常优秀的API接口调试工具。

> ps: 如果还没用过 `Postman` 的，赶紧下载下来体验吧

## 安装

1.众所周知，Postman最早是chrome浏览器的插件，所以你可以通过Chrome商店搜索下载即可。

2.Postman提供了独立的安装包，不再依赖于Chrome浏览器了，所以也可通过安装包直接安装。

> ps：众所周知的原因，2018年初Chrome停止对Chrome应用程序的支持。所以这里建议使用独立安装包下载

下载也是直接安装即可，这里同样提供下载链接

> [Postman蓝奏云链接](https://www.lanzous.com/i8prqgh),[Postman官网链接，网速快的小伙伴可以在这里下载](https://www.getpostman.com/downloads/)


## 简单使用

### 配置多个环境

一般正式的开发项目都会有`测试环境`和`线上环境`之分，而前端同学拿到这两个地址后，每次都要请求不同的环境都要去修改主机名，造成不必要的时间浪费，而`Postman`就提供了多个环境的选择，方便我们无缝链接不同环境的接口

1.设置环境变量

点击右上角设置图标

![设置环境变量](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman01.jpg)

添加环境变量

![设置环境变量](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman02.jpg)

添加key/value值，不同环境的key值需一致

![设置环境变量](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman03.jpg)
![设置环境变量](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman04.jpg)

2.设置对应的key值

![设置环境变量](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman05.png)



### 配置重复header

很多时候，当后端写完一个新接口时，我们每次测试请求，`header`头很有可能是一样的，比如说，每个接口都需要`token`，这时候就需要`Postman`来帮我们设置`header`头的变量，避免复制重复的`header`头，做无用功

1.设置headers

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman06.jpg)

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman07.jpg)


2.使用headers

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/postman08.jpg)


好了，到这里，基础的使用已经回了，当然，这不是`Postman`的全部功能，它还可以做单元测试、回归测试、自动化测试等等，这就需要你们自己去体验一番了。。。

> ps: `Postman`还有个兄弟款[Postwoman](https://github.com/liyasthomas/postwoman)，开源免费，也很不错


# 前端开发小提示

## 使用Map代替if/else

开发的时候，经常会用到判断，然后根据判断返回不同的值或方法,这里以微信开发为例,微信接受用户消息时会有 `image`、`text`、`voice`等等EventKey,这时候我们就需要根据这几个Key写不同的方法：

```js
function handleEvent(key){
    if(key === 'image'){
        // 处理用户发送图片的方法
    }else if(key === 'text'){
        // 处理用户发送文本的方法
    }else if(key === 'voice'){
        // 处理用户发送声音
    }else{
        // 处理其他事件
    }
    // ...
}
```
我们观察上面代码，随着我们业务的增加，可能会获取用户的地理位置、扫码什么的，这个if/else就会越来越多，代码就会变得越来臃肿，可读性也越来越差。。。接下来我们就通过Map来优化下我们的代码

```js
const map = {
    `image`:message =>{
        // 处理用户发送图片的方法
    },
    `text`:message =>{
        // 处理用户发送文本的方法
    },
    `voice`:message =>{
        // 处理用户发送声音
    },
    `default`:{
        // 处理其他事件
    }
}
function handleEvent(key){
    key = map.hasOwnProperty(key) ? key : 'default'
    return map[key]
}
```

> ps: 推荐观看 [JavaScript 复杂判断的更优雅写法](https://juejin.im/post/5bdfef86e51d453bf8051bf8)

## 性能测试

`Chrome DevTools`（控制台），我想各位前端小伙伴应该不陌生吧，经常用它来调试页面，`element`、`console`和`network`都是要天天打交道的，不过你可知道他还有个可以测试当前页面性能的面板?没错，他就是 `Audits` 面板。。。

chrome 60之后，他引入了Google自家开源的一个项目：`LightHouse`。

> LightHouse 是Google开源的一个自动化测试工具，之前是以 chrome 插件 和 命令行cli的方式使用，现在可以直接通过开发者面板使用了，所以不推荐在单独安装插件或者cli工具。。。

这里以测试百度为例：

1.首先打开[百度](https://www.baidu.com/),然后打开控制面板，点击右边的双箭头

![Chrome DevTools控制台](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/Audits01.jpg)

2.选中 `Audits` 面板

![Audits面板](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/Audits02.jpg)

3.选择桌面设备（就是测试pc版），然后点击`run audits`，之后就会根据这几项指标生产一份报告，如下图

![测试](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/Audits03.jpg)

4.通过点击右侧菜单可以保存整个测试报告

![保存](https://cdn.JsDelivr.net/gh/GATING/blog_imgs//2020-01-17/Audits04.jpg)


> * 同时也有个中文版的线上版本 [https://developers.google.com/speed/pagespeed/insights/](https://developers.google.com/speed/pagespeed/insights/)
> * 移动端兼容性测试：[https://search.google.com/test/mobile-friendly](https://search.google.com/test/mobile-friendly)
> * 结构化网页数据：[https://search.google.com/structured-data/testing-tool/#](https://search.google.com/structured-data/testing-tool/#)
> * (貌似都需要科学上网才可以访问...)

# 总结

至此，本次搭建也已经全部结束了，希望你能从文中收所获，也能搭建属于自己适合自己的开发环境

最后，感谢各位观众老爷观看啦O(∩_∩)O