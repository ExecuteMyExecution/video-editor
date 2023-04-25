# video-editor

## 介绍

本项目是一个在线视频编辑器，可实现对上传视频进行裁剪的功能，最后导出相应的数据给后端。

## 在线体验

https://executemyexecution.github.io/

## 快速上手

打开上面的网址，可以看到以下页面

![image](https://yijuan.xyz//test/GitHubPicture/home.png)

按照要求上传视频后，进入编辑页面

![image](https://yijuan.xyz//test/GitHubPicture/editor.png)

其中的①②③区域分别是菜单栏、视频和效果演示区以及元素编辑区

### 插入字幕

点击菜单栏中的“设置字幕”按钮，在底部编辑区点击“添加”，弹出参数设置对话框，如下

![image](https://yijuan.xyz//test/GitHubPicture/c1.png)

标红的是必填参数，应符合以下规范：

- 起始、结束时间：数字
- 字幕位置：形如'100,100'，分别是x和y参数
- 字体大小：应带上单位

可以自己输入参数，也可以点击“选择插入”按钮，即可在展示区插入文本，效果如下

![image](https://yijuan.xyz//test/GitHubPicture/c2.png)

顶部按钮从左至右依次是：字体颜色，字号大小，设置起始、结束时间（可拖动左侧视频选择时间）

点击“确认”后可以看到底部有了记录，展示区也插入了字幕

![image](https://yijuan.xyz//test/GitHubPicture/c3.png)

### 插入图片

同理，点击菜单栏中的“设置贴图”按钮，在底部编辑区点击“添加”，弹出参数设置对话框，如下

![image](https://yijuan.xyz//test/GitHubPicture/i1.png)

标红的是必填参数，应符合以下规范：

- 起始、结束时间：数字
- 字幕位置：形如'100,100'，分别是x和y参数
- 图片大小：形如'200,200'，分别是width和height参数
- 字体大小：0-360，不需要带单位（默认是deg）
- 选取贴图：输入需要插入图片的url，或者点击下方的上传按钮，点击上传图标即可获取上传到服务器的地址

可以自己输入参数，也可以点击“调整参数”按钮，即可在展示区调整图片参数（需要先获取图片url），效果如下

![image](https://yijuan.xyz//test/GitHubPicture/i2.png)

顶部按钮从左至右依次是：旋转角度，设置起始、结束时间（可拖动左侧视频选择时间）

点击“确认”后可以看到底部有了记录，展示区也插入了图片

![image](https://yijuan.xyz//test/GitHubPicture/i3.png)

### 效果演示

![image](https://yijuan.xyz//test/GitHubPicture/show.gif)

### 导出视频

点击“导出视频”按钮，即可看到需要传给后端的参数，如下

![image](https://yijuan.xyz//test/GitHubPicture/export.png)
