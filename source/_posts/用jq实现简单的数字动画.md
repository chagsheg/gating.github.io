---
layout: post
title: 用jq实现简单的数字动画
tags: javascript
category: 小特效
description: 之前的一个小需求，就是让span标签的数字自动累加到xxx
date: 2018/04/08
---

# 前言

之前的一个小需求，就是让span标签的数字自动累加到xxx

> 废话不多说了，直接上代码：

```html

    <div id="num">
        0
    </div>

    <script>
        function BeatNum(value) {
            var num = $("#num");
            num.animate({
                count: value
            }, {
                duration: 1500,
                step: function (now) {
                    num.text(String(parseInt(this.count)));
                    if (now == value) {
                        num.text(value);
                    }
                }
            });
        };

        BeatNum(10000)
    </script>

```

这里知识实现了一个简单的数字动画，里面有些参数可以自己根据自己的喜爱进行拓展或者修改，以上