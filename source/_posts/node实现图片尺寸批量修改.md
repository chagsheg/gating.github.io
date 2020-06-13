---
layout: post
title: node实现批量修改图片尺寸
tags: [node, node-canvas]
category: 小工具
description:
date: 2020/06/12
---

# 前言

大家在工作中肯定有没有遇到过图片尺寸和我们要求的尺寸不一致的情况吧？通常我们会在网上找一下找在线的或者下载一个小工具，再或者通过`ps`的批处理解决。但是，作为`程序猿`，当然还是通过代码来解决这种小问题啦。所以，闲话不多说啦，开始写我们的代码

# 简单的搭建一下

- 新建一个 `canvas-image-resize` 目录

- 初始化一个`node`项目工程

  ```bash
  npm init -y
  ```

- 安装依赖，这里主要用到了三个依赖，分别是`处理图片`、`批量处理文件`、`压缩成zip文件`

  ```bash
  npm i canvas glob archiver -S
  ```

  没错，这里我们又用到了`canvas`这个库，惊不惊喜，意不意外 😂

# 简单的使用一下

同样，有了前面我们使用`canvas`的经验，书写这个代码应该问题也不大，主要是对`api`的熟练问题

查看文档我们不难发现，`drawImage`的第四和第五个参数就是设置图片的宽高，知道这个之后，我们书写代码就简单不少了

```js
drawImage(image: Canvas|Image, dx: number, dy: number, dw: number, dh: number): void
```

所以，我们的代码大概如下，

```js
// 创建写入流
const { createWriteStream } = require("fs");
// 获取文件名
const { basename } = require("path");
// 压缩文件
const archiver = require("archiver");
// 导入canvas库，用于裁剪图片
const { createCanvas, loadImage } = require("canvas");
// 批量获取路径
const glob = require("glob");
!(async () => {
  const paths = glob.sync("./images/*");
  // 压缩成zip
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  // 输出到当前文件夹下的 image-resize.zip
  const output = createWriteStream(__dirname + "/image-resize.zip");
  archive.pipe(output);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const image = await loadImage(path);
    const { width, height } = image;
    const options = [width, height].map((item) => item / 2);
    const canvas = createCanvas(...options);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, ...options);
    archive.append(canvas.toBuffer(), { name: `${basename(path)}` });
  }
  archive.finalize();
})();
```

从上面代码可以看出，这里我只是对宽高进行了缩放一倍，没有做更多的配置，为了代码的健壮性，我们修改下我们的`options`，使得整个程序可以自定义宽高、可以根据宽度进行缩放、根据高度进行缩放

定义一下我们可配置的参数，基本配置是这样的:

```js
module.exports = {
  // 自定义宽度，传一个根据宽度等比缩放
  width: "",
  // 自定义高度，传一个根据高度等比缩放
  height: "",
  // 根据宽度等比缩放，优先级更高
  isWidth: false,
  // 根据高度等比缩放
  isHeight: false,
  // 宽高整体缩放
  scale: 1,
};
```

> ps：因为我们暂时没有图形界面，所以就定义一个`config.js`来模拟我们的插件啦

所以，在当前目录下，新建一个`config.js`，书写上我们那些配置，然后在`app.js`导入下，基本代码就变成了如下：

```js
// ....
// 导入配置文件（用户传过来的配置）
const config = require("./config");
// 根据配置获取宽高
function getOptions(options, config) {
  // 书写配置相关的代码，默认缩放两倍
  return options.map((item) => item / 2);
}
!(async () => {
  //  ....
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const image = await loadImage(path);
    const { width, height } = image;
    const options = getOptions({ width, height }, config);
    const canvas = createCanvas(...options);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, ...options);
    archive.append(canvas.toBuffer(), { name: `${basename(path)}` });
  }
  //  ....
})();
```

然后根据我们的配置文件来写逻辑的话，大概会出现如下逻辑：

```js
// 根据配置获取宽高
function getOptions(options, config) {
  const [sourceWidth, sourceHeight] = options;
  const { width, height, isWidth, isHeight, scale } = config;
  if (width === 0 || height === 0) return [0, 0];
  if (width && height) {
    if (isWidth) {
      return [width, (sourceHeight * width * scale) / sourceWidth];
    }
    if (isHeight) {
      return [(sourceWidth * height * scale) / sourceHeight, height];
    }
    return [width / scale, height / scale];
  }
  if (width && !height) {
    return [width, (sourceHeight * width * scale) / sourceWidth];
  }
  if (height && !width) {
    return [(sourceWidth * height * scale) / sourceHeight, height];
  }
  return options.map((item) => item / scale);
}
```

发现了吗？是不是感觉很乱？就算我们把一些公有部分提取出来改写如下：

```js
// 根据配置获取宽高
function getOptions(options, config) {
  const [sourceWidth, sourceHeight] = options;
  const { width, height, isWidth, isHeight, scale } = config;
  if (width === 0 || height === 0) return [0, 0];
  const widthOfOptions = [
    width * scale,
    (sourceHeight * width * scale) / sourceWidth,
  ];
  const heightOfOptions = [
    (sourceWidth * height * scale) / sourceHeight,
    height * scale,
  ];
  if (width && height) {
    if (isWidth) {
      return widthOfOptions;
    }
    if (isHeight) {
      return heightOfOptions;
    }
    return [width / scale, height / scale];
  }
  if (width && !height) {
    return widthOfOptions;
  }
  if (height && !width) {
    return heightOfOptions;
  }
  return options.map((item) => item / scale);
}
```

其实就算经过我们这么优化，其实看起来也不是特别优雅，不知道大家是否还记得我之前的一篇文章 [从零搭建 Window 前端开发环境](https://gatings.cn/2020-01-17/%E4%BB%8E%E9%9B%B6%E6%90%AD%E5%BB%BAWindow%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83/#%E4%BD%BF%E7%94%A8Map%E4%BB%A3%E6%9B%BFif-else)，这里说过，我们可以使用`使用 Map 代替 if/else`，让我们的代码变得更优雅，可读性也更好。所以，接下来我们就通过 `Map` 来改写我们的代码吧

> ps: 如果判断简单，其实用`{}`对象也可以，这里只是用`Map`做个延申

## 思考一下，为什么用 Map 更好呢？

说到这个，就不得不说 Map 对象和 Object 的区别了，他两有不少语法上的区别，比如`Map`获取值需要`get(key)`,设置值需要`set(key,value)`，但是这些区别不在我们讨论的范围内，我们说说他两最主要也是最重要的区别：

- 一个对象的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值。
- Map 自身有 size 属性，可以自己维护自己的 size，而对象的键值对个数只能手动确认。

## 优化代码

知道了他两的区别后，我们就可以边写代码啦~~刚刚说到，`Map`的`key`可是是任意值，所以我们就可以使用正则类型(`RegExp`)来作为我们的`key`了，而正是因为有了正则，那么我们的判断就有了无限可能，可以适应各种情况。

### 思考一下怎么通过正则来实现我们的代码呢？

首先我们可以先观察下我们之前`if/else`这个版本的代码，最先判断的是不是有没有宽高，即宽高是否为 0，所以我们就可以通过这个条件把我们的判断改为布尔值，因为`js`是弱类型的，所以我们就可以用`0`或者`1`来表示了，又因为这里存在不传则根据传的值缩放的情况，所以我们需要额外判断当他为`空字符串`时取`01`之外的数字，这里我取的是`2`。

这里可能有点绕口，我举两个例子大家可能就就懂了，假如我们传入的数据为默认数据：

```js
module.exports = {
  // 自定义宽度，传一个根据宽度等比缩放
  width: "",
  // 自定义高度，传一个根据高度等比缩放
  height: "",
  // 根据宽度等比缩放，优先级更高
  isWidth: false,
  // 根据高度等比缩放
  isHeight: false,
  // 宽高整体缩放
  scale: 1,
};
```

那么得出的字符串就是`22001`，假设我们传入了宽度，即数据：

```js
module.exports = {
  // 自定义宽度，传一个根据宽度等比缩放
  width: 1920,
  // 自定义高度，传一个根据高度等比缩放
  height: "",
  // 根据宽度等比缩放，优先级更高
  isWidth: false,
  // 根据高度等比缩放
  isHeight: false,
  // 宽高整体缩放
  scale: 1,
};
```

那么得出的字符串就是`12001`，看到这里大家应该懂了吧？所以我们只需要判断`config`这个配置的`value`值来生成我们的字符串即可，即得出如下代码

```js
// 获取config字符串，即传入了就是true，即1，没传就是0，为空字符串就是2
function getConfigStr(config) {
  return Object.values(config).map((el) => (el === "" ? "2" : Number(!!el)));
}
```

> ps：如果不懂，请评论说出来，我看到会第一时间回复的。。。

#### 拓展阅读：object 属性的输出顺序是无序的问题了解

> 拓展阅读：[5 分钟彻底理解 Object.keys](https://zhuanlan.zhihu.com/p/40601459)

### 正式编写优化后的代码

通过上面的思考，我们基本分析出了我们的代码需要怎么写，如何写，我想大家应该很容易就能书写出来了，这里还是贴一下我的（仅供参考）：

```js
// 获取config字符串
function getConfigStr(config) {
  return Object.values(config).map((el) => (el === "" ? "2" : Number(!!el)));
}
// 根据配置获取宽高
function getOptions(options, config) {
  const [sourceWidth, sourceHeight] = options;
  const { width, height, scale } = config;
  const widthOfOptions = [
    width * scale,
    (sourceHeight * width * scale) / sourceWidth,
  ];
  const heightOfOptions = [
    (sourceWidth * height * scale) / sourceHeight,
    height * scale,
  ];
  const configStr = getConfigStr(config);
  const map = new Map([
    [/^0|^\d0/, [0, 0]],
    [/^1\d1|^1[0|2]0/, widthOfOptions],
    [/^\d101|^210/, heightOfOptions],
    [/^1100/, [width / scale, height / scale]],
    [/^2{2}\d{2}1/, options.map((item) => item / scale)],
  ]);
  return [...map].find(([key]) => key.test(configStr.join("")))[1] || options;
}
```

> ps: 这里使用了正则，如果有对正则不太了解的，建议可以去看下正则，因为正则对字符串的处理有着极大的意义，以极大程度上方便了我们的开发

也许你看到这里，你就会像，你这里写的不是比以前更复杂了吗？还用了这些看不太懂的`正则`，可读性就更差了。。。

但是其实我这里只是想引申出`使用 Map 代替 if/else`这个思想（思路），通过这个例子，我想以后我们写的代码也可以使用`Map`书写出让我们更好维护的代码了

# 最后

感谢各位观众老爷的观看 O(∩_∩)O 希望你能有所收获 😁
