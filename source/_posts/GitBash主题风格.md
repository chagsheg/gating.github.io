---
layout: post
title: Git Bash主题风格
tags: Shell
category: 记录
description: 其实很多人都知道，window下的CMD非常不好用，远没有Linux或者一些SSH工具用起来方便。这里我使用的是Git Bash,然而默认的Git Bash的样式不是那么的好看，这里我们修改一下他的样式
date: 2018/11/01
---

# 前言

其实很多人都知道，window下的CMD非常不好用，远没有Linux或者一些SSH工具用起来方便。

这里我使用的是Git Bash,然而默认的Git Bash的样式不是那么的好看，这里我们修改一下他的样式

# 自定义主题样式

在git bash窗口点击右键，选择option选项。然后save一下- -之后会在 <font color="#f60">C:\Users\gating(用户名)</font> 会生成一个.minttyrc文件， 也就是你的主题文件

这样子我们就可以根据这个主题文件修改我们的Git Bash主题了，我这里直接贴出我的配置，供参考

```
Locale=zh_CN
Charset=UTF-8
Columns=160
Rows=45
Font=Monaco
FontHeight=11
Term=xterm-256color
CursorType=block
CursorBlinks=yes
Transparency=low
BoldAsFont=yes
AllowBlinking=no
Scrollbar=none
ScrollbackLines=10000
ClickTargetMod=off
ComposeKey=shift
ForegroundColour=248,248,242
BackgroundColour=39,40,34
CursorColour=255,255,255
Black=39,40,34
BoldBlack=117,113,94
Red=249,38,114
BoldRed=204,6,78
Green=166,226,46
BoldGreen=122,172,24
Yellow=255,255,81
BoldYellow=240,169,69
Blue=144,255,255
BoldBlue=33,199,233
Magenta=174,129,255
BoldMagenta=126,51,255
Cyan=161,239,228
BoldCyan=95,227,210
White=248,248,242
BoldWhite=249,248,245
```

此时，重启Git Bash,你会发现主题配置已经生效！！

最后，感谢各位观众老爷观看