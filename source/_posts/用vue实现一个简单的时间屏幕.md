---
layout: post
title: 用vue实现一个简单的时间屏幕
tags: javascript
category: [小特效, vue]
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

> ps: `vbase` 是 `vscode` 中 vue 代码片段的一个插件

```html
<template>
  <div></div>
</template>

<script>
  export default {
    name: "TimeScreen",
  };
</script>

<style lang="scss" scoped></style>
```

## 思考一下，如何做时间切换的动画

emmm... 不知是否有看过我之前的一篇文章[用 jq 实现的单个 span 为单个的数字动画](https://gatings.cn/2018-06-14/%E7%94%A8jq%E5%AE%9E%E7%8E%B0%E7%9A%84%E5%8D%95%E4%B8%AAspan%E4%B8%BA%E5%8D%95%E4%B8%AA%E7%9A%84%E6%95%B0%E5%AD%97%E5%8A%A8%E7%94%BB/)，没错，其实我们实现的思路，和这里基本一样，所以接下来我们就分析分析我们该怎么来实现了吧

首先，我们要明确一下，要有多少个 `span`，众所周知，一天最后就是**23:59:59**，所以我们所需要的 `span` 数组为 `[3, 10, 0, 6, 10, 0, 6, 10]`

> ps: 中间的 `:` 是只需要一个 `span` 的

因为布局不是我们要将的重点，所以我们就想想我们该怎么获取我们需要的东西。比如，怎么获取到`Saturday 14 March`,怎么获取到当前时间

众所周知啦，我们知道 `js` 中提供了 `Date` 这个对象，所以我们可以通过他可以获取我们想要的东西，废话不多说了，开始写代码吧。

新建 `utils` 目录，在该目录下新建 `time.js` 文件，内容如下

```js
// 月份
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// 星期
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// 获取日期
function getTime() {
  const date = new Date();
  const days = date.getDate();
  const month = date.getMonth();
  const day = date.getDay();
  const hours = toDou(date.getHours());
  const minutes = toDou(date.getMinutes());
  const seconds = toDou(date.getSeconds());
  return {
    date: `${weekday[day]} ${days} ${months[month]}`,
    time: `${hours}:${minutes}:${seconds}`,
  };
}
// 转成两位 eg: 6 => 06
function toDou(str) {
  const num = ~~str;
  return num > 9 ? num : "0" + str;
}

// 测试一下我们写的方法，上线记得注释掉
// console.log(getTime()) // {date: "Saturday 14 March", time: "18:53:40"}

export default getTime;
```

通过上面代码，我们就得到我们需要的格式啦，接下来就是写布局啦，但这里不是我们的重点，所以略过

```html
<template>
  <div
    class="time-container"
    :class="{ dark: isDark }"
    @click="toggleClass"
    :date="date"
  >
    <div class="time">
      <template v-for="(str, idx) in time">
        <div
          class="time-num"
          v-if="str !== ':'"
          :style="numStyle[idx]"
          :key="idx"
        >
          <span v-for="(i, spanIdx) in haveSpan[idx]" :key="spanIdx"
            >{{ i - 1 }}</span
          >
          <span>0</span>
        </div>
        <div class="time-dist" v-else :key="idx">
          <span>{{ str }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import getTime from "../utils/time";
  // 设置样式
  function setStyle(val) {
    return `transform: translateY(-${~~val * 100}%)`;
  }
  // 每个字的样式
  function numStyle(time) {
    return time.split("").map((val) => setStyle(val));
  }
  export default {
    name: "TimeScreen",
    data() {
      const { time, date } = getTime();
      return {
        isDark: 0,
        time,
        date,
        numStyle: numStyle(time),
      };
    },
    methods: {
      // 切换样式
      toggleClass() {
        this.isDark = !this.isDark;
      },
    },
    created() {
      // 判单有多少个Span
      // 比较小时数最多24小时，所以第一位最多是3个，0、1、2
      // 这里使用 freeze 是因为这个值已经固定，没有必要进行数据劫持
      this.haveSpan = Object.freeze([3, 10, 0, 6, 10, 0, 6, 10]);
    },
  };
</script>
<style lang="scss" scoped>
  %flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  $timeColor: #d9d4d0;
  $white: #fff;
  .time-container {
    background: $white;
    color: $timeColor;
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 540px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    &.dark {
      background: #000;
      color: $white;
    }
    &::after {
      content: attr(date);
      position: absolute;
      color: $timeColor;
      font-size: 18px;
      line-height: 1;
      transform: rotate(90deg);
      bottom: 20%;
      left: -48px;
    }
    @extend %flexCenter;
    .time {
      font-size: 70px;
      transform: rotate(90deg);
      position: relative;
      height: 106px;
      line-height: 106px;
      overflow: hidden;
      @extend %flexCenter;

      .time-num {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        text-shadow: 0 0 2px $white;
        transition: 0.5s all;
        span {
          display: block;
        }
      }
      .time-dist {
        padding-bottom: 15px;
        margin: 0 10px;
      }
    }
  }
</style>
```

写到这里，其实基本的样子已经出来了，这里我们用到了 `attr` 函数，用来回选择元素的属性值，这个小技巧在一些场景很用用哦。

这里我们多加了一个 `<span>0</span>` 这里主要是为了无缝，那么我们如何做到无缝呢？即，当我们滚动最低下的时候，在`500ms`之内让动画取消。

> ps: 这里的 `500ms` 是因为动画设置了 `500ms`,所以需要用 `1s - 500ms` 得出来的`500ms`哦

既然知道了原理，那么我们就开始写我们的代码了

首先定义一下清空动画之后的样式，即

```js
// 清除样式
const style = "transform: translateY(0%);transition:0s all";
```

那么什么时候清空呢，前面也说了，当滚动到最下面的时候，也就是当 `time` 这个字符串某个为 `0` 的时候，我们就要清空了，所以

```js
this.time.split("").forEach((val, idx) => {
    // 当 val 为 0 时，说明已经滚到最底下，这里需要清除动画，并让他回到最顶上来实现无缝
    if (val == 0) {
        if (this.numStyle[idx] !== style) {
            // 500ms后清除当前这个span的动画
            this.removeAnimate(idx);
            // 设置样式
            this.numStyle[idx] = setStyle(this.haveSpan[idx]);
        }
    } else {
        this.numStyle[idx] = setStyle(val);
    }
})

// 清除动画
removeAnimate(idx) {
    setTimeout(() => {
        this.numStyle[idx] = style;
        this.numStyle = [...this.numStyle];
    }, 500);
}
```

最后，就是写一个简单的定时器啦，我想这应该难不倒各位小伙伴啦，所以我就不详解啦，就贴一下代码

```html
<template>
  <div
    class="time-container"
    :class="{ dark: isDark }"
    @click="toggleClass"
    :date="date"
  >
    <div class="time">
      <template v-for="(str, idx) in time">
        <div
          class="time-num"
          v-if="str !== ':'"
          :style="numStyle[idx]"
          :key="idx"
        >
          <span v-for="(i, spanIdx) in haveSpan[idx]" :key="spanIdx"
            >{{ i - 1 }}</span
          >
          <span>0</span>
        </div>
        <div class="time-dist" v-else :key="idx">
          <span>{{ str }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  import getTime from "../utils/time";

  // 清除样式
  const style = "transform: translateY(0%);transition:0s all";

  // 设置样式
  function setStyle(val) {
    return `transform: translateY(-${~~val * 100}%)`;
  }
  // 每个字的样式
  function numStyle(time) {
    // 这里等于0则清除样式，避免0点时，有奇怪的bug
    return time.split("").map((val) => (val == "0" ? style : setStyle(val)));
  }

  export default {
    name: "TimeScreen",
    data() {
      // 获取时间
      let { time, date } = getTime();
      return {
        isDark: 0,
        time,
        date,
        numStyle: numStyle(time),
      };
    },
    methods: {
      // 更新样式
      updateStyle() {
        this.time.split("").forEach((val, idx) => {
          if (val == 0) {
            if (this.numStyle[idx] !== style) {
              this.removeAnimate(idx);
              this.numStyle[idx] = setStyle(this.haveSpan[idx]);
            }
          } else {
            this.numStyle[idx] = setStyle(val);
          }
        });
      },
      // 切换样式
      toggleClass() {
        this.isDark = !this.isDark;
      },
      // 清除样式
      removeAnimate(idx) {
        setTimeout(() => {
          this.numStyle[idx] = style;
          this.numStyle = [...this.numStyle];
        }, 500);
      },
      // 每秒更新时间
      updateTime() {
        const { time, date } = getTime();
        this.time = time;
        this.date = date;
        this.updateStyle();
      },
    },
    created() {
      // 判单有多少个Span
      // 比较小时数最多24小时，所以第一位最多是3个，0、1、2
      this.haveSpan = Object.freeze([3, 10, 0, 6, 10, 0, 6, 10]);
      // 定时器
      this.timer = null;
    },
    mounted() {
      // 触发定时器
      this.timer = setInterval(this.updateTime, 1000);
    },
    destroyed() {
      // 清除定时器
      clearInterval(this.timer);
    },
  };
</script>

<style lang="scss" scoped>
  %flexCenter {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  $timeColor: #d9d4d0;
  $white: #fff;
  .time-container {
    background: $white;
    color: $timeColor;
    position: absolute;
    width: 100%;
    height: 100%;
    max-width: 540px;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    &.dark {
      background: #000;
      color: $white;
    }
    &::after {
      content: attr(date);
      position: absolute;
      color: $timeColor;
      font-size: 18px;
      line-height: 1;
      transform: rotate(90deg);
      bottom: 20%;
      left: -48px;
    }
    @extend %flexCenter;
    .time {
      font-size: 70px;
      transform: rotate(90deg);
      position: relative;
      height: 106px;
      line-height: 106px;
      overflow: hidden;
      @extend %flexCenter;

      .time-num {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        text-shadow: 0 0 2px $white;
        transition: 0.5s all;
        span {
          display: block;
        }
      }
      .time-dist {
        padding-bottom: 15px;
        margin: 0 10px;
      }
    }
  }
</style>
```

# 最后的最后

感谢各位观众老爷的观看啦 O(∩_∩)O，希望大家可以一起进步
