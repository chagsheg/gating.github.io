---
layout: post
title: DOM事件
tags: javascript
category: 记录
date: 2018/03/28
---

# DOM事件级别

1. DOM0 element.onclick=function(){}

2. DOM2 
	1. 第一个参数是事件名（如click）；第二个参数是事件处理程序函数；第三个参数如果是true则表示在捕获阶段调用，为false表示在冒泡阶段调用。
	2. elemnt.addEventListener('click',function(){},false) elemnt.removeEventListener('click',function(){},false)
	3. elemnt.attachEvent('onclick',function(){}) elemnt.attachEvent('onclick',function(){}) <font color="#f00">兼容IE7、IE8等早期版本</font>

3. DOM3 elemnt.addEventListener('keyup',function(){},false) 同上,增加了鼠标、键盘等事件

> ps：不能移除匿名添加的函数。

## 为什么没有DOM1

DOM1于1998年10月1日成为W3C推荐标准。DOM1标准中并没有定义事件相关的内容，所以没有所谓的DOM1事件模型

# DOM事件模型

冒泡和捕获

# DOM事件流

事件捕获阶段、处于目标阶段和事件冒泡阶段

捕获->目标阶段->冒泡


# 描述DOM事件捕获的具体流程

window->document->html->body->···->目标元素

# Event对象的常见问题

1. event.preventDefault() 阻止默认是行为

2. event.stopPropagation()  阻止冒泡

3. event.stoplmmediatePropagation() 事件优先级

4. event.currentTarget 当前绑定事件的对象

5. event.target 当前点击对象
