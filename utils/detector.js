(function () {

  var detector = requirePlugin("euphonyqr");
  

  module.exports = {
    init: init,
    fetchToken: fetchToken,
    onShowPage: onShowPage,//此方法可选
    detect: detect,
    stop: stop,
    debugUpload: detector.debugUpload,
    lastToken: lastToken,
    lastResult: lastResult,
    isDetecting: isDetecting,
    isStarted: isStarted,
    error: detector.error,
  }

  var globalData = {
    //以下为DEMO配置布署，客户需自行替换布署
    appKey: "75ba120532f44aa7a8cd431a2c2a50ef",
    tokenURL: "https://sandbox.euphonyqr.com/testycq3/euphonyqr_token",
    detectURL: "https://sandbox.euphonyqr.com/testycq3/euphonyqr_token_result",
    token: null,
    lastResult: null,
    detectStarted: false,
    isFetchingDetectResult: false,
  }

  function init(options) {
    var config = detector.getConfig();//此方法返回默认config
    console.log(config);
    detector.init(options);
    fetchToken();//获取token
  };

  function isDetecting() {
    return detector.isDetecting() || globalData.isFetchingDetectResult;
  }

  function isStarted() {
    return globalData.detectStarted;
  }

  function detect(success, fail) {
    if (isDetecting()) {
      fail(detector.error.DUPLICATE_DETECT, "调用太频繁");
      return;
    }
    globalData.detectStarted = true;

    detector.detect({
      "token": globalData.token
    }, function (urlresult) {
      //把URL发送给自己的业务服务器，让它去查询结果
      fetchDetectResult(urlresult, this.success, this.fail);
    }.bind({
      success: success,
      fail: fail,
    }), fail);
  };

  function stop() {
    globalData.detectStarted = false;
    detector.stop();
  };

  function lastToken() {
    return globalData.token;
  }

  function lastResult() {
    return globalData.lastResult;
  }

  function fetchToken(refresh,callback) {
    //此处参数格式为DEMO，请自行修改
    var params = {
      "nocache": Math.random() * 10000000000,
      "appkey": globalData.appKey,
      "refresh": refresh,
    };
    console.log("fetch token: " + globalData.tokenURL);
    wx.request({
      url: globalData.tokenURL,
      data: params,
      success: function (res) {
        if (res.statusCode != 200) {
          console.error("error in fetch token");
          return;
        }
        console.log("token is: " + res.data.token);
        globalData.token = res.data.token;
        //如果成功获得token就回调
        if (callback) {
          callback();
        }
      },
      fail: function (error) {
        console.error("request token error");
        console.error(JSON.stringify(error));
        //1秒后自动重试
        setTimeout(function () {
          fetchToken(callback);
        }, 1000);
      }
    });
  };

  function fetchDetectResult(_url, _success, _fail) {
    //此处参数格式为DEMO，请自行修改
    var params = {
      "nocache": Math.random() * 10000000000,
      "appkey": globalData.appKey,
      "url": _url,
      "platform": "wx_app"
    };
    if (globalData.isFetchingDetectResult) {
      return;
    }
    globalData.isFetchingDetectResult = true;
    console.log("fetch detect result: " + globalData.detectURL);
    console.log(params);
    wx.request({
      url: globalData.detectURL,
      data: params,
      success: function (res) {
        globalData.isFetchingDetectResult = false;
        //此处返回格式为DEMO，请自行修改
        console.log(res.data);
        if (_success) {
          _success(res.data);
        }
      },
      fail: function (error) {
        globalData.isFetchingDetectResult = false;
        console.error("fetch detect result error");
        console.error(JSON.stringify(error));
        if (_fail) {
          _fail(error);
        }
      }
    });
  };

  //!!!!此方法可选，如果此页面没有调用录音功能，可以不加载此代码以及相应的模板！！！
  //用户拒绝录音授权后会弹出提示框
  //请把openSettingTemp中的模板import进来，具体请查看index.wxml和index.wxss
  var openRecordSetting = null;
  function onShowPage(page) {
    if (!openRecordSetting) {
      //用户拒绝录音授权后会弹出提示框
      openRecordSetting = require("../pages/openSettingTemp/openSettingTemp.js");
    }
    openRecordSetting.bindRecordSettingForPage(page, detector);
  }
})();