---
layout: post
title: Windows10开启Ubuntu子系统并搭建Docker环境
tags: javascript
category: 记录
description: 很早就听说微软有个基于Ubuntu的子系统，一直也没机会尝试一下，之前也只是用VMware安装，但是还要单独安装软件，安装镜像，一点都不fit，所以就瞎折腾下（也是因为最近有空）。
date: 2020/02/25
---

# 前言

很早就听说微软有个基于`Ubuntu`的子系统，一直也没机会尝试一下，之前也只是用`VMware`安装，但是还要单独安装软件，安装镜像，一点都不fit，所以就瞎折腾下（也是因为最近有空）。

# 搭建Ubuntu子系统

## wsl是什么

适用于 Linux 的 Windows 子系统（英语：Windows Subsystem for Linux，简称WSL）是一个为在Windows 10和Windows Server 2019上能够原生运行Linux二进制可执行文件（ELF格式）的兼容层。

简单的说，就是在`window`上安装了个`Linux`

## 安装wsl

1. 开启开发者模式

    依次打开 设置 -> 更新和安全 -> 开发者选项 -> 开发人员模式

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl01.jpg)

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl02.jpg)

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl03.jpg)



2. 开启windows子系统功能

    依次打开 控制面板 -> 程序 -> 启用或关闭Windows功能 -> 启用Windows子系统

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl04.jpg)

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl05.jpg)

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl06.jpg)
    

3. 更新Windows，重启

4. 在Microsoft Store中搜索Ubuntu，并安装，如图：
    
    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl07.jpg)

    安装完后，默认是个终端，如下：

    ![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl08.jpg)

## 进入wsl

打开`PowerShell`，输入指令`bash`即可进入wsl子系统。默认是`root`账户，无密码。

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl09.jpg)




# Docker环境搭建

由于`Ubuntu`默认的源下载速度异常缓慢，所以我们需要替换成国内阿里云的镜像源。

## 确认默认源

```shell
vim /etc/apt/sources.list
```

## 修改默认源

1. 备份默认源

    ```shell
    sudo cp /etc/apt/sources.list /etc/apt/sources.list.20200225
    ```

2. 然后 VIM 打开，替换

    ```shell
    sudo vim /etc/apt/sources.list
    
    %s/security.ubuntu/mirrors.aliyun/g
    %s/archive.ubuntu/mirrors.aliyun/g
    ```

## 更新源

    ```
    sudo apt-get update
    ```

## 安装Docker

因为都知道的网络原因,安装时可能会timeout等其他情况,所以推荐强烈建议使用国内源，执行以下命令

* `sudo apt-get remove docker docker-engine docker.io`
* `sudo apt-get update`
* `sudo apt-get install \ apt-transport-https \ ca-certificates \ curl \ software-properties-common`
* `curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -`
* ` sudo add-apt-repository \
    "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu \
    $(lsb_release -cs) \
    stable"`
* `sudo apt-get update`
* `sudo apt-get install docker-ce=18.06.1~ce~3-0~ubuntu`


> ps: 安装高版本的`docker`好像都会挂,所以我们安装到18.06.1的


一顿操作之后，`docker`已经安装完成, 使用 `docker version` 可以查看详细的版本信息，如图：

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl10.jpg)


**随后再以管理员启动WSL控制台，执行：**

```shell
sudo cgroupfs-mount
sudo service docker start
```

测试安装结果如下：

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl11.jpg)


## 测试 Docker 是否安装正确

最后，当然要测试一下，我们安装的docker 是否争取啦

但是国内从 `Docker Hub` 拉取镜像有时会遇到困难，所以我们需要配置镜像加速器。所以，我们需要在`/etc/docker/daemon.json`中写入如下内容（如果文件不存在请新建该文件）

```
sudo vi /etc/docker/daemon.json
```

内容如下：

```json
{
  "registry-mirrors": [
    "https://dockerhub.azk8s.cn",
    "https://hub-mirror.c.163.com"
  ],
  "iptables":false
}
```

执行 `docker run hello-world`，如果输出下列信息，那么恭喜你，docker终于搭建完成啦，可以愉快的玩耍了

![](https://cdn.JsDelivr.net/gh/GATING/blog_imgs/2020-02-25/wsl12.jpg)


### docker批量删除容器、镜像

1. 删除所有容器
    ```shell
    docker rm `docker ps -a -q`
    ```
2. 删除所有镜像
    ```shell
    docker rmi `docker images -q`
    ```

# 参考链接

[Docker 从入门到实践](https://vuepress.mirror.docker-practice.com/install/ubuntu.html#%E5%87%86%E5%A4%87%E5%B7%A5%E4%BD%9C)

[WSL中安装Docker](https://zhuanlan.zhihu.com/p/39187620)

[Windows 10 的Linux子系统WSL下安装docker](https://blog.csdn.net/weixin_42971644/article/details/99870601)

# 最后

还真是闲的蛋疼，瞎折腾了挺久的= =，不过最后好在弄好了，也希望各位搭建环境的时候少点坑，感谢各位观众老爷的观看

> ps: 最后还是发现`wsl`兼容性一般啊，居然不能运行`moongo`...