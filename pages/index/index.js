var app = getApp()
var detector = app.detector //请查看app.js
Page({
  reqid: null,
  onLoad: function () {
    //用户拒绝录音授权后会弹出提示框，每次运行只会打开一次
    //请把openSettingTemp中的模板import进来，具体请查看index.wxml和index.wxss
    //如果此页面没有调用录音功能，可以不加载此代码以及相应的模板
    app.openRecordSetting.bindRecordSettingForPage(this, detector); 
  },
  onHide: function () {
    detector.stop();//如果init时设置了pauseAfterDetect = false，则需要停止录音
  },
  onclick3: function () {
    detector.stop();//如果init时设置了pauseAfterDetect = false，则需要停止录音
  },
  onclick2: function () {
    if (this.reqid){
      detector.debugUpload(this.reqid);//可以上传给动听工作人员用来确认BUG
    }
  },
  onclick: function () {
    if (detector.isDetecting()) {
      return;//如果正在检测中，请等结束后再调用
    }
    if (!app.globalData.token) {
      console.error("please fetch token before request");
      return;
    }
    this.retryCount = 0;
    this.doDetect();
  },

  doDetect: function () {
    var thiz = this;
    detector.detect({
      "token": app.globalData.token
    }, function (result) {
      console.log("检测结束,结果是:" + JSON.stringify(result));
      thiz.reqid = result.record_id;
      if (result.count > 0) {
        wx.showModal({
          title: 'result is:',
          content: thiz.reqid,
        })
      } else {
        wx.showModal({
          title: 'result is null, power is (dB):',
          content: thiz.reqid,
        })
      }

    }, function (errorCode, errorMsg) {
      //检测有错误会回调
      console.error(errorMsg);
      if (errorCode == detector.error.NO_RECORD_PERMISSION) {
        //没有录音权限，提醒打开权限
        thiz.onOpenRecordPermission(function (hasGotoSetting) {
          if (hasGotoSetting) {
            //如果打开了权限页，重试录音
            thiz.doDetect();
          }
        });
        return;
      }
      //其它错误都可以重试
      if (--thiz.retryCount > 0) {
        console.log("retry count:" + thiz.retryCount);
        thiz.doDetect();
      } else {
        wx.showToast({
          title: 'error is: ' + errorMsg,
        })
      }
    });
  },
})
