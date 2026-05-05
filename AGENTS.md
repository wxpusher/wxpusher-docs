# wxpusher-docs — 开发者文档站

## 技术栈

- **框架**：Docsify（纯客户端渲染的文档站生成器）
- **内容**：Markdown（`docs/README.md` 为主文档）
- **部署**：静态文件，通过 `deploy-docs.sh` 打包上传至服务器

## 项目定位

WxPusher 的对外开发者文档站，部署在 `https://wxpusher.zjiecode.com/docs/`。文档内容覆盖：

- 产品介绍与 Demo 演示
- App 下载指引（Android/iOS/HarmonyOS）
- API 接入指南（消息发送、回调、查询等）
- 微信 ClawBot (iLink) 使用说明
- 消息状态查询页面
- 各厂商推送开通指引

## 目录结构

```
wxpusher-docs/
├── .nojekyll                     # 禁用 GitHub Pages Jekyll
├── .gitignore
├── LICENSE
├── deploy-docs.sh                # 部署脚本（tar 打包 + scp 上传）
└── docs/
    ├── index.html                # Docsify 入口 HTML（含 SEO meta）
    ├── README.md                 # 主文档内容（Markdown，Docsify 渲染）
    ├── css/vue.css               # Docsify 主题样式
    ├── js/
    │   ├── docsify.min.js        # Docsify 运行时
    │   └── zoom-image.min.js     # 图片缩放插件
    ├── download.html             # App 下载页
    ├── message-status.html       # 消息状态查询页
    ├── guide.png                 # 引导图
    ├── ios-app.png               # iOS 截图
    ├── imgs/                     # 文档图片资源
    │   ├── login.jpg / message-list.jpg / message-detail.jpg / profile.jpg
    │   ├── create_app.png / appToken.png / app-info.png
    │   ├── market.jpg / subscribe.png / structure.png
    │   ├── create_product.jpg / product-list.jpg / product-detail.jpg
    │   ├── pay_flow.png / ilink-active.png / ilink-preview.png
    │   └── icon-512.png / android-download.png / getid.jpg / ios-list.jpg
    └── open-app-note/            # 厂商推送开通指引（独立 HTML 页面）
        ├── index.html
        ├── styles.css
        ├── script.js
        └── images/               # 厂商 Logo
```

## 开发命令

```bash
cd wxpusher-docs

# 本地预览（需安装 docsify-cli）
npx docsify-cli serve docs

# 部署到测试环境
./deploy-docs.sh

# 部署到生产环境
./deploy-docs.sh -p
```

## 注意事项

- 文档内容全部在 `docs/README.md` 中（单页文档），由 Docsify 客户端渲染
- `docs/index.html` 包含完整的 SEO meta（Open Graph / Twitter Card）
- 部署脚本将 `docs/` 目录打成 tar 包后 scp 到服务器解压
- 修改文档内容只需编辑 `docs/README.md`，图片放在 `docs/imgs/`
