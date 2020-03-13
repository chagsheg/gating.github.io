---
layout: post
title: vscode插件整理
tags: vscode
category: 编辑器
description: 在这编辑器横行的时代,选择一个称手的编辑器,能使得自己码代码的效率得到一个质的提升，对比了atom、bracket、webStorm、vscode、sublime等编辑器。最终，我停留在了vscode上。
date: 2018/03/30
---

# 前言

在这编辑器横行的时代,选择一个称手的编辑器,能使得自己码代码的效率得到一个质的提升，对比了atom、bracket、webStorm、vscode、sublime等编辑器。最终，我停留在了vscode上。

# 为什么选择vscode呢？

1. 开源，免费，颜值高；
2. 对js的支持十分良好
3. 对比于ws，ws又太大，sublime智能感知又太差，所以我选择折中的vsc
4. 默认支持git
5. 很多使用的拓展插件

# 插件推荐

Auto Close Tag 自动闭合标签

Auto Rename Tag 自动重命名标签 => 有bug，但不影响使用

Beautify  => 格式化代码

Bootstrap 3 Snippets => Bootstrap3代码片段

Bracket Pair Colorize => 各种括号的颜色

Dracula Official => vscode主题

filesize => 文件大小

HTML CSS Support => Html css语法支持

HTML Snippets => Html代码片段

IntelliSense for Css class names in HTML => 可以引用文件的class

JQuery Code Snippets => JQuery代码片段

npm Intellisense => npm智能感知

Path Intellisense => 路径智能感知

View In Browser => 从浏览器打开

vscode-fileheader => 文件的头信息

vscode-icons => vscode图标

Vetur => vue的语法高亮和代码片段

Vue 2 Snippets => vue2的代码片段

Guides => 显示缩进(主要用来玩python)

Python => vscode的python拓展

Python-vscode => pythone的语言包

px2rem => 用来把px转换为rem的（主要搭配fleible.js）

---

# 使用vscode小tips

在js文件中使用jq提示:

在当前文件夹根目录新建jsconfig.json文件,写上:

```json
{
    "typeAcquisition": {
        "include": [
            "jquery"
        ]
    }
}
```

配置文件代码风格：

在当前文件夹根目录新建.editorconfig文件：

参考资料: [https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties)
    
```
    # top-most EditorConfig file
    root = true

    # 对所有文件生效
    [*]
    # 文件的字符编码
    charset = utf-8
    # 缩进的格式 space(空格)
    indent_style = space
    # 缩进的数量2个
    indent_size = 2
    # 换行符格式
    end_of_line = lf
    # 是否在文件的最后插入一个空行
    insert_final_newline = true
    # 是否删除行尾的空格
    trim_trailing_whitespace = true
```

最后，感谢各位观众老爷的观看
