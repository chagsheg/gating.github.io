---
layout: post
title: Vue+Antd搭配百度地图实现搜索定位等功能
tags: [vue, ant-design-vue, baidu-map]
category: 记录
description: 最近，在做 vue 项目的时候有做到选择地址功能，而原项目中又引入了百度地图，所以我就打算通过使用百度地图来实现地址搜索功能啦。
date: 2020/11/03
---

# 前言

最近，在做`vue`项目的时候有做到选择地址功能，而原项目中又引入了百度地图，所以我就打算通过使用百度地图来实现地址搜索功能啦。

本次教程可能过于啰嗦，所以这里先放上预览地址供大家预览——[点我预览](https://gating.gitee.io/demo/baidu-map-demo/)，也可到文末直接下载代码先自行体验。。。

> ps: 又因为百度地图 1.2 以上需要 AK 密钥，所以这里我直接使用 1.2 版本实现
> ps: 😐1.x版本是不能支持https的，所以使用时请注意

# 简单的说下实现的效果

因为我这边做的是打卡的地址选择，那么肯定要有搜索提示来选取地址啦，又因为是打卡，肯定的打卡的范围选择。为了用户体验，我们也要添加点击地图任意位置生辰对应的地址，也要可以拖拽标注来生成对应地址。

既然知道了功能点，那么我们就上效果图吧 😁

![baidu-map-demo效果图](https://cdn.jsdelivr.net/gh/GATING/blog_imgs/2020-11-03/renderings.jpg)

看到这，我们大概知道的功能点有：

- 设置图像标注并绑定拖拽标注结束后事件
- 绑定点击地图任意点事件
- 封装逆地址解析函数，用于通过坐标点获取详细地址
- 添加输入提示来选取地址
- 添加地图覆盖物(圆)，用于标识我们选择的范围

看到这里，是不是也想跃跃欲试啦，所以，我们就开始写我们的代码吧

# 搭建项目

因为，用到了`vue`，所以我们肯定安装`vue-cli`这个脚手架啦，又因为`Vue3`发布了正式版，所以这次我们的教程当然是使用`Vue3`进行开发啦，所以我们脚手架可能需要更新一下。

```bash
npm install -g @vue/cli
# OR
yarn global add @vue/cli
```

> ps: 建议都更新下咯，避免无法创建 vue3 的项目

这里我们选择默认的配置就好了，如图:

![vue3默认配置](https://cdn.jsdelivr.net/gh/GATING/blog_imgs/2020-11-03/default-options.jpg)

> 若安装缓慢报错，可尝试用 yarn 或别的镜像源自行安装：rm -rf node_modules && yarn install。

在漫长的等他，他安装了我们的模板，从标题我们也知道，这里我们使用`ant-design-vue`啦，因为`element-ui`现在还没有支持`Vue3`，而`element-plus`的文档还是`element-ui`的，对我们十分不友好，支持的也不完善，所以我们这里直接使用`ant-design-vue@2.x`啦。

所以废话不多说了，直接安装依赖：

```bash
npm i --save ant-design-vue@next
```

安装完后我们就可以在`main.js`配置下我们的`ant-design-vue`了

```js
import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
createApp(App).use(Antd).mount("#app");
```

> ps：因为这里我们只是做个例子，所以我为了方便直接使用全局了

既然我们用了`Vue3`，我们就说说 `Vue3` 对比 `Vue2` 有什么更爽的点

## Vue2 与 Vue3 的对比

- 对 `TypeScript` 支持更友好了，因为 `Vue2` 所有属性都放在了 `this` 对象上，难以推倒组件的数据类型。

- 同第一点，所有属性都放在了 `this` 对象上，难以实现 `TreeShaking`。

- `Template` 终于支持多个根标签了，不需要每次写模板的时候都加上多余的根元素。

- `Composition Api`，也是我们最听到的新功能(如果你用过`React Hooks`，那一定对它不陌生，因为它和`React Hooks`十分类似)，很多人也建议优先使用`Composition Api`来替代`Mixins`的写法，好处如下：

  1. 相关逻辑可以集中，且更容易复用
  2. 不会因为莫名的变数或方法名找半天，然后发现在`Mixins`
  3. 减少`this`指向问题
  4. 解决组件内的命名冲突
  5. 隐式依赖得到解决，你可以直观的看到消费组件所需要的变量
  6. 其它等等…

- 其它等等…

## 组合式 API

既然我们说了这么多 `Composition Api` 的优点，那么我们该怎么使用他呢？在 `Vue` 组件中，提供了一个`setup`的组件选项，并充当合成 API 的入口点。

> ps: 由于在执行 setup 时尚未创建组件实例，即在 created 之前，因此在 setup 选项中没有 this。这意味着，除了 props 之外，你将无法访问组件中声明的任何属性——本地状态、计算属性或方法。

使用`setup`函数是，他将接受两个参数，分别是`props`和`context`

### Props

`setup` 函数中的第一个参数是 `props`。正如在一个标准组件中所期望的那样，setup 函数中的 props 是响应式的，当传入新的 prop 时，它将被更新。

> ps: 因为 props 是响应式的，你不能使用 ES6 解构，因为它会消除 prop 的响应性

### 上下文

`context`是一个普通的`JavaScript`对象，它暴露三个组件的 property：`attrs`、`slots`、`emit`

```js
export default {
  setup(props, context) {
    // Attribute (非响应式对象)
    console.log(context.attrs);
    // 插槽 (非响应式对象)
    console.log(context.slots);
    // 触发事件 (方法) 同以前的 this.$emit()
    console.log(context.emit);
  },
};
```

`context`是一个普通的`JavaScript`对象，也就是说，它不是响应式的，这意味着你可以安全地对`context`使用`ES6`解构。

```js
export default {
  setup(props, { attrs, slots, emit }) {
    // ...
  },
};
```

😢 因为我们不是`Vue3`基础入门，所以我这里就只讲用到的几个 API，另`Vue3`支持大多数`Vue2`的特性，所以我们用`Vue2`语法开发`Vue3`也是完全没问题的(🤣 开玩笑的)

### ref 函数

闲话就不多说了，先来了解以下`Composition Api`的魅力吧。

在 Vue 3.0 中，我们可以通过一个新的`ref`函数使任何响应式变量在任何地方起作用。

并且`ref`返回的是一个对象值，该对像只包含一个 `value` 属性，且只有我们在`setup`函数进行访问/修改的时候需要加.value，接下来我们就修改下`HelloWorld`组件，来实现一下`选择最喜爱的水果`的小程序吧。

```html
<template>
  <div>请选择你最喜欢的水果</div>
  <div>
    <button v-for="(fruit, idx) in fruits" :key="fruit" @click="handleSelect(idx)">
      {{ fruit }}
    </button>
  </div>
  <div>你最喜欢的是【{{ select }}】</div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const fruits = ref(["芒果", "榴莲", "菠萝"]);
    const select = ref("");
    const handleSelect = (idx) => {
      select.value = fruits.value[idx];
    };
    return {
      fruits,
      select,
      handleSelect,
    };
  },
};
</script>
```

这样子，我们的这个小 demo 就是实现啦。看下我们的代码，有发现了什么吗？没错，我们使用`setup`之后，可以完全不需要 data 和 methods 属性，并且我们可以在组件模板中使用多个根节点。

### reactive 函数

看了上面的代码，可以说没什么章法可言，所有的变量和方法都混淆在一起，最不能忍受的就是在 `setup` 中要改变和读取一个值的时候，还要加上 value。那么这里，我们就引入一个新的 Api `reactive`来优化我们的代码吧。

`reactive`函数接收一个普通对象，返回一个响应式的数据对象。既然是普通对象，那么无论是变量、还是方法，都可以作为对象中的一个属性来使用啦，那么我们就能优雅的修改我们的值，不用再通过`.value`修改我们的值啦，那么就通过`reactive`修改下我们的代码吧。

```html
<template>
  <div>请选择你最喜欢的水果</div>
  <div>
    <button v-for="(fruit, idx) in data.fruits" :key="fruit" @click="data.handleSelect(idx)">
      {{ fruit }}
    </button>
  </div>
  <div>你最喜欢的是【{{ data.select }}】</div>
</template>

<script>
import { reactive } from "vue";
export default {
  setup() {
    const data = reactive({
      fruits: ["芒果", "榴莲", "菠萝"],
      select: "",
      handleSelect(idx) {
        data.select = data.fruits[idx];
      },
    });
    return {
      data,
    };
  },
};
</script>
```

### toRefs 函数

虽然我们通过`reactive`优化了代码，但是看着都需要`data.`也不是事啊，那么有没有什么方法优化这个点呢？实际是有的，Vue3 提供了 `toRefs()`，将响应式对象转换为普通对象，其中结果对象的每个 property 都是指向原始对象相应 property 的 `ref`。

那么我们继续优化我们的代码吧。

```html
<template>
  <div>请选择你最喜欢的水果</div>
  <div>
    <button v-for="(fruit, idx) in fruits" :key="fruit" @click="handleSelect(idx)">
      {{ fruit }}
    </button>
  </div>
  <div>你最喜欢的是【{{ select }}】</div>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
  setup() {
    const data = reactive({
      fruits: ["芒果", "榴莲", "菠萝"],
      select: "",
      handleSelect(idx) {
        data.select = data.fruits[idx];
      },
    });
    return {
      ...toRefs(data),
    };
  },
};
</script>
```

### watch 函数

`watch`函数与选项式 API`this.$watch`(以及相应的 `watch` 选项) 完全等效。`watch`需要侦听特定的`data`源，并在单独的回调函数中副作用。默认情况下，它是懒执行，即回调是仅在侦听源发生更改时调用。

虽然这里的自己不需要使用`watch`和获取真实的`DOM`，但我这里也讲一下，便于后面例子的代码编写(生硬的转折 🤣)。

Vue3 获取真实 dom 元素也比较简单，基本和往常一样，大概分为三步：

1. 和以前一样，在标签上写上 ref 名称
2. 在 setup 中定义一个和标签上 ref 名称一样的 `Ref` 的示例，并返回
3. onMounted 就可以得到 ref 的 RefImpl 的对象，并通过.value 获取

```html
<template>
  <div>请选择你最喜欢的水果</div>
  <div>
    <button v-for="(fruit, idx) in fruits" :key="fruit" @click="handleSelect(idx)">
      {{ fruit }}
    </button>
  </div>
  <!-- 1.和以前一样，在标签上写上 ref 名称-->
  <div ref="selectRef">你最喜欢的是【{{ select }}】</div>
</template>

<script>
import { ref, reactive, toRefs, watch } from "vue";
export default {
  setup() {
    // 2. 定义一个和标签上 ref 名称一样的 Ref 实例
    const selectRef = ref(null);
    const data = reactive({
      fruits: ["芒果", "榴莲", "菠萝"],
      select: "",
      handleSelect(idx) {
        data.select = data.fruits[idx];
      },
    });
    watch(
      () => data.select,
      (val, preVal) => {
        // 得到一个 RefImpl 的对象, 通过 .value 访问到真实DOM
        console.log(selectRef.value);
        console.log(val, preVal);
      }
    );
    return {
      ...toRefs(data),
      selectRef,
    };
  },
};
</script>
```

当然，`watch`还可以监听多个源：

```js
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
});
```

到这里，基本上前置知识都过得差不多了，可以开始编写我们的代码了

# 正式编写代码

通过前面学习的知识点我们大概了解了 Vue3 最基本的用法，那么就可以编写我们的代码了

## 清理下无用的代码

用 `vue-cli` 生产的 Vue3 项目中，我们修改了`HelloWorld`用于学习了 Vue3 的基本 Api，实际上我们接下来的案例是不需要这些代码的，所以我们打开`App.vue`，去掉部分无关代码，并在`components`目录新建`MapDialog.vue`文件，内容如下：

```html
<template>
  <div>这是地图弹窗</div>
</template>

<script>
export default {
  name: "MapDialog",
};
</script>
```

清理无用代码后并导入`MapDialog`组件

```html
<template>
  <map-dialog />
</template>

<script>
import MapDialog from "./components/MapDialog.vue";
export default {
  name: "App",
  components: {
    MapDialog,
  },
};
</script>
```

## 百度地图基本使用

前文也说了，我之前项目是通过`script`标签引入的，所以这里我们也是直接引入 js 库

> ps: 也可以通过 npm 安装 vue-baidu-map 引入[vue-baidu-map](https://dafrok.github.io/vue-baidu-map/#/)这个百度地图组件

1. 引入 js 库

打开`public/index.html`，引入 js

```html
<script type="text/javascript" src="https://api.map.baidu.com/api?v=1.2"></script>
```

2. 编写代码

```html
<template>
  <div id="map"></div>
</template>

<script>
import { onMounted } from "vue";
export default {
  name: "MapDialog",
  setup() {
    onMounted(() => {
      const { Map, Point } = BMap;
      const map = new Map("map");
      const point = new Point(116.404, 39.915);
      map.centerAndZoom(point, 16);
      map.enableScrollWheelZoom();
    });
  },
};
</script>

<style scoped>
#map {
  height: 400px;
}
</style>
```

写到这里可能会出现下图的一个错误：

![eslint](https://cdn.jsdelivr.net/gh/GATING/blog_imgs/2020-11-03/eslint.jpg)

因为我们选择了默认模板，里面又包括了`eslint`而我们又引入了一个`BMap`的全局变量，`eslint`不认识它，所以会报`BMap is not defined.`这个错误。怎么解决呢？我们只需要告诉`eslint`，这是全局变量即可，打开`package.json`，添加如下配置：

```json
{
  // ...
  "eslintConfig": {
    // ...
    "globals": {
      "BMap": true,
      "BMAP_STATUS_SUCCESS": true
    }
  }
  // ...
}
```

值得注意的点是：

- 容器 div 需要使用 id
- 容器 div 需要指定宽高

其余用法与 html 中编码无异

编写完这个代码后，我们就可以在页面看到百度地图的雏形并且不会报错了，接下来就可以开始书写其他功能的代码啦 O(∩_∩)O~~

## 先从简单的开始入手

从前文的效果图可以知道，我们是通过点击`选择位置`按钮来弹出地图的，这里我就不一步步编写基本的`ui`了，直接上基础代码了

`App.vue`代码如下

```html
<template>
  您选择的位置是：{{ place.address }}
  <a-button @click="toggleVisible">选择位置</a-button>
  <map-dialog v-model:visible="visible" :point="place.point" :range="place.range" @confirm="handleConfirm" />
</template>

<script>
import { reactive, toRefs } from "vue";
import MapDialog from "./components/MapDialog.vue";
export default {
  name: "App",
  components: {
    MapDialog,
  },
  setup() {
    const data = reactive({
      place: {},
      visible: false,
      toggleVisible() {
        data.visible = !data.visible;
      },
      handleConfirm(place) {
        data.place = place;
      },
    });
    return {
      ...toRefs(data),
    };
  },
};
</script>
```

这里用了我们`v-mode:visible`对`visible`对这个`props`进行了双向绑定，实际上在 Vue2.x 的写法中是通过`:visible.sync`修饰符来实现的

详细了解，请参考[这个链接](https://vue3js.cn/docs/zh/guide/migration/v-model.html)

`MapDialog.vue` 基础代码如下：

```html
<template>
  <a-modal
    :visible="visible"
    centered
    title="请选择地址"
    cancelText="取消"
    okText="确定"
    @cancel="close"
    @ok="handleOk"
  >
    <a-form class="form" layout="inline" ref="mapForm" :model="form" :rules="rules">
      <a-form-item name="address">
        <a-auto-complete
          v-model:value="form.address"
          :options="addressSource"
          placeholder="请输入你要搜索的地点"
          @search="handleQuery"
          @select="handleSelect"
          style="width: 360px"
        />
      </a-form-item>
      <a-form-item name="range">
        <a-select v-model:value="form.range" placeholder="请选择范围" @change="setRadius">
          <a-select-option v-for="range in ranges" :key="range">
            {{ range }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <div id="map"></div>
  </a-modal>
</template>

<script>
import { ref, reactive, toRefs, watch, nextTick } from "vue";
export default {
  name: "MapDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    range: {
      type: String,
      default: "300米",
    },
    point: {
      type: Object,
      default: () => ({ lng: 113.271429, lat: 23.135336 }),
    },
  },
  setup(props, { emit }) {
    const mapForm = ref(null);
    const formData = reactive({
      form: {
        address: "",
        range: props.range,
      },
      rules: {
        address: [
          {
            required: true,
            message: "请输入你要搜索的地点",
            trigger: "blur",
          },
        ],
      },
      ranges: ["100米", "300米", "500米"],
      addressPoint: props.point,
      addressSource: [],
      setRadius() {},
      handleQuery() {},
      handleSelect() {},
      close() {
        emit("update:visible", false);
        mapForm.value.resetFields();
      },
      handleOk() {
        mapForm.value.validate().then(() => {
          emit("confirm", {
            address: formData.form.address,
            point: formData.addressPoint,
            range: formData.form.range,
          });
          emit("update:visible", false);
        });
      },
    });

    const { Map, Point } = BMap;

    // 地图相关元素，因为可能在别的方法使用
    let map = null;

    // 初始化地图
    function initMap() {
      // 防止dom还未渲染
      nextTick(() => {
        // 禁用地图默认点击弹框
        map = new Map("map", { enableMapClick: false });
        const { lng, lat } = formData.addressPoint;
        const point = new Point(lng, lat);
        map.centerAndZoom(point, 16);
        map.enableScrollWheelZoom();
      });
    }
    watch(
      () => props.visible,
      (visible) => {
        visible && initMap();
      }
    );
    return {
      mapForm,
      ...toRefs(formData),
    };
  },
};
</script>

<style scoped>
#map {
  height: 400px;
}
.form {
  height: 66px;
}
</style>
```

复制进去，基本上整个模子就出来了，接下来就是实现我们的功能了

### 设置图像标注并绑定拖拽标注结束后事件

百度地图提供了很多覆盖物供我们很多覆盖物的类，而我们这里使用`Marker`标注点，也就是我们效果图所看到的小红点，因为它可以比较形象的标注用户看到的兴趣点(就比如我们选中的地址)。

当然，它也可以自定义新的图标，不过这不是我们这篇案例的重点，有兴趣的可以参考[标注](http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/mark)、(自定义 Marker 图标)[http://lbsyun.baidu.com/jsdemo.htm#eChangeMarkerIcon]

设置图像标注并并绑定拖拽事件非常简单，只需要下面几行代码：

```js
// 导入Marker类
const { Map, Point, Marker } = BMap;
// 地图相关元素，因为可能在别的方法使用
let map = null,
  marker = null;

// 初始化地图
function initMap() {
  // 防止dom还未渲染
  nextTick(() => {
    // ...
    // 创建一个图像标注实例，允许启用拖拽Marker
    marker = new Marker(point, { enableDragging: true });
    map.addOverlay(marker);
    // 标注拖拽
    marker.addEventListener("dragend", ({ point }) => {
      console.log(point);
    });
  });
}
```

这样你就可以在地图上看到小红点，并且可以拖拽小红点啦，拖拽释放后还会在浏览器打印出坐标点。

### 绑定点击地图任意点事件

既然实现拖拽标注结束后获取坐标点，当然在地图上选取任意点，我们也需要获取该点的地址信息啦。

实现也十分简单，代码如下：

```js
// 初始化地图
function initMap() {
  // 防止dom还未渲染
  nextTick(() => {
    // ...
    // 地图点击
    map.addEventListener("click", ({ point }) => {
      getAddrByPoint(point);
    });
  });
}
```

### 添加地图覆盖物(圆)

因为我们需要选中返回，那么覆盖物-圆就最符合我们的需求了，所以我们接下来添加一下吧

```js
// 因为默认的圆太难看了，所以我修改了下样式
const circleOptions = {
  strokeColor: "#18A65E",
  strokeWeight: 2,
  fillColor: "#18A65E",
  fillOpacity: "0.1",
};

export default {
  // ...
  setup(props, { emit }) {
    // ...
    const { Map, Point, Marker, Circle } = BMap;

    // 初始化地图
    function initMap() {
      // 防止dom还未渲染
      nextTick(() => {
        // ...
        // 创建一个覆盖物——圆
        circle = new BMap.Circle(point, parseInt(formData.form.range), circleOptions);
        // 添加覆盖物
        map.addOverlay(circle);
      });
    }
    return {
      mapForm,
      ...toRefs(formData),
    };
  },
};
```

既然已经添加了圆，那么当我们改变了范围的时候这个圆肯定也要跟着改变啦

```js
const formData = reactive({
  // ...
  setRadius() {
    circle.setCenter(formData.addressPoint);
    circle.setRadius(parseInt(formData.form.range));
  },
  // ...
});
```

切换一下，看我们的圆是不是会变大和变小啦？

### 封装逆地址解析函数，用于通过坐标点获取详细地址

写到这里，我们已经获取可以点击地图和拖拽获取坐标点了，那么我们缺少什么呢？没错，就是缺少了个可以解析坐标点的方法。

参考[地址逆解析](http://lbsyun.baidu.com/jsdemo.htm#xRevAddressParseSingle)，我们就可以封装一个根据坐标点可以获取到距离位置的方法了，同时也可以给地图设置默认的地址了。

```js
const { Map, Point, Marker, Circle, Geocoder } = BMap;
const geco = new Geocoder();

// 逆地址解析函数
function getAddrByPoint(point) {
  geco.getLocation(point, (res) => {
    formData.addressPoint = point;
    formData.form.address = res.address;
    formData.setRadius();
    map.panTo(point);
    marker.setPosition(point);
  });
}

// 初始化地图
function initMap() {
  // 防止dom还未渲染
  nextTick(() => {
    // ...
    // 标注拖拽
    marker.addEventListener("dragend", ({ point }) => {
      getAddrByPoint(point);
    });

    // 地图点击
    map.addEventListener("click", ({ point }) => {
      getAddrByPoint(point);
    });
    // ...
    // 设置默认地址
    geco.getLocation(point, (res) => {
      formData.form.address = res.address;
    });
  });
}
```

### 添加输入提示来选取地址

实现到现在，其实基本上功能都已经写完了，就差一个搜索功能。而百度地图提供的检索功能有很多，这里我采用的是[本地检索](http://lbsyun.baidu.com/jsdemo.htm#i1_4)，感兴趣的可以看看他其他的检索功能。

Antdd 的 AutoComplete 可以参考[这个链接](https://2x.antdv.com/components/auto-complete-cn/)，这里就不做进一步地讲解了。

主要用到了`search`和`select`两个事件回调。

```js
const formData = reactive({
  // ...
  handleQuery(query) {
    if (!query) {
      formData.addressSource = [];
      return;
    }
    local.search(query);
  },
  handleSelect(item) {
    const { point } = formData.addressSource.find(({ value }) => value === item);
    formData.addressPoint = point;
    formData.setRadius();
    marker.setPosition(point);
    map.panTo(point);
  },
  // ...
});

const { Map, Point, Marker, Geocoder, LocalSearch } = BMap;
// 地图相关元素，因为可能在别的方法使用
let map = null,
  marker = null,
  circle = null,
  local = null;
// 初始化地图
function initMap() {
  // 防止dom还未渲染
  nextTick(() => {
    // ...
    // 创建本地检索实例供search回调使用
    local = new LocalSearch(map, {
      onSearchComplete: (results) => {
        if (local.getStatus() == BMAP_STATUS_SUCCESS) {
          const res = [];
          for (var i = 0; i < results.getCurrentNumPois(); i++) {
            const { title, address } = results.getPoi(i);
            res.push({
              ...results.getPoi(i),
              value: `${title}(${address})`,
            });
          }
          formData.addressSource = res;
        }
      },
    });
  });
}
```

至此，我们就完成了所有的功能点啦 φ(\*￣ 0 ￣) 当然，其实好多没有完善的点，就等着各位之后完善咯

> [gitee 地址](https://gitee.com/gating/demo/tree/master/baidu-map-demo),[github 地址](https://github.com/GATING/demo/tree/master/baidu-map-demo)

# 参考链接

[Ant Design of Vue](https://2x.antdv.com/docs/vue/introduce-cn/)

[什么是组合式 API？](https://vue3js.cn/docs/zh/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api)

# 最后

虽然本文罗嗦了点，但还是感谢各位观众老爷的能看到最后 O(∩_∩)O 希望你能有所收获 😁
