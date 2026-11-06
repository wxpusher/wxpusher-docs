# 托管 CSS / JS

想给应用的消息详情页加上自己的样式或交互脚本，可以把 CSS / JS 托管在 WxPusher。资源挂在应用下，审核通过后**自动插入这个应用所有消息的详情页**，不用在消息里写引用代码，也不用自己找地方放文件。

> 出于安全考虑，消息正文里直接写的 `<script>` 会在发送时被删掉，只有托管并审核通过的 JS 才能在消息详情页里执行。

## 怎么用

1. 打开电脑端管理后台，在顶部选好应用，进入 **[【消息管理 → 代码托管】](https://wxpusher.zjiecode.com/admin/main/message/hosted)**，点「新建托管资源」，填写名称，选择 CSS 或 JS，粘贴代码或选择本地文件，提交审核。
2. 提交后页面会等待审核结果，通常几秒到几十秒。超过 60 秒会提示「审核中，请稍后查看审核结果」，可以稍后在列表里查看。
3. 审核通过后，资源变为「已上线」，之后打开这个应用的任意一条消息（包括已经发出的消息），详情页都会自动加载它。

手机 App 里只能查看说明，管理功能只在电脑端提供。

## 插入到哪里

- **范围**：资源所属应用发出的所有消息（文本、HTML、Markdown）的详情页。只插入「已上线」的资源；冻结、下架、删除后立即不再插入。
- **CSS**：以 `<link rel="stylesheet">` 放在页面 `<head>` 末尾，在站点默认样式之后，可以覆盖默认样式。
- **JS**：以 `<script async>` 放在页面末尾，**异步加载、不阻塞页面显示**。
- 同一个应用有多个资源时，按创建顺序插入；多个 JS 是各自异步加载的，**执行顺序不固定**，不要让它们互相依赖。

插入后的页面大致是这样（`v` 参数是资源最近一次上线的时间，代码更新后会自动变化）：

```html
<head>
  ...站点样式...
  <link rel="stylesheet" href="https://static.zjiecode.com/wxpusher/hosted/ha_xxxxxxxxxxxxxxxx.css?v=1762401234567">
</head>
<body>
  <main class="article-content">消息正文</main>
  ...
</body>
</html>
<script src="https://static.zjiecode.com/wxpusher/hosted/ha_yyyyyyyyyyyyyyyy.js?v=1762401234567" async></script>
```

## 例子

**CSS**：消息正文渲染在 `.article-content` 里，选择器建议加上它，避免影响页面其他部分。

```css
.article-content .order-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 12px;
}
.article-content .order-card .price {
  color: #f44336;
  font-weight: bold;
}
```

配合发送的 HTML 消息正文：

```html
<div class="order-card">订单 #1024 <span class="price">¥ 99.00</span></div>
```

**JS**：因为是异步加载，执行时页面可能已经加载完，也可能还没有，操作页面元素前先判断 `document.readyState`。不要使用 `document.write`。

```js
(function () {
  function init() {
    document.querySelectorAll('.article-content .copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.textContent = '已点击';
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

## 审核规则

因为托管的 JS 会在消息详情页里直接执行，审核从严。以下代码提交后会直接判为不通过：

| 类型 | 不允许 |
|---|---|
| 混淆、压缩 | 混淆过的代码（如大量 `_0x1234` 标识符、长串编码、`eval(function(p,a,c,k,e…`）；单行超过 1000 个字符且几乎没有空白的压缩代码。请提交可读的源码 |
| 动态执行 | `eval(`、`new Function(`、`setTimeout` / `setInterval` 传字符串、`String.fromCharCode` 一次拼 20 个以上字符 |
| 敏感接口 | App 原生桥（`window.wxpusher`、`webkit.messageHandlers`、`wxPusherApi`）、`document.cookie`、`localStorage`、`sessionStorage`、`indexedDB` |
| CSS | `@import`、`expression(`、`behavior:`、`-moz-binding`、`url(javascript:…)` |
| 其他 | 加载外部脚本、把页面内容或用户信息发到外部、伪造登录或支付界面、挖矿、强制跳转、违法违规内容 |

上面前四类是固定规则，编辑代码时页面会实时提示。

## 修改代码

- 修改代码就是提交一个新版本，同样要审核。**新版本审核通过前，线上继续使用当前版本**；通过后自动覆盖，已经发出的消息重新打开时也会使用新版本。
- 新版本不通过时，线上版本不受影响。详情里能看到不通过的原因，修改后可以再次提交；认为判断有误的，可以申请一次人工复核。
- 每个版本都按完整代码审核，不只看改动的部分。

## 状态说明

| 资源状态 | 含义 | 会不会插入详情页 |
|---|---|---|
| 未上线 | 还没有版本通过审核 | 不会 |
| 已上线 | 有审核通过的线上版本 | 会 |
| 已冻结 | 站长临时处置，文件已删除，可以恢复 | 不会 |
| 已下架 | 站长永久处置，不能恢复，也不能再提交 | 不会 |
| 已删除 | 你删除了这个资源 | 不会 |

| 版本审核状态 | 含义 |
|---|---|
| 审核中 | 正在审核，包括申请人工复核后等待处理 |
| 审核通过 | 已成为线上版本 |
| 审核不通过 | 违反审核规则，详情里能看到原因 |
| 已作废 | 审核中你又提交了新版本，这一版不再处理 |

## 限制

- 单个文件最大 100 KB（按 UTF-8 字节计算）。
- 每个应用最多 5 个资源（已删除、已下架的不算）。
- 每个账号每天最多提交 20 次（不通过的也算），同一时间只能有 1 个版本在审核。

## 常见问题

**为什么被判为混淆？** 规则会把大量 `_0x` 开头的变量、很长的十六进制或 Base64 串、连续的 `\x` / `\u` 转义当作混淆。请提交打包前的源码，长数据放到消息正文里或拆开写。

**审核通过了，详情页里没生效？** 确认资源挂在发这条消息的应用下，并且状态是「已上线」。CSS 选择器要能匹配到正文里的元素；JS 是异步执行的，按上面的例子处理 `document.readyState`。

**已经发出的消息，为什么不再加载这个资源了？** 资源被删除、冻结或下架后，文件会从 CDN 删除，消息详情页也立即不再插入它。
