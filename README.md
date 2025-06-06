# 视频应用 - 基于uni-app的跨平台视频应用

这是一款基于uni-app框架开发的跨平台视频应用，支持视频浏览、播放、上传和用户中心等功能。

## 功能特点

- **视频浏览**：支持分类浏览、搜索视频
- **视频播放**：支持视频播放、点赞、收藏、评论等功能
- **视频上传**：支持选择视频、设置封面、填写信息等功能
- **用户中心**：支持查看个人作品、收藏、历史记录等功能

## 技术栈

- **前端框架**：uni-app + Vue 3 + TypeScript
- **UI设计**：自定义UI，支持暗色主题
- **状态管理**：Vue 3 Composition API
- **样式处理**：SCSS

## 项目结构

```
src/
├── components/       # 组件目录
│   ├── TabBar.vue    # 底部导航栏
│   ├── VideoPlayer.vue # 视频播放器
│   └── Title.vue     # 标题组件
├── pages/            # 页面目录
│   ├── index/        # 首页
│   ├── video/        # 视频详情页
│   ├── add/          # 视频上传页
│   └── about/        # 用户中心页
├── static/           # 静态资源
│   ├── fonts/        # 字体文件
│   ├── styles/       # 样式文件
│   └── images/       # 图片资源
├── App.vue           # 应用入口
├── main.ts           # 主入口
├── manifest.json     # 应用配置
└── pages.json        # 页面配置
```

## 安装和运行

### 环境要求

- Node.js 14.0+
- HBuilderX 3.0+

### 安装依赖

```bash
npm install
```

### 运行项目

```bash
# 运行到H5
npm run dev:h5

# 运行到微信小程序
npm run dev:mp-weixin

# 运行到APP
npm run dev:app
```

### 构建项目

```bash
# 构建H5版本
npm run build:h5

# 构建微信小程序版本
npm run build:mp-weixin

# 构建APP版本
npm run build:app
```

## 功能截图

- 首页（视频浏览）
- 视频详情页（视频播放）
- 视频上传页
- 用户中心页

## 开发计划

- [ ] 添加视频评论功能
- [ ] 添加视频分享功能
- [ ] 添加视频下载功能
- [ ] 添加用户登录/注册功能
- [ ] 添加视频推荐算法

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件 