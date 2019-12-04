//app.js
App({
  detector: requirePlugin("euphonyqr"),
  openRecordSetting: require("pages/openSettingTemp/openSettingTemp.js"),//用户拒绝录音授权后会弹出提示框，每次运行只会打开一次
  onLaunch: function () {
    
    var config = this.detector.getConfig();//此方法返回默认config
    console.log(config);
    this.detector.init({
      //这只是个demo,请联系动听获取appkey,同时布署自己的buyfull token service
      appKey: "75ba120532f44aa7a8cd431a2c2a50ef",
      buyfullTokenUrl: "https://sandbox.euphonyqr.com/testycq2/buyfulltoken",
      // abortTimeout: 3000,//单次网络请求超时
      //detectTimeout: 6000,//总超时
      debugLog: true,//true可以打开debugLog
      //channelMask: (this.detector.channelMask.CHANNEL_A | this.detector.channelMask.CHANNEL_B | this.detector.channelMask.CHANNEL_C | this.detector.channelMask.CHANNEL_D), //可以选择是否只针对4信道中的某几个录音
      //limitDB: -125,//当手机录音的分贝数低于此值时不上传检测
      // pauseAfterDetect: false, //检测完成后是否停止录音，设为false可提高检测速度，适合需要一直检测的场景
      // startBoost: false,//第一次检测时加速，适合只需要检测一次成功值的场景
      //retryBeforeTimeout: true,//如果没有检测结果，在没有超时前，自动重试
    });
  },
  globalData: {
    userInfo: null
  }
})