---
layout: post
title: ul li表格拖拽、吸附功能
tags: javascript
category: 记录
description: 最近，面试遇到了一家用 ul li 做 table 的，里面有悬浮十字、div 拖拽和吸附等一些功能，回到了家里，就想着自己实现一下。然后，我做的可能比较难看= =，主在功能嘛，谅解谅解
date: 2017/10/20
---

# 前言

最近，面试遇到了一家用 ul li 做 table 的，里面有悬浮十字、div 拖拽和吸附等一些功能，回到了家里，就想着自己实现一下。

然后，我做的可能比较难看= =，主在功能嘛，谅解谅解

首先，我们先布局，效果如下：

( ‘-ωก̀ )不要太鄙视楼主的审美

---

**其实就是 8 个 ul 套装 8 个 li，布局什么的相对简单**

下边贴出 HTML + CSS 的代码：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      ul {
        width: 496px;
      }

      ul li {
        list-style: none;
        width: 60px;
        height: 60px;
        border: 1px solid red;
        float: left;
      }
      /*清除浮动*/

      ul::after {
        content: "";
        clear: both;
        display: block;
      }

      .bg {
        background: skyblue;
      }

      .bg2 {
        position: absolute;
        background: red;
        width: 60px;
        height: 60px;
      }
    </style>
  </head>

  <body>
    <div class="div">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </body>
</html>
```

接下来，我们要实现的就是`JavaScript`了。

我们需要的实现是：当鼠标移动到某个 li 的时候，其所在的同一行（即 ul）背景会发生改变，同一列的 li 的背景也会发生改变，移出去的时候则背景变回原来的样子。

也就是下图这样：

![悬浮效果图](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2017-10-20/20171020210934633.jpg)

从上述描述就可以知道了，我们需要借助 mouseovr、mouseout 事件啦，（●´∀ ｀）那我们就开始着手写代码吧

```js
$("ul li").on("mouseover", function () {
  var index = $(this).index();
  $(this).parent().addClass("bg");
  $("ul").each(function () {
    $(this).find("li").eq(index).addClass("bg");
  });
});
$("ul li").on("mouseout", function () {
  var index = $(this).index();
  $(this).parent().removeClass("bg");
  $("ul").each(function () {
    $(this).find("li").eq(index).removeClass("bg");
  });
});
```

这样子，第一个效果就实现啦 ╭(● ｀ ∀´●)╯╰(●’◡’●)╮ (●’◡’●)ﾉ ヾ(_´▽‘_)ﾉ

**接下来，就是要点击 li 后，在 li 上创建一个完全遮罩 li 的 div（也就是数据块），然后实现拖拽啦**

**先上效果图：**

![拖拽效果图](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2017-10-20/20171020211928900.jpg)

首先，我们需要知道点击了哪个`li`，然后获取元素距离文档的位置，之后在给`div`定位

有了这样的思路，那我们就可以着手写我们的 `JavaScript` 啦

> ps：div 必须是绝对定位（absolute）才可以哦

```js
$("ul li").on("click", function (e) {
  var oDiv = $("<div class='bg2'></div>");
  var disY = 0;
  var disX = 0;
  oDiv.css({
    left: $(this).offset().left + 1,
    top: $(this).offset().top + 1,
  });
  $(".div").append(oDiv);
  oDiv.mousedown(function (ev) {
    disX = ev.pageX - $(this).offset().left;
    disY = ev.pageY - $(this).offset().top;
    $(document).mousemove(function (ev) {
      oDiv.css("left", ev.pageX - disX);
      oDiv.css("top", ev.pageY - disY);
    });
    $(document).mouseup(function (e) {
      $(document).off();
    });
    return false;
  });
});
```

这里 div 的（left 和 top）+1 是因为我给 li 设置了 1px 的 border
到了这里了，我们就可以发现一个问题，我们的 div 是不吸附在 li 上的，这里需要怎么做呢？

聪明的小伙伴们，其实一看就知道了，我们可以获取所有 li 的坐标，然后判断 div 的坐标距离哪个 li 近，那就吸附在哪个 li 上面

那么，有了这个思路，我们就可以实行我们的想法

---

首先，我们可以先尝试一下简单的坐标怎么取最近的点。

先规定一下我们坐标的格式，posArr=[{x:1,y:2},x:1,y:2},x:1,y:2}]

点的格式（**也就是 div 的坐标**）divPos = {x,y}

```js
var posArr = [
  {
    x: 0,
    y: 0,
  },
  {
    x: 10,
    y: 20,
  },
  {
    x: 20,
    y: 30,
  },
];

var divPos = {
  x: 1,
  y: 2,
};

var result = {
  index: 0, //数组索引
};

for (var i = 0; i < posArr.length; i++) {
  var x = posArr[i].x - divPos.x;
  var y = posArr[i].y - divPos.y;
  x = x > 0 ? x : -x;
  y = y > 0 ? y : -y;
  var temp = x + y;
  //第一次进来赋值
  if (i == 0) {
    result.x = i;
    result.y = temp;
  } else {
    if (result.y > temp) {
      result.index = i;
      result.y = temp;
    }
  }
}
console.log(arr[result.index].x);
console.log(arr[result.index].y);
```

从这里，我们可以获取到这个点的 x 坐标和 y 坐标，这样子，就可以实现我们上面的想法了。

整个代码如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
    <style>
      * {
        padding: 0;
        margin: 0;
      }

      ul {
        width: 496px;
      }

      ul li {
        list-style: none;
        width: 60px;
        height: 60px;
        border: 1px solid red;
        float: left;
      }
      /*清除浮动*/

      ul::after {
        content: "";
        clear: both;
        display: block;
      }

      .bg {
        background: skyblue;
      }

      .bg2 {
        position: absolute;
        background: red;
        width: 60px;
        height: 60px;
      }
    </style>
  </head>

  <body>
    <div class="div">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
    <script src="https://cdn.bootcss.com/jquery/2.2.1/jquery.min.js"></script>
    <script>
      var posArr = [];
      for (var i = 0; i < $("ul li").length; i++) {
        posArr.push({
          x: $("ul li").eq(i).offset().left,
          y: $("ul li").eq(i).offset().top,
        });
      }

      $("ul li").on("mouseover", function () {
        var index = $(this).index();
        $(this).parent().addClass("bg");
        $("ul").each(function () {
          $(this).find("li").eq(index).addClass("bg");
        });
      });
      $("ul li").on("mouseout", function () {
        var index = $(this).index();
        $(this).parent().removeClass("bg");
        $("ul").each(function () {
          $(this).find("li").eq(index).removeClass("bg");
        });
      });
      $("ul li").on("click", function (e) {
        var oDiv = $("<div class='bg2'></div>");

        oDiv.css({
          left: $(this).offset().left + 1,
          top: $(this).offset().top + 1,
        });
        $(".div").append(oDiv);
        var disY = 0;
        var disX = 0;
        oDiv.mousedown(function (ev) {
          var result = {
            index: 0,
          };
          disX = ev.pageX - $(this).offset().left;
          disY = ev.pageY - $(this).offset().top;
          $(document).mousemove(function (ev) {
            oDiv.css("left", ev.pageX - disX);
            oDiv.css("top", ev.pageY - disY);
          });
          $(document).mouseup(function (e) {
            for (var i = 0; i < posArr.length; i++) {
              var x = posArr[i].x - oDiv.offset().left;
              var y = posArr[i].y - oDiv.offset().top;
              x = x > 0 ? x : -x;
              y = y > 0 ? y : -y;
              var temp = x + y;
              if (i == 0) {
                //第一次进来赋值
                result.x = i;
                result.y = temp;
              } else {
                if (result.y > temp) {
                  result.index = i;
                  result.y = temp;
                }
              }
            }
            oDiv.css("left", posArr[result.index].x + 1);
            oDiv.css("top", posArr[result.index].y + 1);
            $(document).off();
          });
          return false;
        });
      });
    </script>
  </body>
</html>
```

# 最后

这里用了 jquery 也是为了方便操作 DOM，里面有些样式也是为了方便（图做个笔记），写的相当不规范，请各位观众老爷谅解
写的不好，请各位大神见谅，有什么错误也忘指出 ε٩ (๑> 灬 <)۶з

**另外这里没有做边界检测，有兴趣的小伙伴可以自己尝试做一下，也是相对简单**
