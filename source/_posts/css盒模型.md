---
layout: post
title: css盒模型
tags: [html,css]
category: 记录
description: Box是CSS布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。
date: 2018/03/26
---

# css盒模型的基本概念

margin、padding、border、content

# 标准模型和IE模型区别

>宽和高的计算方式不同：

标准模式是content

ie模型的是计算border和padding

# css如何设置这两种模型

标准模型：box-sizing:content-box 也是默认模式

IE模型：box-sizing: border-box


# js如何获取盒模型对应的宽和高

dom.style.width/height

dom.currentStyle.width/height（只要ie支持）

window.getComputedStyle(dom).width/height（谷歌火狐等支持）

dom.getBoundingClientRect().width/height

# 根据盒模型解释边距重叠

```html
<style>
    .parent{background:red}
    .child{height:100px;margin-top:10px;background:#ff0}
</style>
<section class="parent">
    <div class="child"></div>
</section>
```

# BOX是什么

Box是CSS布局的对象和基本单位， 直观点来说，就是一个页面是由很多个 Box 组成的。元素的类型和 display 属性，决定了这个 Box 的类型。 不同类型的 Box， 会参与不同的 Formatting Context（一个决定如何渲染文档的容器），因此Box内的元素会以不同的方式渲染。

# BFC
## BFC的基本概念

块级格式化上下文，Block Formatting Contexts就是页面上的一个隔离的渲染区域，容器里面的子元素不会在布局上影响到外面的元素，反之也是如此。

## BFC的原理

1. 两个相邻元素的边距会重叠
2. BFC的区域不会与float box重叠。
3. BFC是一个独立的容易,外面的元素不会影响里面的元素，里面的元素也不会影响外面的元素
4. 计算BFC高度的时候，浮动元素也会参与计算

## 怎么创建BFC

1. float值不为None
2. position不为static或者realtive
3. display为inline-block，table-cell,table-caption,flex，inline-flex 
4. overflow不为visiblev
