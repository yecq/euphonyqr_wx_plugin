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
    this.doDetect();
  },

  doDetect: function () {
    var thiz = this;
    detector.detect({
      version: "v2", //针对qieshu.net上的帐号请使用v2
      openID: "", //可选，字符串，微信后台返回
      unionID: "", //可选，字符串，微信后台返回
      phoneNumber: "", //可选，字符串，openid,unionid,phonenumber中可以任意给一个或多个，可以给后台报表数据中作为统计数据的一个参数,没有将无法获得后台统计数据
      customData: ""//,可选，字符串，可以给后台报表数据中作为统计数据回传
    }, function (result) {
      console.log("检测结束,结果是:" + JSON.stringify(result));
      thiz.reqid = result.reqid;
      if (result.count > 0) {
        wx.showModal({
          title: 'result is:',
          content: JSON.stringify(result.allTags),
        })
      } else {
        wx.showModal({
          title: 'result is null, power is (dB):',
          content: result.sortByPowerResult[0].power + "|" + result.sortByPowerResult[1].power,
        })
      }
    }, function (errorCode, errorMsg) {
      //检测有错误会回调
      //errorcode 定义请查看 "buyfullsdk.js"
      console.error(errorMsg);
      if (errorCode == detector.error.NO_RECORD_PERMISSION) {
        //没有录音权限，提醒打开权限
        wx.authorize({
          scope: 'scope.record',
          success: function(res2){
            console.log(res2);
            thiz.doDetect();
          },fail: function(err){
            thiz.onOpenRecordPermission(function (hasGotoSetting) {
              if (hasGotoSetting) {
                //如果打开了权限页，重试录音
                thiz.doDetect();
              }
            });
            return;
          }
        })
        return;
      }
      //其它错误都可以重试
      setTimeout(function(){
        thiz.doDetect();
      },1000);
    });
  },
})
