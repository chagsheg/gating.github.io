---
layout: post
title: node实现图片分割
tags: [node, node-canvas]
category: 小工具
description: 最近，女王大大日常找我弄图片，本来之前我一直是ps帮他弄得，后来- -，ps不能分割过长的图片，我就想想能不能通过代码来帮他实现好了。
date: 2020/03/11
---

# 前言

最近，女王大大日常找我弄图片，本来之前我一直是 ps 帮他弄得，后来- -，ps 不能分割过长的图片，我就想想能不能通过代码来帮他实现好了。

经过我在`npm`搜索一番，发现没有一个纯代码层面的`high tools`来实现这个功能，索性就自己通过`node-canvas`这个库弄个小例子出来，自己使用好了

> gm 这个库是可以实现的，但是他需要额外安装两个工具，所以- -我就放弃了

# 简单搭建一下

- 新建一个 clip 目录

- 初始化一个`node`项目工程

  ```shell
  npm init -y
  ```

- 安装依赖，这里主要用到了两个个依赖，分别是`处理图片`、`压缩成zip文件`

  ```shell
  npm i canvas archiver -S
  ```

# 简单的使用一下

首先，先说说我的需求，下面是一张名为 `clip.png` 的图片，

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-03-11/clip.png)

我们需要做的就是把他均分为 3 等分，所以，我们尝试写一下我们的代码

```js
// 创建写入流
const { createWriteStream } = require("fs");
// 导入压缩文件库
const archiver = require("archiver");
// 导入canvas库，用于裁剪图片
const { createCanvas, loadImage } = require("canvas");
!(async () => {
  // 加载图片
  const image = await loadImage("./clip.png");
  // 获取图片宽高
  const { width, height } = image;
  // 创建等宽登高的canvas
  const mainCanvas = createCanvas(width, height);
  // 获取canvas上下文
  const ctx = mainCanvas.getContext("2d");
  // 绘图
  ctx.drawImage(image, 0, 0);
  // 压缩成zip
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  // 输出到当前文件夹下的 clip.zip
  const output = createWriteStream(__dirname + "/clip.zip");
  archive.pipe(output);
  // 明确我们需要垂直分割成几份
  const num = 3;
  // 获取一份的高度
  const oneHeight = height / num;
  for (let i = 0; i < num; i++) {
    // 创建一份裁剪的canvas
    let clipCanvas = createCanvas(width, oneHeight);
    // 获取canvas上下文
    const clipCtx = clipCanvas.getContext("2d");
    // 通过 clipCtx 裁剪 mainCanvas
    clipCtx.drawImage(
      mainCanvas,
      0,
      oneHeight * i,
      width,
      oneHeight,
      0,
      0,
      width,
      oneHeight
    );
    // 放到压缩器里
    archive.append(clipCanvas.toBuffer(), { name: `${i + 1}.png` });
    // 主动释放内存
    clipCanvas = null;
  }
  archive.finalize();
})();
```

跑一下我们写的程序，你会惊奇的发现，目录下多了一个`clip.zip`的压缩包，解压出来就是我们需要的图片啦

看到这里，其实我们已经实现我们想要的效果了，但是你会发现我们只是实现了水平的切割，如何实现垂直的呢？

也许你会说，加个判断不就好了？

```js
// 垂直切割...伪代码
if (direction === "vertical") {
  // 获取一份的高度
  const oneHeight = height / num;
  for (let i = 0; i < num; i++) {
    let clipCanvas = createCanvas(width, oneHeight);
    // ...... 和上面一致
    clipCtx.drawImage(
      mainCanvas,
      0,
      oneHeight * i,
      width,
      oneHeight,
      0,
      0,
      width,
      oneHeight
    );
    // ......
  }
} else {
  const oneWidth = width / num;
  for (let i = 0; i < num; i++) {
    let clipCanvas = createCanvas(oneWidth, height);
    // ...... 和上面一致
    clipCtx.drawImage(
      mainCanvas,
      oneWidth * i,
      0,
      width,
      oneHeight,
      0,
      0,
      width,
      oneHeight
    );
    // ......
  }
}
```

的确，这样写是可以，但是会不会觉得很不优雅？那我们是不是可以找找规律，把他封装成一份呢？答案是肯定可以的

这里我们可以新建一个数组配置,用来判断我们传递的参数来判断是 `width/num` 还是 `height/num`,闲话不多少了，开始写我们的代码把

```js
// 创建写入流
const { createWriteStream } = require("fs");
// 压缩文件
const archiver = require("archiver");
// 批量裁剪
const { createCanvas, loadImage } = require("canvas");
// 切割方向配置
const directionConfig = ["vertical", "horizontal"];
!(async () => {
  const image = await loadImage("./clip.png");
  const { width, height } = image;
  const mainCanvas = createCanvas(width, height);
  const ctx = mainCanvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
  // 压缩成zip
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Sets the compression level.
  });
  const output = createWriteStream(__dirname + "/clip.zip");
  archive.pipe(output);
  const clip = clipNumImage({ canvas: mainCanvas, width, height }, 3);
  clip.forEach((img, idx) => {
    archive.append(img, { name: `${idx + 1}.png` });
  });
  archive.finalize();
})();

function clipNumImage(options, num, direction = "horizontal") {
  const { canvas, ...canvasSize } = options;
  // 生成配置的参数
  let directionIdx = getIdx(direction);
  // 公有配置
  const directionOptions = getOptions(canvasSize, directionIdx, num);
  const clip = [];
  for (let i = 0; i < num; i++) {
    let clipCanvas = createCanvas(...directionOptions);
    const clipCtx = clipCanvas.getContext("2d");
    clipCtx.drawImage(
      canvas,
      ...directionOptions.map((val, idx) =>
        idx === directionIdx ? val * i : 0
      ),
      ...directionOptions,
      0,
      0,
      ...directionOptions
    );
    clip.push(clipCanvas.toBuffer());
    clipCanvas = null;
  }
  return clip;
}

// 获取传递过来的是垂直切割还是水平切割
function getIdx(direction) {
  let directionIdx = directionConfig.indexOf(direction);
  if (directionIdx === -1) {
    directionIdx = 1;
  }
  return directionIdx;
}
// 获取切割参数
function getOptions(size, directionIdx, num) {
  return Object.values(size).map((val, idx) =>
    idx === directionIdx ? val / num : val
  );
}
```

通过数组，是不是感觉到我们代码比以前更加简洁了呢？好啦，这次小 demo 我们也写完啦，希望你通过这篇文章也学习到一点知识。感谢你的观看

> [gitee 地址](https://gitee.com/gating/demo/tree/master/canvas-clip-image),[github 地址](https://github.com/GATING/demo/tree/master/canvas-clip-image)

> ps: 对了，还有一个长图切割器，不写代码的话，直接下载用也是极好的,[点我下载](https://www.lanzous.com/ia59nfc)

# 最后

感谢各位观众老爷的观看 O(∩_∩)O
