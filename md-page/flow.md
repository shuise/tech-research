# markdown flow
1. markdown flow： https://mermaidjs.github.io/
2. web页面： https://shuise.github.io/tech-research/md-page/flow.html

3. markdown 编辑器：[https://typora.io](https://typora.io/) 支持 windows、mac、linux



# flow

```mermaid
graph TD;
    User1 --> AppServer;
		User1 --> RongCloud;
    AppServer --> User2;
    RongCloud --> User2;
```



# sequenceDiagram

```mermaid
sequenceDiagram
    participant App应用
    participant 应用服务器
    App应用 -> 应用服务器: 登录 业务系统校验
    loop 权限检查
        融云服务器 -> 融云服务器: 消息收发
    end
    Note right of 融云服务器: 消息收发 <br/>音视频通话...
    融云服务器 -> App应用: 消息收发 音视频通话
    融云服务器 --> 应用服务器: 用户信息同步 分配 token
    应用服务器 -> 融云服务器: 消息收发 
```



#demo

```mermaid
graph LR
    A(Pad 用户) -->|请求身份验证| B{应用服务器}
    B --> C((融云服务器))
    C -->|通过| D[分配token]
    D -->|返回token| C
    C -->|不通过| E[返回错误提示]
    A -->|使用token链接| C((融云服务器))
```