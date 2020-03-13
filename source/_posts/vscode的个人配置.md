---
layout: post
title: vscode的个人配置
tags: vscode
category: 编辑器
password: 123456
description: 此篇只是为了记录自己vscode的设置，防止以后配置丢失，无实际意义
date: 2018/05/09
---

# 前言

此篇只是为了记录自己vscode的设置，防止以后配置丢失，无实际意义

```json
{
    "files.autoSave": "afterDelay",
    "editor.formatOnPaste": true,
    "editor.formatOnType": true,
    "editor.formatOnSave": true,
    "fileheader.Author": "gating",
    "fileheader.LastModifiedBy": "gating",
    "explorer.confirmDelete": false,
    "vetur.validation.template": false,
    "git.enableSmartCommit": true,
    "emmet.triggerExpansionOnTab": true,
    "emmet.includeLanguages": {
        "vue-html": "html",
        "vue": "html"
    },
    "workbench.activityBar.visible": true,
    "files.associations": {
        "*.wxss": "css",
        "*.html": "html"
    },
    "window.menuBarVisibility": "default",
    "window.zoomLevel": 0,
    "editor.minimap.enabled": true,
    "python.linting.flake8Enabled": true,
    "python.formatting.provider": "yapf",
    "guides.enabled": false,
    "editor.renderWhitespace": "none",
    "editor.renderControlCharacters": false,
    "git.autofetch": true,
    "workbench.statusBar.visible": true,
    "terminal.integrated.shell.windows": "C:\\windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "git.confirmSync": false,
    "px2rem.rootFontSize": 75,
    "px2rem.isNeedNotes": false,
    "workbench.settings.useSplitJSON": true,
    "workbench.settings.editor": "json",
    "javascript.updateImportsOnFileMove.enabled": "always",
    "sync.gist": "023ae35a68a66e3b5e122045f4c94d0e",
    "vetur.format.defaultFormatter.html": "prettier",
    "workbench.colorTheme": "Dracula",
    "html-css-class-completion.includeGlobPattern": "**/*.{css,html,vue,jsx}",
    "vetur.format.options.tabSize": 4,
    "[jsonc]": {
        "editor.defaultFormatter": "HookyQR.beautify"
    },
    "workbench.iconTheme": "vscode-icons"
}

```