# 倒班助手去广告（Surge 模块）

针对「倒班助手」iOS App（`open.daobanzhushou.cn`）的去广告 Surge 模块。

## 安装

### 方式一：一键安装（推荐）

在 Surge 中点击此链接：

```
surge:///install-module?url=https://raw.githubusercontent.com/mylofsh/surge-shift-assistant/main/shift-assistant-adblock.sgmodule
```

或复制到 Safari 地址栏打开。

### 方式二：手动添加

1. Surge → 首页 → 模块
2. 点击「+」→ 从 URL 安装
3. 粘贴：
   ```
   https://raw.githubusercontent.com/mylofsh/surge-shift-assistant/main/shift-assistant-adblock.sgmodule
   ```

### 方式三：本地文件

下载 `.sgmodule` 文件后从文件 App 导入 Surge。

## 生效前提

⚠️ **必须开启 MITM 并安装证书**，否则脚本改写不生效（只有域名拦截生效）。

1. Surge → 设置 → 中间人 → 打开「打开 HTTPS 解密」
2. 安装证书到系统：Surge → 设置 → 中间人 → 「配置新的 CA 证书」
3. 到 设置 → 通用 → 关于本机 → 证书信任设置 → 开启 Surge CA 信任
4. 装完模块后到 Surge 首页确认模块已启用

## 做了什么

### 1. 域名拦截（[Rule]）

直接 `REJECT-DROP` 掉 19 个广告 SDK 域名，覆盖：

| SDK | 域名 |
|---|---|
| 穿山甲（字节） | `pangolin-sdk-toutiao*.com`、`pglstatp-toutiao.com` |
| 优量汇（腾讯） | `gdt.qq.com` |
| 天目 | `sdk.tianmu.mobi` |
| 谷粒 | `ad.gameley.com` 等 3 个 |
| 其他 | `admobile.top`、`umeng.com`、`jpush.cn`、`beizi.biz` 等 15 个 |

### 2. 接口改写（[Script]）

拦截 `open.daobanzhushou.cn` 的两个广告开关接口，把响应体改成「不展示」：

| 接口 | 原始返回 | 改写后 |
|---|---|---|
| `/rs/outad/isshow` | `isEnable: 1` | `isEnable: 0`，`advertiserList: []` |
| `/rs/advertisement/adshow` | `isShow: 0/1` | `isShow: 0` |

## 抓包依据

`open.daobanzhushou.cn/rs/outad/isshow` 的真实响应：

```json
{
  "code": "1",
  "data": {
    "timeInterval": 5,
    "advertiserCode": 11,
    "advertiserList": [
      {"sortNo": 1, "destTable": "AdvertisementOutShowOrder", "advertiserCode": 21, "adPlaceSid": 211, "version": 1, "sid": 29},
      {"sortNo": 2, "destTable": "AdvertisementOutShowOrder", "advertiserCode": 11, "adPlaceSid": 211, "version": 1, "sid": 44}
    ],
    "isEnable": 1
  }
}
```

`isEnable: 1` 即广告开启。改写为 `0` 并清空列表后，App 无广告可拉取。

## 排查

如果广告还在：

1. **确认 MITM 已开启** — Surge 首页 → 中间人 → 打开 HTTPS 解密
2. **确认证书已信任** — 设置 → 通用 → 关于本机 → 证书信任设置
3. **确认模块已启用** — Surge 首页 → 模块列表
4. **看 Surge 日志** — 搜索 `daobanzhushou`，确认脚本是否命中
5. **重启 App** — 部分 SDK 初始化时会缓存广告配置

如果只是域名拦截没生效，检查 `[Rule]` 是否在规则列表前面（被其他规则抢先匹配）。

## 注意

- 本模块仅用于个人网络环境下的广告过滤，不修改 App 本体
- App 更新后接口可能变化，若失效请重新抓包
- 与已安装的其他去广告模块可能冲突（同域名规则先后顺序）

## License

MIT
