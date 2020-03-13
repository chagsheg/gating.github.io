---
layout: post
title: 用js实现简单的抛物线运动
tags: javascript
category: 小特效
description: 老早就看过一些购物车的抛物线效果，也想自己凑热闹动手来实现一遍。然后(lll￢ω￢) 书到用时方恨少，发现高中学到物理啊、数学啊，都忘光了，抛物线公式都忘了0 0。顺手百度一波，从百度可知：y=ax^2+bx+c
date: 2018/04/09
---

# 前言

老早就看过一些购物车的抛物线效果，也想自己凑热闹动手来实现一遍。

然后(lll￢ω￢) 书到用时方恨少，发现高中学到物理啊、数学啊，都忘光了，抛物线公式都忘了0 0。

顺手百度一波，从百度可知：y=ax^2+bx+c

ps：顺路吐槽一下，以前学习是为了应付考试，该忘的都忘了，根本不知道怎么运用到实际生活中，没有学以致用

# 实现

吐槽完了，现在我们准备看看怎么实现我们的抛物线动画啦

首先从公式和我们页面的dom可知，坐标点(x,y)是已知的，参数a、b、c是未知

因为坐标系是由我们设定，所以我们可以假设我们的初始点为(0,0) O(∩_∩)O这样也是方便我们后面的计算

代入公式可知，c = 0  则剩下的问题就是求a、b了

假设a=0.001 => <font color="#f00">实际指焦点到准线的距离，可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的</font>

则 b =  (y - 0.001 * x * x) / x , 那么b也是可以算出来的了，知道了这些，终于，我们可以写代码了 O(∩_∩)O


> 完整代码：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        div {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            position: absolute;
        }

        #div1 {
            background: red;
            top: 10%;
            left: 10%;
        }

        #div2 {
            background: #ccc;
            top: 50%;
            right: 50%;
        }
    </style>
</head>

<body>

    <div id="div1"></div>
    <div id="div2"></div>

    <button id="btn" onclick="start()">抛物线</button>
    <script>
        // 抛物线计算公式 y = a*x*x + b*x + c
        // 坐标点x、y是已知的，a、b、c是未知的

        // 获取初始元素
        let oDiv1 = document.getElementById("div1")

        // 获取目标元素
        let oDiv2 = document.getElementById("div2")

        // 获取初始元素的位置
        let elX = oDiv1.getBoundingClientRect().left
        let elY = oDiv1.getBoundingClientRect().top

        // 获取初始元素到目标元素的偏移总量
        let diffX = oDiv2.getBoundingClientRect().left - oDiv1.getBoundingClientRect().left
        let diffY = oDiv2.getBoundingClientRect().top - oDiv1.getBoundingClientRect().top

        // 假设(elX,elY)为(0,0),则c = 0，求a、b
        // 设a=0.001 => 实际指焦点到准线的距离，可以抽象成曲率，这里模拟扔物体的抛物线，因此是开口向下的
        let a = 0.001

        // 则 b = (y - a*x*x) / x
        let b = (diffY - a * diffX * diffX) / diffX

        // 定义一个定时器，用来执行抛物线动画
        let timer = null;

        // 执行的时间
        let duration = 1500

        function start() {
            // 执行的开始时间
            beginTime = new Date()
            // 结束的时间
            endTime = +beginTime + duration
            // 定时器，执行抛物线动画
            timer = setInterval(() => {
                let now = new Date()
                step(now);
            }, 13);
        }

        // 抛物线动画的方法
        function step(now) {
            let x, y;
            if (now > endTime) {
                // 运行结束
                x = diffX;
                y = diffY;
                clearInterval(timer);
            } else {
                // 计算每一步的X轴的位置
                x = diffX * ((now - beginTime) / duration);
                // 则每一步的Y轴的位置y = a*x*x + b*x + c;   c==0;
                y = a * x * x + b * x;
            }
            oDiv1.style.cssText = `position:absolute;left:${elX + x}px;top:${elY + y}px`
        }
    </script>

</body>

</html>
```

最后，感谢各位观众老爷观看