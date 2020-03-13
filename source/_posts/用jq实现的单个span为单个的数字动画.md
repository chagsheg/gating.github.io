---
layout: post
title: 用jq实现的单个span为单个的数字动画
tags: javascript
category: 小特效
description: 书接上回，之前用jq实现了单个元素多个数字的动画，然后需求总是很强大的，他需要每个数字要有个图片背景，这就需要单个元素单个背景啦
date: 2018/06/14
---

# 前言

书接上回，之前用jq实现了单个元素多个数字的动画，然后需求总是很强大的，他需要每个数字要有个图片背景，这就需要单个元素单个背景啦

> 废话不多说了，直接上代码：

```html
    <style>
        .mt-number-animate {
            font-family: '微软雅黑';
            line-height: 40px;
            height: 40px;
            font-size: 36px;
            overflow: hidden;
            display: inline-block;
            position: relative;
        }

        .mt-number-animate .mt-number-animate-dot {
            width: 15px;
            line-height: 40px;
            float: left;
            text-align: center;
        }

        .mt-number-animate .mt-number-animate-dom {
            width: 20px;
            text-align: center;
            display:block;
            position: relative;
            top: 0;
			overflow: hidden;
            float: left;
        }

        .mt-number-animate .mt-number-animate-dom .mt-number-animate-span {
            width: 100%;
            float: left;
        }

    </style>
    <div class="mt-number-animate">
        <div class="mt-number-animate-dom" data-num="1">
            <span class="mt-number-animate-span">0</span>
            <span class="mt-number-animate-span">1</span>
            <span class="mt-number-animate-span">2</span>
            <span class="mt-number-animate-span">3</span>
            <span class="mt-number-animate-span">4</span>
            <span class="mt-number-animate-span">5</span>
            <span class="mt-number-animate-span">6</span>
            <span class="mt-number-animate-span">7</span>
            <span class="mt-number-animate-span">8</span>
            <span class="mt-number-animate-span">9</span>
        </div>
        <div class="mt-number-animate-dom" data-num="3">
            <span class="mt-number-animate-span">0</span>
            <span class="mt-number-animate-span">1</span>
            <span class="mt-number-animate-span">2</span>
            <span class="mt-number-animate-span">3</span>
            <span class="mt-number-animate-span">4</span>
            <span class="mt-number-animate-span">5</span>
            <span class="mt-number-animate-span">6</span>
            <span class="mt-number-animate-span">7</span>
            <span class="mt-number-animate-span">8</span>
            <span class="mt-number-animate-span">9</span>
        </div>
        <div class="mt-number-animate-dom" data-num="5">
            <span class="mt-number-animate-span">0</span>
            <span class="mt-number-animate-span">1</span>
            <span class="mt-number-animate-span">2</span>
            <span class="mt-number-animate-span">3</span>
            <span class="mt-number-animate-span">4</span>
            <span class="mt-number-animate-span">5</span>
            <span class="mt-number-animate-span">6</span>
            <span class="mt-number-animate-span">7</span>
            <span class="mt-number-animate-span">8</span>
            <span class="mt-number-animate-span">9</span>
        </div>
    </div>

    <script>
        $(function () {
            var $wrap = $('.mt-number-animate');
            runAnimate($wrap);
        });
        //执行动画
        var runAnimate = function ($parent) {
            $parent.find(".mt-number-animate-dom").each(function () {
                var num = $(this).attr("data-num");
                var spanHei = $(this).height() / 10; //10为元素个数
                var thisTop = -num * spanHei + "px";
                if (thisTop != $(this).css("top")) {
                    $(this).css({
                        'transform': 'translateY(' + thisTop + ')',
                        '-ms-transform': 'translateY(' + thisTop + ')',
                        /* IE 9 */
                        '-moz-transform': 'translateY(' + thisTop + ')',
                        /* Firefox */
                        '-webkit-transform': 'translateY(' + thisTop + ')',
                        /* Safari 和 Chrome */
                        '-o-transform': 'translateY(' + thisTop + ')',
                        '-ms-transition': '1s',
                        '-moz-transition': '1s',
                        '-webkit-transition': '1s',
                        '-o-transition': '1s',
                        'transition': '1s'
                    });
                }
            });
        }
    </script>

```

这里我们巧妙的用了css3的transition，用来实现我们的动画过滤。以上