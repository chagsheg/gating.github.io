---
layout: post
title: 浅谈js原型
tags: javascript
category: 记录
description: 突发奇想，想写一篇原型的文章，也可能是因为对原型有更深的理解吧，在这里做个记录，来记录下自己的理解加深下记忆。
date: 2018/04/03
---

# 前言

突发奇想，想写一篇原型的文章，也可能是因为对原型有更深的理解吧，在这里做个记录，来记录下自己的理解加深下记忆。

> 总之，希望本文的内容能够对您的学习或者工作有所帮助。另，如果有任何的错误或者不足请指正!


# 创建对象有几种方法

js里说到原型，肯定离不开面向对象，说到面向对象肯定离不开对象，本文总结了大致3种创建对象的方法

1. 字面量创建

2. 显式的构造函数创建

3. 使用Object.create()创建

# 原型、构造函数、实例、原型链

原型：函数都有prototype属性,是js默认添加的,prototype指向构造函数的原型对象,只有当函数是构造函数的时候,prototype才有意义

实例：只要是一个对象，都是实例

构造函数：构造函数是可以使用new运算符生成一个实例的函数就是构造函数，任何一个函数，只要被new使用了，都是构造函数

ps:原型有个构造器:constructor（构造器）,指向是声明的构造函数


> 总结:

1. 构造函数通过new和实例关联

2. 构造函数通过prototype和原型对象关联

3. 实例通过__proto__和原型对象关联

4. 原型链是通过__proto__和prototype实现

5. Object.prototype是原型链的顶端


## 先有鸡还是先有蛋??

弄懂了上面那些，我们来看看一个有趣的现像

```javascript
    Function instanceof Object  // true
    Object instanceof Function  // true
```

回答这个问题前，我们需要了解一下Function.protype,因为它是导致Function instanceof Object和Object instanceof Function都为true的根本原因。


1. Function.prototype是个不同于一般函数对象。
    1. Function.prototype像普通函数一样可以调用，但总是返回undefined;
    2. 普通函数实际上是Function的实例

2. Object本身就是一个构造函数，是Function的实例，即Object.__proto__就是Function.prototype

> 我们通过代码来了解一下：

``` javascript

    // 1.Function的构造器是它自身
    Function.constructor=== Function; //true

    // 2.Object的构造器是Function(实际上所有函数的构造器都指向Function)
    Object.constructor === Function; //true

    // 3.Object的__proto__指向Function的prototype
    Object.__proto__ === Function.prototype; //true

    // 4.Function的__proto__指向Function的prototype
    Function.__proto__ === Function.prototype //true

    // 5.Function.prototype的__proto__指向Object.protype
     Function.__proto__.__proto__ === Object.prototype //true

```

O(∩_∩)O，通过这里，我想大概我们可以知道为什么会有这个神奇的现像了吧？


## 是谁创建了它（Object.prototype）呢??

```javascript
    Object.prototype.__proto__===null //true
```

从这里可知,是null创造了一切,正如道德经所说：道生一，一生二，二生三，三生万物

# instanceof的原理

我们再回过头来看先有鸡还是先有蛋的那个问题，造成这个现像的原因还是得归根于instanceof的运算规则。


> instanceof的运算规则

w3c官方解释([传送门](https://www.w3.org/html/ig/zh/wiki/ES5/%E8%A1%A8%E8%BE%BE%E5%BC%8F#instanceof_.E8.BF.90.E7.AE.97.E7.AC.A6)),还是一如既往的难懂 (lll￢ω￢)

我们用个简单的例子说明一下:

```javascript

    var Person = function (){}
    var Student = function (){}
    Student.prototype = new Person;
    var gating = new Student()

    gating instanceof Student //true
    gating instanceof Person //true

```

ps: instanceof会递归查找左边的原型链

> 总结：instanceof检测左侧的__proto__原型链上是否存在右侧的原型对象。


# new运算符

从上我们可以了解到原型、构造函数、实例、原型链了，接下来了解下new运算符

说到new运算符，我们先看看下面这段代码：

```javascript
    function Person(name){
        this.name = name
    }
    var gating = new Person("gating")
```

很简单的一段代码，我们来看看new运算符是如何进行工作的呢？

> 我们可以把它拆分成3步:

1. 创建一个新的对象，他继承于Person.prototype

2. 构造函数Person被执行。相应的参数会被传入，同时this会指向这个新创建的对象。 <font color="#f00">tips:再不传递任何参数的情况下,new Person 等同于 new Person()</font>

3. 如果构造函数返回了一个“对象”，那么这个对象会取代整个new出来的结果。如果构造函数没有返回对象(通常也是这么做的, 不让其有返回值)，那么new出来的结果为步骤1创建的对象

> 我们简单的通过代码实现一下new：

```javascript

    var new2 = function(fun){
        var obj = Object.create(fun.prototype);
        var o = fun.call(obj)
        if(typeof o === 'object'){
            return o
        }else{
            return obj
        }
    }

    var Student = function (){}
    var gating = new2(Student)

    gating instanceof Student //true

```


最后，感谢各位观众老爷观看