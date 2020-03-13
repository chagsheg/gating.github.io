---
layout: post
title: awardRotate转盘插件文字模糊问题和图片加载问题
tags: javascript
category: 记录
description: 最近在做一个转盘抽奖页面,使用了awardRotate.js发现字体和图片都有模糊，绘制的时候图片绘制不全，搜索一下之后发现针对awardRotate的解决方法比较少，针对canvas的比较多，所以这边总结一下。
date: 2018/10/24
---

# 前言

最近在做一个转盘抽奖页面,使用了awardRotate.js发现字体和图片都有模糊，绘制的时候图片绘制不全，搜索一下之后发现针对awardRotate的解决方法比较少，针对canvas的比较多，所以这边总结一下。



> 代码如下：

```html
<style>
.canvas{
    width: 100%;
}
</style>
<article id="turntable">
    <canvas id="wheelcanvas" width="422" height="422"></canvas>
    <img class="pointer" src="./static/img/start.png" />
</article>
```

> 至于为什么会变模糊，这和浏览器处理 canvas 的方式有关，相关的文章可以参考这篇 [High DPI](http://www.html5rocks.com/en/tutorials/canvas/hidpi/)，这里不作深入介绍。

> 解决这个问题的本质就是，先把canvas放大，然后在通过css限制会原始大小

解决方案就是把canvas的行间样式的宽度设为手机端的最大像素值,我这里设置为1688像素，也就是422的4倍, 按照这个像素画完之后, width:100%又会把canvas的宽度缩小至父元素的宽度那么大, 因此整个canvas的宽度被缩小了, 大尺寸的canvas内容被缩小了之后肯定不会产生锯齿现象, 

```html
<style>
.canvas{
    width: 100%;
}
</style>
<article id="turntable">
    <canvas id="wheelcanvas" width="1688" height="1688"></canvas>
    <img class="pointer" src="./static/img/start.png" />
</article>
```

又因为我们把canva的内容缩小了四倍，接下来我们通过js把canva放大四倍即可，这样就可以解决我们字体和图片模糊的问题了，接下来就是处理所有图片加载的问题了

```javascript
var canvas = document.getElementById("wheelcanvas");
if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    // 放大四倍
    ctx.scale(4, 4);
}
```

众所周知，img都有onload事件,我们这里就可以借助Promise和img的onload事件来实现判断所有图片是否加载完成

> 代码如下：

```javascript
let promiseAll = [],
    img = [],
    mulitImg = [
        './static/img/iphonexmax.png', './static/img/beats3.png',
        './static/img/again.png', './static/img/myhb.png',
        './static/img/iphonexr.png', './static/img/mi.png',
        './static/img/again.png', './static/img/myhb.png'
    ]
for (let i = 0; i < 8; i++) {
    promiseAll[i] = new Promise((resolve, reject) => {
        img[i] = new Image()
        img[i].src = mulitImg[i]
        img[i].onload = function () {
            //第i张加载完成
            resolve(img[i])
        }
    })
}
Promise.all(promiseAll).then((img) => {
    // 你要处理的函数
    // drawRouletteWheel(img)
})
```