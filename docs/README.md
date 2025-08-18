# 介绍

## 什么是WxPusher

**WxPusher消息推送平台** 是一个使用微信公众号作为通道的，实时信息推送平台，你可以通过调用API的方式，把信息推送到微信上，无需安装额外的软件，即可做到信息实时通知。
你可以使用**WxPusher**来做服务器报警通知、抢课通知、抢票通知，信息更新提示等。
## demo演示程序
 
你可以访问演示程序，体验功能：[https://wxpusher.zjiecode.com/demo/](https://wxpusher.zjiecode.com/demo/)

演示程序源代码：[https://github.com/wxpusher/wxpusher-sdk-java/](https://github.com/wxpusher/wxpusher-sdk-java/)

管理后台：[https://wxpusher.zjiecode.com/admin/](https://wxpusher.zjiecode.com/admin/)

> 请一定不要调用demo程序，直接给用户发送消息！！！

## 效果预览
**微信接口调整，直接发送文本消息的方式已经下线**，我们正在开发新的推送方式，敬请期待。

类型|获取用户ID|模版消息|~~普通发送~~|~~带链接的消息~~|~~长文本消息~~
:--:|:--:|:--:|:---:|:---:|:---:
预览|![创建应用](imgs/getid.jpg  ':size=250')|![创建应用](imgs/type_4.jpg  ':size=250')|![创建应用](imgs/type_1.jpg  ':size=250')|![创建应用](imgs/type_2.jpg  ':size=250')|![创建应用](imgs/type_3.jpg  ':size=250')

# 2种发送方式
为了方便不同的用户群体，不同的使用场景，更快捷方便的发送消息，我们目前支持了2种使用WxPusher的方式。

> - **请注意，这2种发送方式，身份标志不一样，不可以相互迁移或者切换;**
> - **在有条件的情况下，强烈建议使用第一种方式，能力更佳完善。**

发送方式|优点、缺点和适用场景
:--:|:--
标准推送【推荐】<br/>(标准应用开发)|<ul><li>发送消息和接收消息的不是同一个人</li><li>可以管理接收消息的用户</li><li>可以支持上行消息等高级功能</li><li>适合有一定开发经验的开发者</li><li>无特殊限制，具体可以查看<a href="#/?id=limit">限制说明</a></li></ul>
极简推送<br/>（SPT一键推送）|<ul><li>发送消息和接收消息的是同一个人</li><li>非常简单，无需登陆，创建应用等</li><li>简单发送消息能力，无法管理消息和接收者</li><li>适合无经验但是想简单发送消息的用户</li><li>最多一次发送给10个人，具体说明请查看<a href="#/?id=spt">极简推送接口</li></ul>



# 方式一：标准推送
## 名词解释
- 应用

对应你的一个项目 ，主要用来做鉴权，资源隔离等（类比使用高德地图SDK、微信登录等，都会先新建一个应用），每个应用拥有独立的名字，二维码，回调地址，调用资源，鉴权信息等，发送消息第一步，需要先新建一个应用。

简单的理解，你有一个抢火车票的项目，抢到票了需要给用户发送信息；你还有一个服务器报警的项目，服务器有异常的时候，给相关负责人发送信息，这2个的用途是不一样的，你就可以创建2个应用来分别发送他们的信息。

用户可以通过二维码或者链接关注这个应用，关注我们会把用户的UID回调给你指定的服务器，你可以通过UID给这个用户发送信息。
- 主题(Topic)

主题(Topic)是应用下面，一类消息的集合，比如创建了一个优惠相关的应用，用来给用户推送各种优惠信息，但是不同的用户关注的优惠信息不同，一部分人关注淘宝的，一部分人关注京东的。这种场景下，你就可以创建一个淘宝的主题，再创建一个京东的主题，发送信息的时候，直接发送到对应的主题即可，每个主题都有对应的订阅链接和二维码，用户订阅这个主题以后，就能接收这个主题下的信息了。

Topic只能无差别群发，不能针对用户定制消息，用户关注以后，无回调信息 。
- 应用和主题(Topic)的对比

项目|应用|主题(Topic)
:--:|:--:|:---:
概念|应用是一个独立的个体|主题属于应用，调用主题需要使用对应应用的APP_TOKEN授权
关注方式|二维码和链接|二维码和链接
发送群体|通过UID一对一发送|消息发送主题后，主题再分发给关注主题的用户，属于群发

- 各种二维码

项目|应用二维码|主题二维码
:--:|:--:|:---:
用途|用于微信用户关注应用，用户只有关注了你的应用，<br />你才能拿到他的UID，才能给他发送信息|用于订阅主题，用户订阅主题以后，你不能拿到它的UID
动静态|默认动态二维码|默认动态二维码

**动态二维码**：二维码链接不会变，但是二维码图形会变 ，因此只能使用动态二维码链接，不对截图、打印等。

**静态二维码**：二维码链接和图形都不变，可以随意使用。

- APP_TOKEN

应用的身份标志，这个只能开发者你本人知道 ，拥有APP_TOKEN，就可以给对应的应用的用户发送消息 ，所以请严格保密，不要发送到github之类的地方。
- UID
  
微信用户标志，在单独给某个用户发送消息时，来说明要发给哪个用户。

## 快速接入

### 整体架构

在接入之前，你可以看一下架构图，有助于你理解单发，群发的区别。
![系统架构](imgs/structure.png )

### 注册并且创建应用
  
[https://wxpusher.zjiecode.com/admin/](https://wxpusher.zjiecode.com/admin/) ，使用微信扫码登录，无需注册，新用户首次扫码自动注册。

创建一个应用，如下图：

![创建应用](imgs/create_app.png  ':size=250')

回调地址：可以不填写，不填写用户关注的时候，就不会有回调，你不能拿到用户的UID，参考<a href="#/?id=callback">回调说明</a>。

设置URL：可以不填写，填写以后，用户在微信端打开「我的订阅」，可以直接跳转到这个地址，并且会携带uid作为参数，方便做定制化页面展示。

联系方式：可以不填写，告诉用户，如何联系到你，给你反馈问题。

关注提示：用户关注或者扫应用码的时候发送给用户的提示，你可以不填写，Wxpusher会提供一个默认文案。你也可以在用户关注回调给你UID的时候，再主动推送一个提示消息给用户。

说明：描述一下，你的应用，推送的是啥内容，用户通过链接关注，或者在微信端查看的时候可以看到。

### 获取appToken
在你创建应用的过程中，你应该已经看到appToken，如果没有保存，可以通过下面的方式重制它。

打开应用的后台[https://wxpusher.zjiecode.com/admin/](https://wxpusher.zjiecode.com/admin/)，从左侧菜单栏，找到appToken菜单，在这里，你可以重置appToken，请注意，重置后，老的appToken会立即失效，调用接口会失败。

![获取appToken](imgs/appToken.png  ':size=350')

### 扫码关注应用
创建应用以后，你可以看到应用的应用码和关注链接，你可以让你的用户通过下面2种方式来关注你的应用，关注你的应用以后，你就可以给他发送消息了。

![创建应用](imgs/subscribe.png  ':size=350')

### 获取UID
目前有3种方式获取UID：
1. 关注公众号：wxpusher，然后点击「我的」-「我的UID」查询到UID；
1. 通过<a href="#/?id=create-qrcode">创建参数二维码</a>接口创建一个定制的二维码，用户扫描此二维码后，会通过<a href="#/?id=subscribe-callback">用户关注回调</a>把UID推送给你；
1. 通过<a href="#/?id=create-qrcode">创建参数二维码</a>接口创建一个定制的二维码，然后用<a href="#/?id=query-uid">查询扫码用户UID</a>接口，查询扫描此二维码的用户UID；

### 发送消息
拿到UID以后，配合应用的appToken，然后调用发送接口发送消息。

## HTTP接口说明

所有接口均已经支持https。

### 发送消息 :id=send-msg
- POST接口
  POST接口是功能完整的接口，推荐使用。

  Content-Type:application/json
  
  地址：https://wxpusher.zjiecode.com/api/send/message

  请求数据放在body里面，具体参数如下：

  __JSON不支持注释，发送的时候，需要删除注释。__

  ```json
  {
    "appToken":"AT_xxx",//必传
    "content":"<h1>H1标题</h1><br/><p style=\"color:red;\">欢迎你使用WxPusher，推荐使用HTML发送</p>",//必传
    //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度20(微信只能显示20)，可以不传，不传默认截取content前面的内容。
    "summary":"消息摘要",
    //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签，推荐使用这种) 3表示markdown 
    "contentType":2,
    //发送目标的topicId，是一个数组！！！，也就是群发，使用uids单发的时候， 可以不传。
    "topicIds":[ 
        123
    ],
    //发送目标的UID，是一个数组。注意uids和topicIds可以同时填写，也可以只填写一个。
    "uids":[
        "UID_xxxx"
    ],
    //原文链接，可选参数
    "url":"https://wxpusher.zjiecode.com", 
    //是否验证订阅时间，true表示只推送给付费订阅用户，false表示推送的时候，不验证付费，不验证用户订阅到期时间，用户订阅过期了，也能收到。
    //verifyPay字段即将被废弃，请使用verifyPayType字段，传verifyPayType会忽略verifyPay
    "verifyPay":false, 
    //是否验证订阅时间，0：不验证，1:只发送给付费的用户，2:只发送给未订阅或者订阅过期的用户
    "verifyPayType":0 
}
  ```
  html格式的消息（contentType=2），支持通过标签复制，复制的语法如下：
  ```html
  <copy style="这里可以写复制按钮的style" data-clipboard-text="需要复制到剪贴板的内容">
        复制按钮的文字
  </copy>

  一个例子如下，style默认可以不写：
  <copy data-clipboard-text="被复制的内容">
        复制
  </copy>
  ```


返回数据说明：
```json
{
    "code": 1000, //状态码，非1000表示有异常
    "msg": "处理成功",//提示消息
    "data": [ //每个uid/topicid的发送状态，和发送的时候，一一对应，是一个数组，可能有多个
        {
            "uid": "UID_xxx",//用户uid
            "topicId": null, //主题ID
            "messageId": 121,//废弃⚠️，请不要再使用，后续会删除这个字段
            "messageContentId": 2123,//消息内容id，调用一次接口，生成一个，你可以通过此id调用删除消息接口，删除消息。本次发送的所有用户共享此消息内容。
            "sendRecordId": 12313,//消息发送id，每个uid用户或者topicId生成一个，可以通过这个id查询对某个用户的发送状态
            "code": 1000, //1000表示发送成功
            "status": "创建发送任务成功"
        }
    ],
    "success": true
}

```
- GET接口
  GET接口是对POST接口的阉割，主要是为了某些情况下调用方便，只支持对文字（contentType=1）的发送，举例：
  ```
  https://wxpusher.zjiecode.com/api/send/message/?appToken=AT_qHT0cTQfLwYOlBV9cJj9zDSyEmspsmyM&content=123&uid=c1BcpqxEbD8irqlGUh9BhOqR2BvH8yWZ&url=http%3a%2f%2fwxpusher.zjiecode.com
  ```
  请求参数支持：appToken、**uid**、**topicId**、content、url、verifyPayType ，其中content和url请进行urlEncode编码。

  GET接口只支持发送一个uid或者topicId，推荐使用POST接口

### 查询状态
消息发送给Wxpusher，Wxpusher会缓存下来，后台异步推送给微信再分发给用户，当消息数量庞大的时候，可能会有延迟，你可以根据发送消息返回的sendRecordId，查询消息给此用户的发送状态

请求方式：GET

说明：查询消息状态，消息缓存有时效性，目前设置缓存时间为7天，7天后查询消息，可能会返回消息不存在

请求地址：https://wxpusher.zjiecode.com/api/send/query/status?sendRecordId={sendRecordId}

参数说明：
- sendRecordId 发送消息接口返回的发送id，对应给一个uid或者topic的发送id

### 删除消息

请求方式：DELETE

说明：消息发送以后，可以调用次接口删除消息，但是请注意，只能删除用户点击详情查看的落地页面，已经推送到用户的消息记录不可以删除。

请求地址：https://wxpusher.zjiecode.com/api/send/message?messageContentId=${messageContentId}&appToken=${appToken}

参数说明：
- messageContentId 发送接口返回的消息内容id，调用一次接口生成一个，如果是发送给多个用户，多个用户共享一个messageContentId，通过messageContentId可以删除内容，删除后本次发送的所有用户都无法再查看本条消息
- appToken 应用鉴权的AppToken，和发送消息用的appToken是一样的 


### 创建参数二维码 :id=create-qrcode
有一种场景，就是需要知道当前是谁扫描的二维码，比如：论坛帖子有新消息需要推送给用户，这个如果用户扫码关注，你需要知道是谁扫的二维码，把论坛用户ID和Wxpusher用户的UID绑定，当论坛用户ID有新消息时，推送给Wxpusher用户。这种场景就需要带参数的二维码。

请求方式：POST

请求地址：https://wxpusher.zjiecode.com/api/fun/create/qrcode

ContentType：application/json

说明：创建带参数二维码，用户扫码以后，会在回调里面带上参数，参考<a href="#/?id=callback">回调说明</a>

请求body:

```json
{
    "appToken":"xxx",   //必填，appToken,前面有说明，应用的标志
    "extra":"xxx",      //必填，二维码携带的参数，最长64位
    "validTime":1800    //可选，二维码的有效期，默认30分钟，最长30天，单位是秒
}
 
```

### 查询扫码用户UID :id=query-uid
用户扫描参数二维码后，设置了回调地址，我们会通过回调地址把用户的UID推送给你的服务，具体见<a href="#/?id=callback">回调说明</a>，推荐使用这种回调的方式。

但是部分用户场景简单，或者没有后端服务，比如客户端软件，使用很不方便，因此我们增加了这个查询接口，通过上面的<a href="#/?id=create-qrcode">创建参数二维码</a>接口创建一个二维码，你会拿到一个二维码的code，用此code配合这个接口，可以查询到最后一次扫描参数二维码用户的UID。

<font color="red">轮训时间间隔不能小于10秒！！禁止死循环轮训，用户退出后，必须关闭轮训，否则封号。</font>

请求方式：GET

请求地址：https://wxpusher.zjiecode.com/api/fun/scan-qrcode-uid

请求参数(Query):
 - code 创建参数二维码接口返回的code参数。

一个例子
```
https://wxpusher.zjiecode.com/api/fun/scan-qrcode-uid?code=xxxxx
```

### ~~查询用户列表V1（已弃用）~~
**本接口已经被弃用，请使用下面 查询App的关注用户V2接口**
~~你可以通过本接口，分页查询到所有关注你App的微信用户。~~

~~请求方式：GET~~

~~说明：获取到所有关注应用的微信用户用户信息~~

~~请求地址：https://wxpusher.zjiecode.com/api/fun/wxuser~~

~~请求参数：~~
 - appToken 应用密钥标志
 - page  请求数据的页码
 - pageSize 分页大小
 - uid 用户的uid，可选，如果不传就是查询所有用户，传uid就是查某个用户的信息。

~~返回数据：~~
```json
{
    "page":1, //当前数据页码
    "pageSize":50, //当前页码大小 
    "records":[
        {
            "createTime":1572755754416, //用户关注时间
            "enable":true, //是否可用，也就是用户是否开启接收消息
            "headImg":"xxxxxx",//用户头像
            "nickName":"0XFF",//用户昵称
            "uid":"xxxxxxx"//用户的UID
        }
    ],
    "total":3//所有的用户数量
}
```
### 查询用户列表V2 :id=user-list
你可以通过本接口，分页查询到所有关注应用和关注主题的用户。

请求方式：GET

说明：获取到所有关注应用/主题的微信用户用户信息。**需要注意，一个微信用户，如果同时关注应用，主题，甚至关注多个主题，会返回多条记录。**

请求地址：https://wxpusher.zjiecode.com/api/fun/wxuser/v2

请求参数：
 - appToken 应用密钥标志
 - page  请求数据的页码
 - pageSize 分页大小，不能超过100
 - uid 用户的uid，可选，如果不传就是查询所有用户，传uid就是查某个用户的信息。
 - isBlock 查询拉黑用户，可选，不传查询所有用户，true查询拉黑用户，false查询没有拉黑的用户
 - type 关注的类型，可选，不传查询所有用户，0是应用，1是主题。
返回数据：
```json
{
    "code": 1000,
    "msg": "处理成功",
    "data": {
        "total": 40,//总数
        "page": 1,//当前页码
        "pageSize": 20,//页码大小，
        "records": [
            {
                "uid": "UID_xxx",//用户uid
                "appOrTopicId":111,//用户关注的应用或者主题id，根据type来区分
                "headImg": "",//新用户微信不再返回 ，强制返回空
                "createTime": 1603540859285,//创建时间
                "nickName": "",//新用户微信不再返回 ，强制返回空
                "reject": false,//是否拉黑
                "id": 47361,//id，如果调用删除或者拉黑接口，需要这个id
                "type": 0,//关注类型，0：关注应用，1：关注topic
                "target": "WxPusher官方",//关注的应用或者主题名字
                "payEndTime":0 // 0表示用户不是付费用户，大于0表示用户付费订阅到期时间，毫秒级时间戳
            }
        ]
    },
    "success": true
}
```

### 删除用户
你可以通过本接口，删除用户对应用，主题的关注。

请求方式：*DELETE*

说明：你可以删除用户对应用、主题的关注，删除以后，用户可以重新关注，如不想让用户再次关注，可以调用拉黑接口，对用户拉黑。

请求地址：https://wxpusher.zjiecode.com/api/fun/remove

请求参数(Query)：
 - appToken 应用密钥标志
 - id  用户id，通过用户查询接口可以获取

返回数据：
```json
{
    "code": 1000,
    "msg": "处理成功",
    "data": "删除成功",
    "success": true
}
```

### 拉黑用户
你可以通过本接口，可以拉黑用户

请求方式：*PUT*

说明：拉黑以后不能再发送消息，用户也不能再次关注，除非你取消对他的拉黑。调用拉黑接口，不用再调用删除接口。

请求地址：https://wxpusher.zjiecode.com/api/fun/reject

请求参数(Query)：
 - appToken 应用密钥标志
 - id  用户id，通过用户查询接口可以获取
 - reject 是否拉黑，true表示拉黑，false表示取消拉黑

返回数据：
```json
{
    "code": 1000,
    "msg": "处理成功",
    "data": "删除成功",
    "success": true
}
```


## SDK调用

为了方便快速接入，各位热心的开发者贡献了很多接入SDK，[https://github.com/wxpusher/wxpusher-client](https://github.com/wxpusher/wxpusher-client).

**SDK是开发者们贡献，可能不包括最新的API或者功能，功能以本文的的HTTP接口为准，也欢迎你提PR给我们。**

# 方式二：极简推送 :id=spt

**极简推送，不需要注册用户，登陆后台，创建应用，获取appToken等。**

为了避免用户理解太多概念，导致接入困难，部分**自己给自己发送消息的场景**，可以使用极简推送方式。

比如：部分开源商城订单系统，下单后给用户发送消息；短信转发系统等；之前需要用户创建应用，获取appToken，关注应用，填写UID等等，对普通用户来说，成本太高。

极简推送只需要2步就可以完成推送：
- 获取推送的SPT（simple push token，极简推送的身份ID，用于确定你要把消息推送给谁）
- 调用http接口进行消息推送

## 获取SPT

直接扫描下面二维码即可获取你的推送SPT

![获取SPT](https://wxpusher.zjiecode.com/api/qrcode/RwjGLMOPTYp35zSYQr0HxbCPrV9eU0wKVBXU1D5VVtya0cQXEJWPjqBdW3gKLifS.jpg  ':size=200')

如果需要在你的系统里面展示这个二维码，你可以使用下面的永久链接:

<textarea readonly style="width:100%;height:60px;">
https://wxpusher.zjiecode.com/api/qrcode/RwjGLMOPTYp35zSYQr0HxbCPrV9eU0wKVBXU1D5VVtya0cQXEJWPjqBdW3gKLifS.jpg
</textarea>

> **请勿泄漏SPT，SPT泄漏后，任意用户都可以给你发送消息！！！**

## 发送消息

- GET请求极简发送

    把你上一步获取到的SPT，放在下面的链接里面

    直接请求：https://wxpusher.zjiecode.com/api/send/message/你获取到的SPT/你要发送的内容

- POST请求极简发送

    请求方式：POST

    请求URL：https://wxpusher.zjiecode.com/api/send/message/simple-push

    请求格式：Content-Type:application/json

    请求内容：

```json
//JSON不支持注释，发送的时候，需要删除注释。
{
    //推送内容，必传
    "content":"<h1>极简推送</h1><br/><p style=\"color:red;\">欢迎你使用WxPusher，推荐使用HTML发送</p>",
    //消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度20(微信只能显示20)，可以不传，不传默认截取content前面的内容。
    "summary":"消息摘要",
    //内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签，推荐使用这种) 3表示markdown 
    "contentType":2,
    //发送SPT，如果发送给一个用户，直接传simplePushToken就行了，不用传simplePushTokenList
    "spt":"SPT_xx1",
    //发送SPT，如果发送给多个用户，只传simplePushTokenList即可，请注意，【这是一个数组】！！，最多不能超过10个
    "sptList":["SPT_xx1","SPT_xx2"],
    //原文链接，可选参数
    "url":"https://wxpusher.zjiecode.com",
}

```

# 回调说明 :id=callback

> 请注意：只有方式一（标准推送）才支持回调

当用户关注应用或者发送命令消息到公众号的时候，WxPusher会将消息推送给你。
如果你没有后台服务，也可以轮训，参考<a href="#/?id=query-uid">查询扫码用户UID</a>接口。



## 用户关注回调 :id=subscribe-callback
给用户发送消息，需要知道用户的UID，有2种途径知道用户的UID：
- 用户关注公众号以后，在菜单里面，找到「获取UID」就可以看到自己的UID了。
- 如果你在创建应用的时候，写了回调地址，当用户扫描你的应用二维码关注你创建的应用时，WxPusher会对你设置的地址发起HTTP调用，把用户的UID推送给你。
回调的使用POST方法，数据格式如下：
```json
{
    "action":"app_subscribe",//动作，app_subscribe 表示用户关注应用回调，后期可能会添加其他动作，请做好兼容。
    "data":{
        "appId":123,//创建的应用ID
        "appKey":"AK_xxxxxx", //关注应用的appKey，请不要再使用，将来可能会被删除
        "appName":"应用名字",
        "source":"scan", //用户关注渠道，scan表示扫码关注，link表示链接关注，command表示通过消息关注应用，后期可能还会添加其他渠道。
        "userName":"", //新用户微信不再返回 ，强制返回空
        "userHeadImg":"",//新用户微信不再返回 ，强制返回空
        "time":1569416451573, //消息发生时间
        "uid":"UID_xxxxxx", //用户uid
        "extra":"xxx"    //用户扫描带参数的二维码，二维码携带的参数。扫描默认二维码为空
    }
}
```

## 付费状态回调
对于消息产品，如果用户付费或者退款以后，开发者可能需要感知到用户的付费订阅状态。

因此当用户的付费订阅状态变化的时候，会通过下面的回调消息通知你，你可以在收到通知的时候，通过<a href="#/?id=user-list">查询用户列表V2</a>查询到用户的订阅到期时间等信息。

```json
{
    "action":"order_pay",//动作，表示用户付费或者退款。后期可能会添加其他动作，请做好兼容。
    "data":{
        "addTime":86400000,//付费增加的时间，毫秒。退款是负数，表示减少的订阅时间。
        "amount":50,//金额，单位分，退款是负数
        "appId":30630, //发生的应用id
        "createTime":1664118481675,//发生时间，毫秒级时间戳
        "prodId":12,//产品id
        "tradeNo":"202209252308016755383125546",//支付或者退款的交易号，和用户微信账单中的商户号对应
        "type":1,//1表示付款，2表示退款
        "uid":"UID_xxxxxxx"//发生用户的uid
    }
}
```


## 上行消息（用户发送消息回调）
目前WxPusher已经支持指令类的上行消息，用户发送指令，WxPusher会将指令消息回调给开发者。

- 标准指令
  
  指令的格式为：**#{appID} 内容**  ，比如给[演示程序](https://wxpusher.zjiecode.com/demo/)发送消息，可以发送：#97 测试 ，注意中间有一个空格。

- 订阅指令
  
  如果只发送appID：**#{appID}**，比如：#97 ，后面没有内容，表示关注appID为97的应用。

- 简化指令
  
  如果只发送内容：xxx ，比如：重启服务器 ，这个时候又分为2种情况：
  - 只订阅了一个应用，会直接发送给给这个默认应用
  - 订阅了多个应用，这个时候用户会提示用户选择，在手机端可以直接点击完成操作。

appID可以在管理后台，[应用管理-应用信息](https://wxpusher.zjiecode.com/admin/main/app/appInfo)-应用id 查看。

![获取应用信息](imgs/app-info.png  )


回调使用POST方法，数据格式如下：
```json
{
    "action":"send_up_cmd",//动作，send_up_cmd 表示上行消息回调，后期可能会添加其他动作，请做好兼容。
    "data":{
        "uid":"UID_xxx",//用户uid
        "appId":97, //应用id
        "appName":"WxPusher演示",//应用名称
        "time":1603002697386,//发生时间
        "content":"内容" //用户发送的内容
    }
}
```

# 消息产品收费

> 请注意：只有方式一（标准推送）才支持消息产品收费

<p style="font-size:1.1em;font-weight:600">请注意，此收费是指：消息开发者，通过WxPusher向消息接收者收费，<font color="red">而不是指WxPusher向开发者或者用户收费</font>。</p>

![收费流程](imgs/pay_flow.png  )

作为开发者，<font color="red">你负责提供有价值的消息，我们负责帮你赚钱变现</font>。

接入的流程如下：

## 创建消息产品
消息产品是对单发的应用消息，群发的主题消息的包装，可以把多个消息，包装到一个消息产品下进行销售。


> 请注意，我们暂时不接受股票、期权、债券、基金等的策略推荐类消息上架

> 你需要注意一个概念，我们销售的是产品绑定的资源，比如一般无差别群发的，就绑定到主题上；一对一通过uid发送的，就绑定到应用上。


![创建产品](imgs/create_product.jpg  )

请注意，目前产品创建后，不支持修改，请填写清楚后再提交。

提交后，请联系客服微信「lanyunt」进行审核，付费价格策略等商谈，完成后可以上架到消息市场，用户可以直接在消息市场支付购买。

## 消息市场
说明|消息市场|消息产品列表|消息产品介绍
:--:|:--:|:--:|:--:
示例|![创建应用](imgs/market.jpg  ':size=250')|![创建应用](imgs/product-list.jpg  ':size=250')|![创建应用](imgs/product-detail.jpg  ':size=250')

## 付费信息查询

通过<a href="#/?id=user-list">查询用户列表V2</a>可以查询用户信息，其中payEndTime就是用户的订阅到期时间。

## 付费消息标记

包装为产品的应用或者主题，在发送消息的时候，可以区分本条消息是否只有付费订阅期内的用户才收得到。
根据verifyPayType字段来做区别
 - verifyPayType=0，表示本条消息，不验证付费状态，发送给所有用户
 - verifyPayType=1，表示本条消息，只发送给付费订阅期内的用户
 - verifyPayType=2，表示本条消息，只发送给未订阅或者付费订阅过期的用户

具体可以查看<a href="#/?id=send-msg">发送消息的接口</a>说明，没有关联消息产品的应用或者主题，verifyPayType字段无效，可以不用传递。

## 授权查询 :id=query-pay-end-time

你需要注意一个概念，我们销售的是产品绑定的资源，所以查询的是资源对应的到期时间。比如一般无差别群发的，就绑定到主题上；一对一通过uid发送的，就绑定到应用上，查询的分别是订阅主题或者应用的到期时间。


请求方式：GET

说明：用户某个用户在在某个资源上的到期时间，因为一个产品可以绑定多个资源，所以返回的是一个数组（但是一般不会绑定多个）。

请求地址：https://wxpusher.zjiecode.com/api/product/query-pay-end-time?uid={uid}&prodId={产品id}

参数说明：
- uid 用户的uid
- prodId 产品的id，请注意大小写

响应参数：
```
{
    "code": 1000,
    "msg": "处理成功",
    "data": [
        {
            "resourceType": 2, //资源类型，1对1uid发送的应用为1，群发主题为2
            "resourceID": 123, //应用id或者主题id
            "payEndTime": 1737560859272 //用户付费订阅到期时间，毫秒级的时间戳
        }
    ],
    "success": true
}
```

## 授权验证流程

如果你的是软件产品，请接入WxPusher的授权，这样方便用户购买后，和对应的到期时间绑定。
一般的验证流程是：
- 获取到用户的UID，一般有2种方式：
  - 用户输入UID
  - 通过<a href="#/?id=create-qrcode">参数二维码</a>让用户扫码获取到用户的UID
- 用户打开软件，调用UID我们的<a href="#/?id=query-pay-end-time">授权查询接口</a>，查询用户付费到期时间.
- 如果有效期内就让用户进入软件，否则就显示产品二维码，让用户扫码续费。


## 特别说明
1. 我们目前不接收股票、期货的策略推荐类消息上架；
2. 同一种消息，我们仅上架一个，请不要重复提交；
3. 如果你是新接入，你可以先联系微信客服lanyunt，确定可以上架，再进行开发，避免浪费时间；
4. 提交后，为了尽快审核，你可以主动联系微信客服lanyunt沟通；
5. 上架后，请持续服务，连续3天不推送消息，系统会发消息提醒你，连续6天不提送消息，系统自动下架产品。


# 其他客户端

为了更好的用户体验，我们正在努力开发更多的客户端，以提高用户的体验。
## Chrome扩展
Chrome扩展是一个基于Chrome浏览器的扩展程序，只要开着浏览器，就可以接收消息，目前支持Mac、Window电脑，接收消息的体验比微信更好，欢迎体验使用。
如果你能访问谷歌，你可以直接访问<a href="https://chromewebstore.google.com/detail/wxpusher/hjjmlbnpgnnnnkfbnajpmbakkjobgmjd?authuser=0&hl=zh-CN">谷歌插件商店安装 </a>

你也可以访问这里<a href="https://github.com/wxpusher/wxpusher-chrome-extensions">https://github.com/wxpusher/wxpusher-chrome-extensions</a>下载和安装浏览器插件。

你也可以访问这里，查看具体的安装使用方式：https://mp.weixin.qq.com/s/zrUdVqrE0odhUTiD7qhWiQ

- 目前浏览器插件消息会在服务器缓存24小时，浏览器关闭以后，24小时以内上线，会重新把消息发送给你，如果超过24小时，消息会被丢弃；
- Chrome扩展是微信公众号的拓展，绑定Chrome扩展以后，Chrome和微信公众号会同时收到消息；
- Window用户，请在window设置-通知，把对应浏览器的通知权限打开，否则可能没有消息提醒
- Mac用户，请在设置-通知与专注模式-Chrome，允许通知，否则可能没有消息提醒



## iOS苹果客户端

因为微信的内容限制，为更好的用户体验，欢迎你下载iOS苹果客户端来接收消息，用户体验更佳，下载方式如下：
- 打开AppStore（苹果应用商店），搜索：WxPusher，下载安装
- [点击这里的链接](https://apps.apple.com/cn/app/wxpusher%E6%B6%88%E6%81%AF%E6%8E%A8%E9%80%81%E5%B9%B3%E5%8F%B0/id6444387603)，直接打开并下载应用

![iOS客户端](imgs/ios-list.jpg  ':size=500')

## Android客户端

因为国内Android生态问题，Android应用还在开发中，十分抱歉。

# 限制说明 :id=limit
WxPusher是免费的推送服务，为了能更好的服务大家，这里说明一下系统相关数据限制
- 消息发送，必须合法合规，发送违规违法欺诈等等非正常消息，可能被封号；
- WxPusher推送的是实时消息，时效性比较强，过期以后消息也就没有价值了，目前WxPusher会为你保留7天的数据 ，7天以后不再提供可靠性保证，会不定时清理历史消息；
- 单条消息的数据长度(字符数)限制是：content<40000;summary<20(微信的限制，大于20显示不完);url<400，;
- 单条消息最大发送UID的数量<2000，单条消息最大发送topicIds的数量<5;
- 单个微信用户，也就是单个UID，每天最多接收2000条消息，请合理安排发送频率；
- 发送消息，最大QPS不能超过2，比如最多连续10秒调用20次发送接口，超过这个限制会被系统拦截。如果你需要大量发送消息，推荐使用主题，或者一次发送的时候，附带多个uid。
