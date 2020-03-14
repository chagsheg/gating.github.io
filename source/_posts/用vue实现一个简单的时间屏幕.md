---
layout: post
title: 用vue实现一个简单的时间屏幕
tags: javascript
category: 小特效
description: 去年用了一个小的 app，叫做 一个木函，本来想着用来做动画优化就删掉了的，不过看到他有个时间屏幕的小工具，就点进去看了下，觉得挺好玩的，就想着能不能自己实现以下。
date: 2020/03/14
---


# 前言

去年用了一个小的 `app`，叫做 `一个木函`，本来想着用来做动画优化就删掉了的，不过看到他有个时间屏幕的小工具，就点进去看了下，觉得挺好玩的，就想着能不能自己实现一下。

> ps: 闲话不多说，先上例子[点我查看](https://gating.gitee.io/demo/vue-time/),觉得没啥意思的就不需要再往下看了


# 简单的搭建一下

初始化一个 `vue` 项目

```shell
vue create vue-time
```

然后无脑下一步就好了（回车），这里我打算用 `scss` 方便我们书写样式 ，所以创建完成后，我们在安装下 `scss`

```shell
cd vue-time
npm i sass-loader node-sass -D
```

> ps: 如果网络不好，就换下源或者用 `cnpm` 吧


## 新建时间屏幕组件

在 `components` 目录下新建 `TimeScreen.vue` 文件，然后通过 `vbase` 指令生成生成一个最基础的 `vue` 代码片段

> ps: `vbase` 是 `vscode` 中vue代码片段的一个插件

```html
<template>
    <div>

    </div>
</template>

<script>
    export default {
        name: "TimeScreen"
    }
</script>

<style lang="scss" scoped>

</style>
```

## 思考一下，如何做时间切换的动画

emmm... 不知是否有看过我之前的一篇文章[用jq实现的单个span为单个的数字动画](https://gatings.cn/2018-06-14/%E7%94%A8jq%E5%AE%9E%E7%8E%B0%E7%9A%84%E5%8D%95%E4%B8%AAspan%E4%B8%BA%E5%8D%95%E4%B8%AA%E7%9A%84%E6%95%B0%E5%AD%97%E5%8A%A8%E7%94%BB/)，没错，其实我们实现的思路，和这里基本一样，所以接下来我们就分析分析我们该怎么来实现了吧

首先，我们要明确一下，要有多少个 `span`，众所周知，一天最后就是**23:59:59**，所以我们所需要的 `span` 数组为 `[3, 10, 0, 6, 10, 0, 6, 10]`

> ps: 中间的 `:` 是只需要一个 `span` 的

