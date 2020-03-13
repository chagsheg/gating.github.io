---
layout: post
title: 解析url字符串
tags: javascript
category: 记录
description: 对前端同学来说，有时候可能会碰到一种比较麻烦的情况，那就是url的解析问题。说起来也不难，就是比较麻烦。很经常我们都是用正则来匹配我们的字符串来匹配我们url的参数，在这里我发现了a标签也有一些特定的属性，来获取我们所需的参数。
date: 2018/04/26
---

对前端同学来说，有时候可能会碰到一种比较麻烦的情况，那就是url的解析问题。说起来也不难，就是比较麻烦。

很经常我们都是用正则来匹配我们的字符串来匹配我们url的参数，在这里我发现了a标签也有一些特定的属性，来获取我们所需的参数。

接下来，我们来实现一波：

 ```javascript
    /**
     * 解析url字符串，返回一个json
     * @param {String} url 
     */
    function parseUrl(url) {
        let a = document.createElement('a');
        a.href = url;
        let search = a.search.split('&');
        search[0] = search[0].replace('?', '')
        let query = {};
        for (let i = 0; i < search.length; i++) {
            query[search[i].match(/(.+)=/, '$1')[1]] = search[i].match(/=(.+)/, '$1')[1]
        }
        const urlObj = {
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            query: query,
            hash: a.hash.replace('#', '')
        }
        a.remove();
        return urlObj;
    }
```   

如果，我们只是需要简单获取字符串指定key的值的话，上面的方法是不是太麻烦了呢？

其实也是，所以我们可以针对具体业务来改进我们的代码。

```javascript
    /**
     * 解析url字符串，返回查询参数指定字段的值
     * @param {String} url 
     * @param {String} key 
     */
    function queryKey(url,key){
        let a = document.createElement('a');
        a.href = url;
        var result = a.search.match(new RegExp(key+"=[^\?\&]+","g"));
        var value = result?result[0].split('=')[1]:'';
        a.remove();
        return value;
    }
```

以上就是今天的内容啦，谢谢各位观众老爷的观看
