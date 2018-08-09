# 统一认证 iOS示例

统一认证 指的是 `中国移动` 的统一认证服务

SDK 下载地址 参考 ：[中国移动开发者社区](http://dev.10086.cn/cmpassport/documents.html)

请下载 `一键免密登录SDK`

# 显式登录
## 1.初始化
在 AppDelegate 中调用

```
[TYRZBaseApi customInit:MOBILE_APPID appKey:MOBILE_APPKEY];
```

其中`MOBILE_APPID` 和 `MOBILE_APPKEY` 都是在中国移动开发者社区注册号账号之后，由中国移动提供的

## 2.调用

### 2.1.设置显式登录验证失败自动跳转到验证码验证

APP 调用 SDK 下面的接口，保证当中国移动显式登录验证失败的时候，能够跳转到验证码验证页面

```
[TYRZUILogin setCustomSMS:YES];
```

### 2.2.自定义UI（可选）

设置页面导航文字调用

```
[TYRZUILogin setLoginTitle:@"统一认证"];
```

设置显式登录验证成功页面的图标

```
[TYRZUILogin setLogo:[UIImage imageNamed:@"AppIcon"]];
```

### 2.3.显式登录
调用

```
__weak typeof(self) weakSelf = self;
[TYRZUILogin loginExplicitly:weakSelf complete:^(id sender) {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSString *resultCode = sender[@"resultCode"];
            NSString * authToken = sender[@"token"];
            NSMutableDictionary *result = [NSMutableDictionary dictionaryWithDictionary:sender];
            if ([resultCode isEqualToString:@"102000"]) {
                result[@"result"] = @"获取token成功";
            } else {
                result[@"result"] = @"获取token失败";
            }
            if(authToken.length > 0) {//如果获取到合法的token，那么开始验证
                [weakSelf doAuthLogin:authToken];
            }else {//否则给用户报错提示
                [weakSelf showErrorMessage:sender[@"desc"]];
            }
        });
    }];
```

## 3.业务流程图

![](example/tyrz_doc/tyrz.png)