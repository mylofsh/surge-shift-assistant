// 倒班助手广告开关改写脚本
// 适用：Surge / Quantumult X / Loon (http-response)
// 作用：
//   /rs/outad/isshow        → isEnable = 0，清空 advertiserList
//   /rs/advertisement/adshow → isShow = 0

(function () {
  const body = $response.body || '';
  let obj;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    return $done({ body });
  }

  if (obj && obj.data && typeof obj.data === 'object') {
    // 广告位开关：isEnable = 1 表示显示广告
    if ('isEnable' in obj.data) {
      obj.data.isEnable = 0;
      obj.data.advertiserList = [];
    }
    // 广告展示开关：isShow = 1 表示展示
    if ('isShow' in obj.data) {
      obj.data.isShow = 0;
    }
  }

  $done({ body: JSON.stringify(obj) });
})();
