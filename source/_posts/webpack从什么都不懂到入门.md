---
layout: post
title: webpack从什么都不懂到入门
tags: webpack
category: 记录
description: 这篇文章是自己在整理webpack相关的东西时候突发奇想，想总结自己所学知识，也希望能够帮助想学习webpack的同学们，都是入门级别的，大佬请出门右转。
date: 2018/06/15
---

# 前言

这篇文章是自己在整理webpack相关的东西时候突发奇想，想总结自己所学知识，也希望能够帮助想学习webpack的同学们，都是入门级别的，大佬请出门右转。

> 本文的webpack基于webpack4.0，具体是4.12.0版本

# 初识webpack

webpack是什么？借助官网的话来说，webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。

> 简单的来说，webpack是一个打包工具

## webpack的基本配置项

作为入门，我们只需要明白几个核心概念：

* Entry(入口)
* Output(出口)
* Loaders
* Plugins(插件)
* Mode(模式)

### Entry

入口起点指示 webpack 应该使用哪个模块，来作为构建其内部依赖图的开始。进入入口起点后，webpack 会找出有哪些模块和库是入口起点（直接和间接）依赖的。

```javascript
// webpack.config.js
module.exports={
	// 入口配置
	entry:{
		index:'./src/index.js'
    }
}
```

### Output

output 属性告诉 webpack 在哪里输出它所创建的 bundles，以及如何命名这些文件，默认值为 ./dist。

```javascript
module.exports={
	// 出口配置
	output:{
		// 必须是绝对路径
		path:path.resolve(__dirname,'dist'),
		filename:'js/bundle.js'
	}
}
```

### Loaders

首先，webpack 自身只理解 JavaScrip，所以针对其他的文件，我们需要借助 loader 去处理。

loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

比如对于css文件，我们可以这样写：

```javascript
module.exports = {
    module: {
        rules: [{
			// 通过正则匹配要处理的文件
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    }
}
```

### Plugins

loader 被用于转换某些类型的模块，而Plugins(插件)则可以用于执行范围更广的任务。

### Mode

通过选择 development 或 production 之中的一个，来设置 mode 参数，你可以启用相应模式下的 webpack 内置的优化

# webpack初体验

通过上面基础概念的学习，我们开始动手写个小demo吧

安装使用webpack的方式有两种，一种是全局安装webpack，一种是在我们的项目中安装webpcak依赖，然后通过npm执行webpack命令。

> 通常建议用第二种方式安装，因为前端更新太过快捷，很多人的webpack版本和你的可能不太一样，导致出现一些问题

1、初始化我们的项目

- 新建一个文件夹，取名叫做webpack-demo
- 通过控制台或者git bash定位到当前文件下面，执行命令: npm init -y

2、项目结构搭建

- 新建src目录,用于放置我们的开发所需要的css、img、js和html文件(和平时开发一致就好)

- 在根目录新建index.html

- 在根目录新建webpack.config.js,这是webpack的默认配置文件

> ps: webpack默认会读取webpack.config.js 中的相关配置，如果更换其他名字，webpack默是找不到的（当然我们也可以去指定webpack读取的配置文件，但在现阶段，我们暂不考虑）


> index.html的格式如下：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <!-- 我们给最终编译出的js叫做bundle.js-->
    <script src="./dist/js/bundle.js"></script>
</body>
</html>
```

## 安装 webpack 和 webpack-cli

在当前目录(webpackDemo)执行命令: npm install webpack webpack-cli --save

> 为什么要装 webpack-cli ,是因为以前webpack的cli工具移动到了一个专门的包(webpack-cli)里了

接下来我们配置下package.json，把"scripts"字段修改为：

```json
"scripts": {
    "build": "webpack --mode development"
}
```

## 新建入口文件和配置webpack.config.js

1、在src/js目录下新建index.js文件，作为webpack的入口文件，文件内容为：

```javascript
console.log("hello world")
```
2、接下来我们打开 webpack.config.js ，配置下我们的编译规则

```javascript
const path = require('path')
module.exports={
	// 入口配置
	entry:{
		index:'./src/js/index.js'
	},
	// 出口文件
	output:{
		// 必须是绝对路劲
		path:path.resolve(__dirname,'dist'),
		filename:'js/bundle.js'
	},
}
```

> __dirname是node暴露给全局的一个变量,表示当前文件所在的目录,path模块是node自带的模块，用来处理路径的

3、在webpack-demo目录下执行npm run build命令

此时查看dist/js目录，会发现新增了一个bundle.js的文件，然后打开index.html文件，在f12打开控制台，是不是输出了hello world啊？

> 好了，本次教程到此结束了

 看到这里，是不是很像拍死我了，输出hello world还这么麻烦，而且还什么都没学到，浪费我青春啊！！！骚年，开个玩笑嘛，别着急，有话好好说啊，接下来重头戏开始了。


## 针对css文件和img文件的Loaders

通过上面的小例子，发现好像少了些什么，一个页面不可以只有js的吧，我们强大的css和好看的img呢？

接下来我们就开始学习强大的Loaders啦

### 安装style-loader、css-loader 和 url-loader、file-loader

执行命令: npm install style-loader css-loader url-loader file-loader --save

这里特别说明下，file-loader与url-loader都是在webpack中引入图片的解决方案，但是与file-loader不同，url-loader封装了file-loader，并且可以在图片大小小于设定的limit的时候返回的是一个bDataURL（base64码），大于limit时会调用file-loader对图片进行处理。

### 添加webpack规则

在webpack.config.js添加规则

```javascript
module: {
	rules: [{
			test: /\.css$/,
			// 从右向左(从下向上)开始执行
			use: ['style-loader', 'css-loader'],
		},
		{
			test: /\.(png|jpg|gif)$/,
			use: [{
				loader: 'url-loader',
				options: {
					// 小于10kb转成base64
					limit: 10240,
					// 打包后的文件夹
					outputPath: 'img'
				}
			}]
		}
	]
}
```

添加规则之后，我们在src/css目录下新建index.css，在src/img目录下放一个img.jpg后，接下来就是修改我们的代码了

> index.css文件如下

```css
body {
    background: skyblue;
}
```

> 修改我们的入口文件index.js

```javascript
import '../css/index.css'
import imgSrc from "../img/img.jpg"
const img = document.createElement('img')
img.src = './dist/' + imgSrc
document.body.appendChild(img)
console.log("hello world")
```

在运行一下npm run build，然后打开我们的浏览器，页面是不是有了个蓝色背景和一张图片呢？
这感觉是不是美滋滋

> 题外话，这里我们用了es6，浏览器也没有报错，因为现在新版浏览器对es6兼容相当不错了，可是对于旧版本，浏览器兼容还是不是很好的

所以我们针对我们写的js也需要做下babel编译

1、安装babel

执行命令: npm install babel-core babel-loader babel-preset-env --save

2、新建.babelrc文件

这里babel会默认读取根目录下的.babelrc文件作为babel的编译规则

```javascript
{
  "presets": [
    ["env", {
      "modules": false
    }]
  ]
}
```

3、配置js的loader规则

增加loader的配置项：

```javascript
module.exports={
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader'],
				// 除node_modules目录外，其他都用babel编译
				exclude: /node_modules/
			}
		]
	}
}
```

4、拓展下我们的output规则

现在我们细心的看一下，你会发现我的output的文件名使我们定死的，每次打包，名字都不会改变，我们怎么可以根据他的文件名生成同样的名字呢？webpack提供提议[name]的占位符，
表示入口的的文件名。

修改下webpack.config.js:

```javascript
output: {
	// 必须是绝对路劲
	path: path.resolve(__dirname, 'dist'),
	filename: 'js/[name].js'
}
```

那么问题又来了，我们怎么引入我们动态生成的[name].js呢？也许有人说改成和入口文件一样的名字不就行了吗？这样的确是一种方案，但是能不能可以通过一个模板，自动注入我们生成的js文件呢？接下来就是用我们更强大的插件啦

## 常用的插件

### html-webpack-plugin

针对于上面的问题，我们就可以借助html-webpack-plugin自动生成我们的html啦。

1、安装html-webpack-plugin

肯定要先安装啦，不然怎么用╭(╯^╰)╮：npm install html-webpack-plugin --save

2、创建我们的模板页面

在src目录下新建index.html，用于我们的模板页面，代码如下：

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
</body>
</html>
```

3、配置webpack.config.js规则

增加plugins的配置项：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
	plugins:[
		// 生成多个页面需要调用多次new HtmlWebpackPlugin() 多页面的配置
		new HtmlWebpackPlugin({
			// 生成多个页面,filename作为标识
			filename:'index.html',
			// 多页面引入自己的js
			// chunks:['index'],
			// 自定义模板标题
			// 模板页title定义为 <%= htmlWebpackPlugin.options.title %>
			// 必须这么写htmlWebpackPlugin
			title:'hello world',
			// 模板
			template:'./src/index.html',
			// 生成的文件消除缓存
			hash:true,
			// 压缩输出
			minify:{
				// 删除空白字符(折叠空白区域)
				collapseWhitespace:true,
				// 删除属性的双引号
				// removeAttributeQuotes:true
			}
		})
	]
}
```

这样我们就可以直接打开dist的index.html文件就好，不需要根目录下的index.html文件了

打开index.html文件后，你会发现图片404，并且多了一些文件，我们先解决我们图片404的问题，因为我们的index.html所在目录目录发生了改变，所以js也需要跟着改变一下

```javascript
import '../css/index.css'
import imgSrc from "../img/img.jpg"
const img = document.createElement('img')
// 更改
img.src = imgSrc
document.body.appendChild(img)
console.log("hello world")
```

> ps:目前只考虑单页面的生成

### clean-webpack-plugin

到目前为止，我们学会了动态生成模板页面了，然后怎么清楚我们之前多余的文件呢，这里我们需要借助clean-webpack-plugin插件来删除我们多余的文件

1、安装clean-webpack-plugin

npm install clean-webpack-plugin --save

2、配置webpack.config.js规则

```javascript
// 删除某些东西
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
	plugins:[
		new CleanWebpackPlugin(['dist'])
	]
}
```

这样每次执行我们命令的时候就会先删除dist目录在创建

### copy-webpack-plugin

小知识，针对于一些我们不想修改的静态资源文件，我们可以通过copy-webpack-plugin处理这些静态资源文件

我们在src目录下新建一个asset目录，放置一个1.txt文件，内容为：此例子没有什么大的实际意义╭(╯^╰)╮

插件我们还是需要执行两个步骤的，先安装，在配置

1、安装copy-webpack-plugin

npm install copy-webpack-plugin --save

2、配置webpack.config.js规则

```javascript
// 处理静态资源,静态资源输出
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
	plugins:[
		// 静态资源输出
		new CopyWebpackPlugin([{
			// 初始文件夹
			from:path.resolve(__dirname,'src/asset'),
			// 目标文件夹
			to:'./public'
		}])
	]
}
```

## 服务器运行

到目前为止，我们已经怎么通过模板自动生成页面，自动生成js，可是我们还是发现了一些问题，就是每次更改代码后都需要webpack重新去编译，并且我们的文件还是以文件系统在浏览器打开的，很显然，这不是webpack的正确姿势。

因此，我们考虑怎么让我们的项目运行在服务器端。

### DIY一个临时的静态服务器

既然我们知道了我们最终生成的文件在dist文件夹，那么我们好像只要将dist文件夹的文件在服务器端跑起来不就好了吗？仔细一想，好像很有道理，那么我们尝试一下吧。

> 这里我们用express搭建一个静态的服务器

1、在根目录下新建一个app.js文件，并安装express

npm install express --save

2、在app.js中，我们利用express写一个简单的服务器

```javascript
// app.js
const express = require('express')
const app = express()
app.use("/", express.static(__dirname + "/dist"))
app.listen(3000)
```

3、配置下我们package.json的script字段

为了统一下我们的命令，不在命令行执行node app.js，我们统一用npm执行我们的命令

```json
"scripts": {
	"server": "node app.js",
	"build": "webpack --mode development"
}
```

然后我们可以在控制台执行：npm run server

接下来我们在浏览器输入localhost:3000，是不是可以看到我们打包后的文件了？

> ps:如果控制台输出Error: listen EADDRINUSE :::3000，说明你的端口被占用，修改下app.js的端口号就行


### DIY服务器存在的问题

写完这个，虽然他可以在服务器端运行我们的代码，但是我们还是要重新通过webpack编译，而且还不能实现热更新和自动从浏览器中打开，当然我们也可以通过引入node的child_process模块中的exec来自动打开我们的文件，因为本篇不是node的教程就不拓展了。

### devServer

其实对于这个问题，webpack也早已经想到了，所以他就提供了一个devServer的配置字段，可以配置我们的本地服务器，解决热更新问题。

1、安装webpack-dev-server

npm install webpack-dev-server --save

2、配置webpack.config.js规则

增加一个devServer字段

```javascript
module.exports = {
	// 开发服务器
	devServer:{
		// 设置服务器访问的基本目录
		contentBase:path.resolve(__dirname,'dist'),
		// 设置开发服务器的地址
		host:'localhost',
		// 设置开发服务器的端口
		port:8080,
		// 自动打开浏览器
		open:true,
		// 配置热更新
		hot:true
	}
}
```

3、配置package.json的script字段

```json
"scripts": {
	"server": "node app.js",
	"build": "webpack --mode development",
	"dev": "webpack-dev-server --mode development"
}
```

然后控制台输入：npm run dev的命令后，激动的心扑通扑通的跳，打开浏览器一看，wtf，报了个Uncaught Error: [HMR] Hot Module Replacement is disabled.错误，原来是我们光是在devServer配置hot还不行，需要在plugins调用一下webpack提供的热更新模块

```javascript
// webpack.config.js
const webpack = require('webpack')
module.exports = {
	plugins: [
		// 使用热更新
    	new webpack.HotModuleReplacementPlugin()
	]
}
```

这样我们就可以实现热更新啦，热更新的好处不知道发现没有，<font color="#f60">他只会替换更新的部分,而不会把整个页面给刷新。</font>我们可以尝试修改下index.css，把body的背景修改成红色就可以发现效果了,然后在尝试把hot去掉，在修改body背景色看看，会发现整个页面都刷新了。


## 打包优化

在服务器看到我们的页面没什么问题了之后，我们就可以打包我们的文件啦，打包过后其实我们会发现我们的文件好像有点大，知识在控制台输出一个helloworld还有创建了一个img标签，居然要50kb的代码，简直太大了吧。

接下来我们就要压缩我们的js，其实也很简单，webpack4提供了mode的production属性就是压缩js的，我们通过命令行开启，修改webpack.config.js或者package.json的script就可以了，这里我采用package.json的方式

```json
"scripts": {
	"build": "webpack --mode production"
}
```

这样之后，是不是发现小了很多啊，或许你还会问了，那css不是还在js里面吗，我们能不能单独提取出css呢？答案是肯定的

### 提取css

提取css官方提供了两个方式，一个是extract-text-webpack-plugin，另一个是mini-css-extract-plugin，这里我们采用extract-text-webpack-plugin，原因是extract-text-webpack-plugin提供更多的操作api，相比mini-css-extract-plugin更为的好用。想要使用，我们就需要安装，操作步骤我想大家都已经很清楚了

1、安装extract-text-webpack-plugin

npm install extract-text-webpack-plugin@next --save

> ps: 这里提个醒，一定要安装extract-text-webpack-plugin@next,因为 extract-text-webpack-plugin 最新版本为 3.0.2，这个版本还没有适应 webpack 4 的版本

2、配置webpack.config.js规则

这里，loader的配置也需要修改一下

```javascript
// 提取css
const ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				// 从右向左(从下向上)开始执行
				// 提取css
				use: ExtractTextPlugin.extract({
					// 只在开发环境使用
					// use style-loader in development
					fallback: 'style-loader',
					use: ['css-loader']
				})
			}
       ]
	},
	plugins: [
		// 提取css
		new ExtractTextPlugin({
			filename: 'css/[name].css',
			// 根据不同环境走不同的配置（在开发环境下不使用）
			disable: process.env.NODE_ENV === "development"
		})
	]
}
```

这样不仅css提取出来了，连js也变的小了许多，然后打开css文件发现css文件居然没有压缩- -，然后我们接着配置一下我们的loader，实现对css的压缩，或许你之前听过一个叫cssnano的神器，想用他来压缩，不用担心css-loader是默认把cssnano封装进去了

实际上webpack对于loader的use写法有很多种，我们之前用的是比较简单的一种，不使用任何的配置项，接下来我们配置一下压缩的配置项

> 打开webpack.config.js，修改下loader的代码

<font color="#f60">注意：新版的css-loader已经把minimize参数删除掉，下面请不要使用</font>

```javascript
module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/,
				// 从右向左(从下向上)开始执行
				// 提取css
				use: ExtractTextPlugin.extract({
					// 只在开发环境使用
					// use style-loader in development
					fallback: 'style-loader',
					use: {
						loader:'css-loader',
						options: {
                        	minimize: true //css压缩  
                    	}
					}
				})
			}
	}
}
```

在引申一个问题，我如果想给我的页面加个背景图片也很正常吧，我们尝试着在我们的index.css修改以下代码

```css
body {
    background: url('../img/img.jpg');
}
```

在打包一次，wtf，背景图片怎么不见了，仔细一看css代码，原来是img的路径有问题了，这里我们可以在loader上加多一个配置，解决背景图片的问题

```javascript
 use: ExtractTextPlugin.extract({
	// 只在开发环境使用
	// use style-loader in development
	fallback: 'style-loader',
	use: {
		loader: 'css-loader',
		options: {
			minimize: true //css压缩
		}
	},
	// 解决css打包背景图的路径问题
	publicPath: '../'
})
```

这样配置完，就没有问题了

### 暴露第三方库和提取公共js

#### 暴露第三方库 

很经常的时候，我们的页面不只是只有我们写的js，还可能引入各种各样的库，比如jquery，underscroe这种第三方工具库，我们怎么把它暴露给我们的js呢，其实只需要用到webpack的ProvidePlugin插件

这插件是webpack自带的所以不需要安装，只需要我们修改webpack的配置规则

```javascript
// 向全局暴露第三方库
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
})
```

#### 提取公共js

Webpack3的commonschunk hash问题非常的不雅，使用复杂, Webpack 4 直接将CommonsChunkPlugin 插件直接改为 optimization.splitChunks 和 optimization.runtimeChunk 两个配置

```javascript
module.exports = {
	optimization: {
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
}
```

### img压缩和css优化

目前为止，我们的webpack-demo已经相对完善了，然后其实还有一些优化空间的，比如css能不能自动增加前缀啊，比如我们的img大小好像都没有压缩啊，能不能压缩啊什么的

#### image-webpack-loader

这里我们使用image-webpack-loader进行img的压缩处理

1、安装image-webpack-loader

npm install image-webpack-loader --save

2、修改下loader配置

```javascript
module.exports = {
	module: {
		rules: [{
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

这样就可以压缩我们的img了

#### css优化篇——css自动增加前缀


我们知道在写css的时候由于要兼容不同厂商浏览器，一些比较新的属性需要给它们添加厂商前缀来兼容，移动端还好，一般只需要兼容webkit，pc接很苦逼啦，谷歌、火狐、欧朋、ie每个都不一样，可以说泯灭人性啊。

针对于这个，我们就可以通过webpack来实现帮我们自动给css增加前缀，这里采用最常用的postcss中的Autoprefixer插件来给我们自动增加前缀

##### 题外话，为什么需要浏览器引擎前缀？

1、试验一些还未成为标准的的CSS属性——也许永远不会成为标准

2、对新出现的标准的CSS3属性特征做实验性的实现

3、对CSS3中一些新属性做等效语义的个性实现

##### postcss-loader

聊完了题外话，我开始配置我们的webpack啦。

1、安装postcss-loader和autoprefixer

npm install postcss-loader autoprefixer --save

2、新建postcss.config.js文件

代码如下：

```javascript
module.exports = {
    plugins: [
        // browsers模式选择：
        // 主流浏览器最近2个版本用 last 2 versions 
        // 全球统计有超过1 % 的使用率使用 > 1%
        // 仅新版本用 ff > 20 或 ff>=20 .
        // cascade 是否美化属性值(默认为true)
        require('autoprefixer')({
            browsers: ['last 4 versions', 'IE 10', 'ff > 10'],
            cascade: true
        })
    ]
};
```

3、配置webpack.config.js的规则

```javascript
module.exports = {
	 module: {
        rules: [{
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
        }
    }
}
```

我们修改下index.css的代码，做个body的背景颜色由深到浅的悬浮过度动画

```css
body {
    background: blue;
    transition: all 1s;
}
body:hover{
    background: skyblue;
}
```

运行npm run dev，就可以看到我们的效果啦，并且该加上的前缀也加上了

> 总结：懒人绝对是推动世界发展的主要动力啊

#### css优化篇——去除冗余css代码

1、安装purify-css、purifycss-webpack和glob

npm install purifycss-webpack purify-css glob --save

2、配置webpack.config.js的规则

```javascript
// 删除冗余css代码
const PurifyCssWebpack = require('purifycss-webpack')
// 用于获取指定文件夹下的文件
const glob = require('glob')
module.exports = {
	plugins: [
		// 删除冗余css代码
		new PurifyCssWebpack({
			// purifycss会根据配置的路劲遍历你的HTML文件，查找你使用的CSS
			paths: glob.sync(path.join(__dirname, 'src/*.html')),
			// 压缩css
            minimize: true			
		})
	]
}
```

测试一波，我们在index.css增加一些无用代码,比如

```css
.a{
    background: #000;
}
.b{
    font-size: 30px;
}
```
运行npm run build，再看看打包后的index.css是不没有这两个样式

### 使用less

作为一个称职的前端，怎么能不使用css预编译呢，这里我们使用less，然后通过webpack添加对less的支持

前文已经说了，webpack天生只对js支持，所以我们需要安装loader才能添加对于less的支持

1、安装less-loader

npm install less-loader --save

2、配置webpack.config.js的规则

其实和配置css-loader就类似了，这里就不详细说明了

```javascript
module.exports = {
	module: {
        rules: [{
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
        }]
    }
}
```

# 插件传送门

[webpack英文传送门](https://webpack.js.org/) 英文好的可以看这个

[webpack中文文档传送门](https://webpack.docschina.org/)

1、html-webpack-plugin

[npm传送门](https://www.npmjs.com/package/html-webpack-plugin)

[github传送门](https://github.com/jantimon/html-webpack-plugin)

2、clean-webpack-plugin

[npm传送门](https://www.npmjs.com/package/clean-webpack-plugin)

[github传送门](https://github.com/johnagan/clean-webpack-plugin)

3、copy-webpack-plugin

[npm传送门](https://www.npmjs.com/package/copy-webpack-plugin)

[github传送门](https://github.com/webpack-contrib/copy-webpack-plugin)

4、extract-text-webpack-plugin

[npm传送门](https://www.npmjs.com/package/extract-text-webpack-plugin)

[github传送门](https://github.com/webpack-contrib/extract-text-webpack-plugin)

5、purifycss-webpack

[npm传送门](https://www.npmjs.com/package/purifycss-webpack)

[github传送门](https://github.com/webpack-contrib/purifycss-webpack)

# 总结

> [项目传送门](https://gitee.com/gating/webpack-demo)

学到这里，我想已经大概已经怎么使用webpack了，也算入了个门，对于一些常见的webpack配置也可以看得懂了，一些常用的插件也知道怎么的使用啦

当然，其实还有好多依然讲的不全，很多地方也没有做详细的解释，但是我相信，一步一步来，欲坑填坑，总会学习到更多东西的。

本篇webpack文章到此结束 O(∩_∩)O~

最后，感谢各位观众老爷观看