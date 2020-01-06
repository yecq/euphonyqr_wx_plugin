//app.js
App({
  detector: requirePlugin("euphonyqr"),
  openRecordSetting: require("pages/openSettingTemp/openSettingTemp.js"),//用户拒绝录音授权后会弹出提示框，每次运行只会打开一次
  onLaunch: function () {
    
    var config = this.detector.getConfig();//此方法返回默认config
    console.log(config);
    this.detector.init({
      // abortTimeout: 3000,//单次网络请求超时
      //detectTimeout: 6000,//总超时
      //debugLog: true,//true可以打开debugLog
      //limitDB: -125,//当手机录音的分贝数低于此值时不上传检测
      // pauseAfterDetect: false, //检测完成后是否停止录音，设为false可提高检测速度，适合需要一直检测的场景
      // startBoost: false,//第一次检测时加速，适合只需要检测一次成功值的场景
      //retryBeforeTimeout: true,//如果没有检测结果，在没有超时前，自动重试
    });
    this.getToken();//获取token
  },

  //获取token，此方法只做DEMO，请自行布署token的service url
  getToken: function () {
    var thiz = this;
    var params = {
      "nocache": Math.random() * 10000000000,
      "appkey": this.globalData.appKey
    };

    wx.request({
      url: "https://sandbox.euphonyqr.com/testycq2/buyfulltoken",
      data: params,
      success: function (res) {
        if (res.statusCode != 200) {
          console.error("error in fetch token");
          return;
        }
        thiz.globalData.token = res.data.token;
      },
      fail: function (error) {
        debugLog("request token error");
        debugLog(JSON.stringify(error));
        setTimeout(function () {
          thiz.getToken();
        }, 1000);
      }
    });
  },

  globalData: {
    appKey: "75ba120532f44aa7a8cd431a2c2a50ef",
    token: null
  }
})