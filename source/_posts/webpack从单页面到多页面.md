---
layout: post
title: webpack从单页面到多页面
tags: webpack
category: 记录
description: 从上次更完webpack从什么都不懂到入门之后，好久没有更新过文章了，可能是因为自己懒了吧。今天看了下自己的索引量少了一半o(╥﹏╥)o，发现事态严重，赶紧更新一篇23333
date: 2018/08/22
---

# 前言

从上次更完webpack从什么都不懂到入门之后，好久没有更新过文章了，可能是因为自己懒了吧。今天看了下自己的索引量少了一半o(╥﹏╥)o，发现事态严重，赶紧更新一篇23333

也是因为最近踩了一些多页面的坑，搭了一个简单的多页面架构，对于单页面我想大家看了上篇文章基本入门了吧，接下来我们就开始玩玩多页面了。

那么闲话就不多说了，开始进入正题吧

> 本文的webpack基于webpack4.0，具体是4.12.0版本

# 模块化

对于我们上一个项目，我们没有把我们的webpack的模块化，而对于我们之前写的单页面也越来越大，管理起来也颇为麻烦，而自从es6出来以后，模块化也逐渐融入了前端的思想当中。

接下来，我们简单了解一下前端的模块化规范和如何实现我们的webpack模块化吧

## 什么是模块化

在了解前端模块化规范前，还是需要先来简单地了解下什么是模块化，模块化开发？

> 模块化是指解决一个复杂问题时自顶向下逐层把系统划分成若干模块的过程，有多种属性，分别反映其内部特性。

接力借助大佬的一句话，

> 很多人觉得模块化开发的工程意义是复用，我不太认可这种看法，在我看来，模块化开发的最大价值应该是分治，是分治，分治！（重说三）。不管你将来是否要复用某段代码，你都有充分的理由将其分治为一个模块。

首先，既然是模块化设计，那么作为一个模块化系统所必须的能力：

* 定义封装的模块。
* 定义新模块对其他模块的依赖。
* 可对其他模块的引入支持。

好了，思想有了，那么总要有点什么来建立一个模块化的规范制度吧，不然各式各样的模块加载方式只会将局搅得更为混乱。那么我们接下来就讲讲JavaScript的模块化规范。

## CommonJS

在es6没出来之前，js是没有模块的功能，所以CommonJS应运而生 

CommonJS定义的模块分为:

* 模块引用(require)
* 模块定义(exports)
* 模块标识(module)

require()用来引入外部模块；exports对象用于导出当前模块的方法或变量，唯一的导出口；module对象就代表模块本身。

## AMD

由于一个重大的局限，使得CommonJS规范不适用于浏览器环境。因为我们请求的模块都放在服务器端，等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。

因此，浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是AMD规范诞生的背景。

于是乎，AMD(异步模块定义)出现了，它就主要为前端JS的表现制定规范。而AMD就只有一个接口：define(id?,dependencies?,factory);

AMD 是 RequireJS 在推广过程中对模块定义的规范化产出

## CMD

[CMD传送门](https://github.com/seajs/seajs/issues/242)

CMD 与 AMD 挺相近，二者区别如下：

1. 对于依赖的模块AMD是提前执行，CMD是延迟执行。(RequireJS 从 2.0 开始，也改成可以延迟执行)

2. CMD推崇依赖就近，按需加载；AMD推崇依赖前置。

3. AMD 的 api 默认是一个当多个用，CMD 严格的区分推崇职责单一，其每个 API 都简单纯粹。

CMD 是 SeaJS 在推广过程中对模块定义的规范化产出

## UMD

UMD是AMD与CommonJS模块方式的糅合。

AMD 浏览器第一的原则发展 异步加载模块。

CommonJS 模块以服务器第一原则发展，选择同步加载，它的模块无需包装(unwrapped modules)。

这迫使人们又想出另一个更通用的模式UMD （Universal Module Definition）。希望解决跨平台的解决方案。

他的缺点是：代码量太大。兼容需要额外的代码，而且是每个文件都要写这么一大段代码。


# 实现webpack模块化

当然，webpack模块化是基于CommonJs的，接下来我们一步一步的修改我们之前那个单页面的webpack-demo，先试着把webpakc-demo的模块化。

在根目录下新建 config 的文件夹，用于存放我们各个模块的配置文件

## entry

在config目录下新建 entry.js 文件

代码如下：

```javascript
module.exports = {
    index: './src/js/index.js'
}
```

## output

在config目录下新建 output.js 文件

代码如下：

```javascript
const path = require('path');
module.exports = {
    // 必须是绝对路劲
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js'
}
```

## module

在config目录下新建 modules.js 文件

代码如下：

```javascript
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
    rules: [{
        test: /\.js$/,
        use: ['babel-loader'],
        // 除node_modules目录外，其他都babel编译
        exclude: /node_modules/
    }, {
        test: /\.css$/,
        // 从右向左(从下向上)开始执行
        // 提取css
        use: ExtractTextPlugin.extract({
            // 只在开发环境使用
            // use style-loader in development
            fallback: 'style-loader',
            use: [{
                loader: 'css-loader',
                options: {
                    minimize: true //css压缩
                }
            }, {
                loader: 'postcss-loader'
            }],
            // 解决css打包背景图的路径问题
            publicPath: '../'
        })
    }, {
        test: /\.less$/,
        // use:['style-loader','css-loader','less-loader']
        // 如果想分离less
        use: ExtractTextPlugin.extract({
            // 只在开发环境使用
            // use style-loader in development
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'less-loader'],
            // 解决css打包背景图的路径问题
            publicPath: '../'
        })
    }, {
        test: /\.(png|jpg|gif)$/,
        use: [{
            loader: 'url-loader',
            options: {
                // 小于10kb转成base64
                limit: 10240,
                // 打包后的文件夹
                outputPath: 'img'
            }
        }, {
            loader: 'image-webpack-loader',
            options: {
                // 设置对jpg格式的图片压缩的程度设置
                mozjpeg: {
                    progressive: true,
                    quality: 65
                }
            }
        }]
    }]
}
```

## plugins

在config目录下新建 plugins.js 文件

代码如下：

```javascript
const path = require('path')
// 生成html页面
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 删除某些东西
const CleanWebpackPlugin = require('clean-webpack-plugin')
// 处理静态资源,静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 引入webpack
const webpack = require('webpack')
// 提取css
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 删除冗余css代码
const PurifyCssWebpack = require('purifycss-webpack')
// 用于获取指定文件夹下的文件
const glob = require('glob')
module.exports = [
    // 生成多个页面需要调用多次new HtmlWebpackPlugin() 多页面的配置
    new HtmlWebpackPlugin({
        // 生成多个页面,filename作为标识
        filename: 'index.html',
        // 多页面引入自己的js
        // chunks:['index'],
        // 自定义模板标题
        // 模板页title定义为 <%= htmlWebpackPlugin.options.title %>
        // 必须这么写htmlWebpackPlugin
        title: 'hello world',
        // 模板
        template: './src/index.html',
        // 生成的文件消除缓存
        hash: true,
        // 压缩输出
        minify: {
            // 删除空白字符(折叠空白区域)
            // collapseWhitespace:true,
            // 删除属性的双引号
            // removeAttributeQuotes:true
        }
    }),
    new CleanWebpackPlugin(['dist']),
    // 静态资源输出
    new CopyWebpackPlugin([{
        // 初始文件夹
        from: path.resolve(__dirname, '../src/asset'),
        // 目标文件夹
        to: './public'
    }]),
    // 使用热更新
    new webpack.HotModuleReplacementPlugin(),
    // 提取css
    new ExtractTextPlugin({
        filename: 'css/[name].css',
        // 根据不同环境走不同的配置（在开发环境下不使用）
        disable: process.env.NODE_ENV === "development"
    }),
    // 删除冗余css代码
    new PurifyCssWebpack({
        // purifycss会根据配置的路劲遍历你的HTML文件，查找你使用的CSS
        paths: glob.sync(path.join(__dirname, 'src/*.html')),
        minimize: true
    }),
    // 向全局暴露第三方库
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
    })
]
```

## devServer

在config目录下新建 devServer.js 文件

代码如下：

```javascript
const path = require('path')
module.exports = {
    // 设置服务器访问的基本目录
    contentBase: path.resolve(__dirname, '../dist'),
    // 设置开发服务器的地址
    host: 'localhost',
    // 设置开发服务器的端口
    port: 8080,
    // 自动打开浏览器
    open: true,
    // 配置热更新
    hot: true
}
```

## optimization

在config目录下新建 optimization.js 文件

代码如下：

```javascript
module.exports = {
    splitChunks: {
        cacheGroups: {
            // 这会创建一个vendor代码块，这个代码块包含所有被其他入口(entrypoints)共享的代码。
            vendor: {
                test: /node_modules/,
                chunks: 'initial',
                name: 'vendor',
                priority: 10,
                enforce: true,
            }
        }
    },
    // 为每一个入口默认添加一个只包含 runtime 的 chunk
    runtimeChunk: {
        name: 'runtime'
    }
}
```

## webpack.config.js

再看看我们的webpack.config.js 文件

```javascript
const entry = require('./config/entry')
const output = require('./config/output')
const modules = require('./config/modules')
const plugins = require('./config/plugins')
const devServer = require('./config/devServer')
const optimization = require('./config/optimization')
module.exports = {
    // 入口配置
    entry,
    // 出口文件
    output,
    module: modules,
    plugins,
    // 开发服务器
    devServer,
    optimization
}
```

npm run dev 测试一下，发现和以前的没有区别就成功啦

前面讲了这么多，然后发现和以前一点区别都没有，是不是很像拍死我了，亏我看了大半个钟，然而啥也没学到。

别着急嘛，你在看看我们模块化之后，主文件是不是简单了许多，而且排错也更加的方便直观了


# 多页面构建（正题）

既然已经实现了模块化，我们接下来就说说多页面吧，也是时候进入正题了

上次我们说到，多次new HtmlWebpackPlugin()就可以生成多个页面了，但是如果我们有20来个页面，new个20多次，实属不是很优雅，所以我们想看有没有一个方法，根据我们传进去的路径就可以生成我们制定的页面呢？当然是可以的。不过既然是多页面那么肯定就是多入口的，因为webpack是以js为入口的，所以我们需要在entry那里定义我们的入口即可

打开entry.js，并修改entry的代码

```javascript 
const glob = require('glob')
// 获取所有入口文件
const getEntry = function (globPath) {
    let entries = {};
    glob.sync(globPath).forEach(function (entry) {
        var pathname = entry.split('/').splice(-1).join('/').split('.')[0];
        entries[pathname] = [entry];
    });
    return entries;
};
const entries = getEntry('./src/static/js/*.js')
module.exports = entries
```

打开plugins.js，并修改plugins的代码

```javascript

......

plugins = [
    --w HtmlWebpackPlugin({
    --  filename: 'index.html',
    -- title: 'hello world',
    --  template: './src/index.html',
    --  hash: true,
    --,
    ......
]

const entries = require('./entry')
let chunks = Object.keys(entries);
const metaArr = [{
    charset: 'UTF-8'
}, {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
}, {
    'http-equiv': 'X-UA-Compatible',
    content: 'ie=edge'
}]

// 生成HTML文件
chunks.forEach(function (pathname) {
    if (pathname == 'vendor') {
        return;
    }
    var conf = {
        // 输出的文件名
        filename: pathname + '.html',
        // 引用的模板文件
        template: path.resolve(__dirname, '../src/index.html'),
        // 是否清除缓存
        hash: true,
        // 页面的js
        chunks: [pathname, 'runtime', 'vendor'],
        // 将脚本放在head元素中,默认为body中
        // inject: 'head',
        meta: metaArr,
        // 压缩html
        minify: {
            // 删除空白字符(折叠空白区域)
            collapseWhitespace: true,
            // 删除属性的双引号
            removeAttributeQuotes: true
        },
        // 站点图标
        favicon: path.resolve(__dirname, '../src/favicon.ico')
    };
    plugins.push(new HtmlWebpackPlugin(conf));
});

module.exports = plugins
```

在/src/js目录下新建个about.js来测试下我们写的多页面配置，代码如下：

```javascript
console.log('我是about页');
```

修改/src/index.html,代码如下

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= htmlWebpackPlugin.options.title %></title>
</head>
<body>
    <ul>
        <li><a href="./index.html">1</a></li>
        <li><a href="./about.html">2</a></li>
    </ul>
</body>
</html>
```

运行 npm run dev , 点击2，你会发现跳转到了about页，而且控制台也输出了‘我是about页’，这样我们的多页面配置就算是初步完成了


# 模板引擎篇

虽然完成了我们的多页面配置，但是其实你会发现也有很多的不方便啦，像我这么懒的人，肯定是越方便越好

先说说我们的问题，想一个正常的页面，肯定会有很多公共的头部和底部，比如导航栏就是公共的，这时，我们上面的多页面方面，要每次把公共部分写进去，这样就会很麻烦了

如果用过gulp的同学知道有个 gulp-file-include 可以引入公共文件，但是有个缺点，就是导航栏高亮要通过js控制，不能通过传值

我们这里就用 ejs 来解决我们的问题（但是ejs并不能解决我们引入公共头的问题，因为他不支持inclued那种语法），下面会详细说明解决方法

> npm install ejs-loader -S

首先，因为 html-webpack-plugin 不关心你用的是什么模板引起，只要你export出来的是一份完整的HTML字符串，他就会自动处理了。所以，我们这个这边通过js文件来export一份完整的HTML代码。下面我用index.js和about.js作为例子：

因为我们安装了ejs，配置下ejs-loader，修改下config/modules.js

```javascript
module.exports = {
    rules:[{
        test: /\.ejs$/,
        use: ['ejs-loader']
    }]
}
```

## layout模板篇

然后修改下我们src目录，既然我们用了ejs，为了方便我们更好的处理，我们需要修改下我们的目录结构了

把src所有目录删除掉，新建 layout、pages、static 目录，从命名来看，layout是放着我们的模板文件，pages放着是我们的页面文件，static放着我们的资源文件

在layout目录下新建layout.ejs文件，内容如下：

```html
<%= header %>
    <%= content %>
<%= footer %>
```

从代码来看就知道，header、content、footer都是作为一个变量，然后我们新建header.ejs、footer.ejs作为公共头部和尾部

header.ejs内容如下：

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <title><% if (pageTitle) { %><%= pageTitle %><% } %></title>
</head>
<body>
    <header>
        <ul>
           <% navList.forEach(\function(item){ %><li class="<%=item.url==navName?'active':'' %>"><%=item.title %> </li><% }) %>
        </ul>
    </header>
```

> header页面的\都去掉，因为Jekyll编译失败，无奈加上

footer.ejs内容如下：

```html
        <footer>我是公共底部</footer>
    </body>
</html>
```

然后到我们的核心,新建 index.js:

```javascript
const layout = require('./layout.ejs');
const header = require('./header.ejs');
const footer = require('./footer.ejs');
// 这里作为我们需要的参数
const pf = {
    pageTitle: '',
    navName: ''
};
const moduleExports = {
    init({
        pageTitle,
        navName
    }) {
        pf.pageTitle = pageTitle;
        pf.navName = navName;
        return this;
    },
    run(content) {
        const componentRenderData = Object.assign({}, {
            navList: [{
                title: '首页',
                url: 'index'
            }, {
                title: '关于我们',
                url: 'about'
            }]
        }, pf);
        const renderData = {
            header: header(componentRenderData),
            footer: footer(componentRenderData),
            content,
        };
        return layout(renderData);
    },
};
module.exports = moduleExports;
```

index.js的主要功能就是接收各个页面独有的参数（比如说页面名称），并将这些参数传入生成各自HTML字符串，然后根据layout本身的模板文件将各组件的HTML以及页面实际内容的HTML拼接在一起，最终形成一个完整的HTML页面文档。


## pages页面篇

在我们之前新建的pages目录下新建我们的页面目录，这里我们新建index和about目录，为什么新建是因为我们需要用他们各自的js到处完整的HTML字符串（上面也说了），接下啦就是开始干正事了

在index目录下新建 index.ejs 和 index.js 文件

index.ejs主要负责layout模板中的content内容，主要是页面内容：

```html
<ul>
    <li>1</li>
    <li>2</li>
</ul>
<h1 class="h1">我是首页</h1>
<img src="${require('../../static/img/1.jpg')}">
```

index.js 主要是负责导出页面的字符串

```javascript
const content = require('./index.ejs');
const layout = require('../../layout');
module.exports = layout.init({
    pageTitle: '首页',
    navName: 'index'
}).run(content());
```

做了这些处理之后，会发现我们的入口文件发生了改变，这样子就需要修改我们的入口配置文件了，打开config/entry.js文件

```javascript
--const entries = getEntry('./src/js/*.js')
const entries = getEntry('./src/static/js/*.js')
```

也是因为我们使用js为入口，修改下config下的modules.js和plugins.js文件

modules.js

```javascript
const path = require('path')
module.exports = {
    rules : [{
            --exclude: /node_modules/
            include: [
                path.resolve(__dirname, '../src/static/js')
            ]
        }]
}
```
plugins.js

```javascript
// 修改template
template: path.resolve(__dirname, '../src/pages/' + pathname + '/' + pathname + '.js'),
```

然后运行npm run dev 发现和之前没有变化 O(∩_∩)O 这样就基本完成多页面的配置了


# 掉坑篇

## css-loader的坑

因为css-loader升级到1.0.0版本之后，压缩就失效了，css-loader把cssnano移除掉了，导致无法压缩，这里作者推荐的其中一个解决方案是@intervolga/optimize-cssnano-plugin

这里我们安装一下

> npm i @intervolga/optimize-cssnano-plugin -S

然后在plugins.js添加下配置，修改如下:

```javascript
// 解决css压缩
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
plugins = [
    ......
    new OptimizeCssnanoPlugin({
        // sourceMap: nextSourceMap,
        cssnanoOptions: {
            preset: ['default', {
                discardComments: {
                    removeAll: true,
                },
            }],
        }
    })
]
```

## 字体文件的坑

因为我们很经常用bootstrap这种UI库，所以我们引入这种库报个需要一个loader处理这种字体文件，所以我们修改下modules.js文件

```javascript
module.exports = {
     rules:[{
        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
        use: [{
            loader: 'url-loader',
            options: {
                // 小于10kb转成base64
                limit: 10240,
                // 打包后的文件夹
                outputPath: 'img'
            }
        }, {
            loader: 'image-webpack-loader',
            options: {
                // 设置对jpg格式的图片压缩的程度设置
                mozjpeg: {
                    progressive: true,
                    quality: 65
                }
            }
        }]
    }]
}
```

# 优化篇

## babel优化

```json
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": ["transform-object-assign", "transform-runtime"]
}
```

虽然我们之前那个对于const、let这些常用es6可以转成es5，但对于Object.assign这些还是不行，我们这里优化一下我们之前的babel，安装下面依赖

> npm install babel-plugin-transform-object-assign babel-preset-stage-2 babel-plugin-transform-runtime -S


## DllPlugin

DllPlugin 是什么？从官方的说法就是，DLLPlugin 和 DLLReferencePlugin 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。简单来说，就是webpack的动态链接库，这里的代码不会执行，只是提供给我们引入。

实际就是，我们引入了多个相对较大的库（比如，bootstrap，loadsh，jquery），但是我们又不怎么需要修改他们，就可以用 DLLPlugin 打包了。

新建 webpack-dll.config.js 文件，代码如下

```javascript
const path = require('path')
const webpack = require('webpack')
// 文件处理器
const modules = require('./config/modules')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// 解决css压缩
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
module.exports = {
    // 入口配置
    entry: {
        comment: ['jquery', './vendor/css/comment.css'],
    },
    // 出口文件
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name].js',
        library: '[name]'
    },
    // module.rules
    // loaders
    module: modules,
    // 插件
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, './manifest.json'),
            name: '[name]',
            context: __dirname,
        }),
        // 向全局暴露第三方库
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.$': 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('css/[name].css'),
        new OptimizeCssnanoPlugin({
            // sourceMap: nextSourceMap,
            cssnanoOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true,
                    },
                }],
            },
        })
    ],
}
```

这里是不是发现模块化的好处了，我们可以调用之前写好的模块配置，既节省了代码，也方便修改

再 package.json 配置一下我们的启动命令，

```javascript
{
    ...
    "srcipt": {
        ...
        "dll": "webpack --progress --colors --config ./webpack-dll.config.js --mode production",
        ...
    }
    ...
}
```

运行 npm run dll 这样就会生成 manifest.json 文件了，也就是我们webpack动态依赖库

配置了我们的动态依赖库之后，我们也需要在我们webpack.config.js中引入我们的依赖库，这里我们在config/plugins.js中修改即可

```javascript
const plugins = [
    new webpack.DllReferencePlugin({
        context: staticRootDir,
        manifest: require('../manifest.json'),
        name: 'comment',
    })
]
```

### webpack-dll.config.js存在的问题

虽然说 DllPlugin 的东西是不常修改的，但是如果我们就是要修改呢，那就需要删除我们的动态库，重新生成一份

手动删除是在不符合我这种懒人，这时候我们就需要使用出我们强大的node啦，新建一个 delete.js 文件

```javascript
const fs = require('fs')
// 通过child_process的exex执行命令行命令
const { exec } = require('child_process')
fs.unlink('./manifest.json', (err) => {
    console.log('成功删除 manifest.json');
    // 删除后重新npm run dll
    exec(`npm run dll`, (error, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
    })
});
```

这样就实现了我们删除 manifest.json 后，自动执行dll了

# 总结

> [项目传送门](https://gitee.com/gating/webpack-pages/)

学到这里，我想已经大概已经怎么使用webpack多页面了，当然，其实还有好多依然讲的很基础，但是我相信，一步一步来，遇到坑填坑，总会学习到更多东西的。

本篇webpack多页面入门文章到此结束 O(∩_∩)O~

最后，感谢各位观众老爷观看