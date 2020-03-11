var app = getApp()
var detector = app.detector //请查看detector.js
Page({
  recordID: null,
  onLoad: function () { },
  onShow: function () {
    //!!!!此方法可选，如果此页面没有调用录音功能，可以不加载此代码以及相应的模板！！！
    //用户拒绝录音授权后会弹出提示框，每次运行只会打开一次
    //请把openSettingTemp中的模板import进来，具体请查看index.wxml和index.wxss
    detector.onShowPage(this);
  },
  onHide: function () {
    detector.stop(); //如果init时设置了pauseAfterDetect = false，则需要停止录音
  },
  onclick3: function () {
    detector.stop(); //如果init时设置了pauseAfterDetect = false，则需要停止录音
  },
  onclick2: function () {
    detector.debugUpload(this.recordID); //可以上传给动听工作人员用来确认BUG
  },
  onclick: function () {
    if (detector.isDetecting()) {
      return; //如果正在检测中，请等结束后再调用
    }
    if (!detector.lastToken()) {
      //如果没有取得token，请先取得token后再调用。
      console.error("please fetch token before detect");
      detector.fetchToken();
      return;
    }
    this.doDetect();
  },

  doDetect: function (isRetry) {
    if (isRetry && !detector.isStarted()) {
      //stop后会回调，请小心处理自动retry
      return;
    }
    var thiz = this;
    detector.detect(function (result) {
      //正确返回
      console.log("检测结束,结果是:" + JSON.stringify(result));

      if (result.tags && result.tags.length > 0) {
        wx.showModal({
          title: 'result is:',
          content: result.tags[0],
        })
      }
    }, function (errorCode, errorMsg) {
      console.error(errorMsg);
      //检测有错误会回调
      if (errorMsg.indexOf("record_id:") != -1) {
        thiz.recordID = errorMsg.split(":")[1];//此ID可以上传给动听工作人员用来确认BUG
      }
      if (errorCode == detector.error.HAS_NO_RESULT) {
        //检测没有结果，或是调用stop后会回调，请小心处理自动retry
        thiz.doDetect(true);
      } else if (errorCode == detector.error.NO_RECORD_PERMISSION) {
        //没有录音权限，提醒打开权限
        thiz.onOpenRecordPermission(function (hasGotoSetting) {
          if (hasGotoSetting) {
            //如果打开了权限页，重试录音
            thiz.doDetect();
          }
        });
        return;
      } else if (errorCode == detector.error.TOKEN_ERROR) {
        //token错误，重新获取token，之后再重试
        detector.fetchToken(true,function () {
          thiz.doDetect(true);
        });
      } else {
        //如果没有调用stop，其它错误可以看情况重试，这里1秒后重试   
        setTimeout(function () {
          thiz.doDetect(true);
        }, 1000);
      }
    });
  },
})