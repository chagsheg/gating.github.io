---
layout: post
title: docker-compose mysql和node连接认证mongo问题
tags: javascript
category: 记录
description: 最近，想部署一个自己的项目，鉴于自己的服务器是VPS(虚拟主机)，配置也不够，就想到了用 docker 直接部署好了，这样既方便部署也方便不用的时候卸载或更新
date: 2019/12/30
---

# 前言

最近，想部署一个自己的项目，鉴于自己的服务器是VPS(虚拟主机)，配置也不够，就想到了用 `docker` 直接部署好了，这样既方便部署也方便不用的时候卸载或更新

然后本地搭建了环境，踩了一些坑，在这里记录一下

# mysql 问题（初始化创建数据库不成功）

首先我是使用 `docker-compose` 来搭建我的服务的，配置如下：

```yml
mysql:
    image: mysql:5.5
    restart: always
    # 构建容器
    build: ./mysql
    environment:
        MYSQL_ROOT_PASSWORD: 123456
        TZ: Asia/Shanghai
    volumes:
        - ./mysql/db:/var/lib/mysql
    ports:
        - 3306:3306
```

所以第一次运行 `docker-compose up` 的时候没有加上密码(`MYSQL_ROOT_PASSWORD`配置)，然后出于安全起见，我配置了root密码，然后关闭后，执行 `docker-compose up`，发现 `mysql` 容器的数据库并没有创建

查了下资料：[https://github.com/docker-library/mariadb/issues/68](https://github.com/docker-library/mariadb/issues/68)

挂载的宿主主机的文件夹必须为空文件夹(.gitignore等隐藏文件不影响)，如果里面有文件，就不会初始化数据库。

> ps: `mongo` 创建不成功也可参考如上解决方法


# node连接认证mongo问题

首先我的 `docker-compose.yml` 配置文件如下：

```yml
mongo:
    image: mongo
    restart: always
    environment:
    MONGO_INITDB_ROOT_USERNAME: gating
    MONGO_INITDB_ROOT_PASSWORD: 123456
    TZ: Asia/Shanghai
    # 需要链接本地代码时
    volumes:
    - ./mongo/db:/data/db
    ports:
    - 27017:27017
```

我尝试了通过文档的认证连接,代码如下：

```js
mongoose.connect('mongodb://user:pass@mongo/database');
```
> ps: 这里能用 `mongo` 是因为我在 `docker-compose` 中指定了 `mongo` 容器的名字，在代码里使用 `mongo` 就表示 `localhost:27017`

连接失败，最后才发现是我缺少了一个配置 authSource，然后配置上了，最后终于连接上了我的mongo，可以愉快的开发部署了

```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://gating:123456@mongo/small_time?authSource=admin')
```