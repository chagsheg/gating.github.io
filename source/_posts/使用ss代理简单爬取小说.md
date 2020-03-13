---
layout: post
title: 使用ss代理简单爬取小说
tags: node
category: 爬虫
description: 前不久，我的腐女女朋友叫我找一本耽美的小说，我在网盘搜索引擎没有找到就 Google 了一下，发现一个网站有，然后就想着写个爬虫爬给女朋友了（狗头保命），但是发现本地运行的 terminal 并不会走 SS ，需要 node 本身发送请求去实现自身的代理...也就有了下面这个小教程
date: 2019/11/16
---

# 前言

前不久，我的腐女女朋友叫我找一本耽美的小说，我在网盘搜索引擎没有找到就 `Google` 了一下，发现一个网站有，然后就想着写个爬虫爬给女朋友了（狗头保命），但是发现本地运行的 `terminal` 并不会走 `SS` ，需要 `node` 本身发送请求去实现自身的代理...也就有了下面这个小教程

> ps: 好像也好久没写博客了，就偷偷写一下

# 初始化我们的项目

- 新建一个文件夹，取名叫做 `my-crawler`
- 通过控制台或者git bash定位到当前文件下面，执行命令: `npm init -y`

# 安装项目依赖

执行命令: `npm install iconv-lite request request-promise socks5-http-client -S`

> ps: npm 可以省略 `-S`，他会默认执行 `-S` 命令，cnpm 则需要加上 `-S`

## socks5-http-client

> ps: 该客户端仅支持发出HTTP请求。有关HTTPS实施，请参见socks5-https-client。

# fs模块的简单使用

fs是`FileSystem(文件系统)`的缩写，该模块提供本地文件的读写能力，基本上是`POSIX(可移植操作系统接口)`文件操作命令的简单包装。但是，这个模块几乎对所有操作提供异步和同步两种操作方式，供开发者选择。

这里为了方便使用，我们使用同步操作，也更符合我们整个开发流程。

这个项目我们使用到了 `appendFileSync` 这个api，接下来我们简单介绍一下他的作用和使用

## appendFileSync

- 在 `my-crawler` 目录下新建一个 `demo.js`,代码如下:

```javascript
const fs = require('fs')
// 通过同步的方式将文本内容或数据添加到文件里，文件不存在则自动创建。
fs.appendFileSync('./demo.txt','123465')
```

看完上面的代码，是不是发现 appendFileSync 很简单呢？好了，马上进入我们的正题了

# 实现爬虫代码

首先，我们打开 `http://wap.danwenku.com/qita/`,然后查看源代码你会发现，他是 `gb2312` 编码的，正常的 `request` 请求爬下来的东西是乱码的，所以我们安装了 `iconv-lite` 解决乱码问题

然后通过 `cheerio` 来解析 `DOM`,和 `JQ` 一样的语法，不用担心不会


## 反爬

当我们准备好这一切之后，发现请求我们需要爬取的网站之后返回了 `503`，但是我们通过浏览器访问却没有问题，这是为什么呢？其实，这就是网站禁止我们爬取他的内容，这就需要通过反爬机制去解决这个问题。

而设置 `headers` 就是解决 `requests` 请求反爬的最简单的一个方法。

> 相当于告诉对方服务器，我们是使用浏览器访问网站

> 注意：headers中有很多内容，主要常用的就是user-agent 和 host，如果使用这两个就可以反爬成功，就不需要其他键对；否则，需要加入更多键对形式。

比如我这里，就加入了 `Cookie` 这个键值对

以下是我们这个简单的爬虫代码实现

```javascript
!(async () => {
    // fs模块，用来写入文件
    const fs = require('fs')
    // 用来解析DOM
    const cheerio = require('cheerio')
    const iconv = require('iconv-lite')
    // 解决网页编码问题
    const request = require('request-promise')
    // 解决ss代理
    const Agent = require('socks5-http-client/lib/Agent')
    // 需要爬取的url前缀
    let urlPrefix = `http://wap.danwenku.com/qita/`
    for (let i = 1; i < 65; i++) {
        let url = ``
        // 通过查看第n页可发现，第一页是54999.html 第n页是54999_n.html
        // 即爬取的url就是urlPrefix + 54999_n.html
        if (i === 1) {
            url = `54999.html`
        } else {
            url = `54999_${i}.html`
        }
        const request_option = {
            url: urlPrefix + url,
            // 使用本地代理
            agentClass: Agent,
            // 本地代理配置
            agentOptions: {
                socksHost: '127.0.0.1', // 默认localhost
                socksPort: 1080 // 默认1080
            },
            // 取消设置响应编码，返回二进制数据
            encoding: null,
            // 对响应的二进制数据重新进行编码，转换成cheerio对象
            transform: function (body) {
                body = iconv.decode(Buffer.from(body), 'GBK')
                return cheerio.load(body);
            },
            // 设置请求头，模拟成浏览器取访问网站（最简单反爬方式了）
            headers: {
                "Cookie": `__cfduid=d4d6dff36f6804fbdbb185f1de7cddd581573185661; cf_clearance=d530634f94552a4f8f52966366988dc9f351952c-1573185666-0-150; ZDEDebuggerPresent=php,phtml,php3; UM_distinctid=16e492c5744342-05e7814449385d-7711b3e-1fa400-16e492c574535f; CNZZDATA1252964692=315770227-1573184262-null%7C1573184262`,
                "Host": "wap.danwenku.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
            },
        }
        // 等待请求返回，这里没有做错误处理，因为只是个简单的小栗子，没有必要做错误处理
        const $ = await request(request_option)
        let chapterTxt = `第${i}章\r\n`
        // 打印下现在正在爬取多少章
        console.log(chapterTxt)
        $('.css-pc css-site,.sxwenzhang,.pagela,.pagination').remove()
        // 写入到文件中，如果中断应该则通过 `正在爬取多少章` 可知i的值，重新设置i值就好了
        fs.appendFileSync('./二进制.txt', chapterTxt + $(`div.single-content`).text() + '\r\n')
    }
})()
```

最后，感谢各位观众老爷观看吖  O(∩_∩)O~