(function() {

  module.exports = {
    bindRecordSettingForPage: bindRecordSettingForPage,
  }

  function bindRecordSettingForPage(page, detector) {
    page.onOpenRecordPermission = function(callback) {
      this._openSettingCallback = callback;
      //打开设置页，文字可以自行修改
      this.setData({
        isOpenSetting: true,
        settingPrompt: "提示",
        settingContent: "检测信标只需要录音1秒钟,您可以在微信右上角查看录音状态,我们保证不会收集您的任何个人隐私.",
        settingOpen: "打开权限",
        settingNotOpen: "不打开",
      });
    }.bind(page);

    page.cancelOpenSetting = function() {
      if (this.data.isOpenSetting) {
        this.setData({
          isOpenSetting: false,
        });
        if (this._openSettingCallback) {
          this._openSettingCallback(false);
          this._openSettingCallback = null;
        }
      }
    }.bind(page);

    page.backFromSetting = function() {
      if (this.data.isOpenSetting) {
        this.setData({
          isOpenSetting: false,
        });
        if (this._openSettingCallback) {
          this._openSettingCallback(true);
          this._openSettingCallback = null;
        }
      }
    }.bind(page);

    detector.setRecordPermissionCallback(page.onOpenRecordPermission);
  }

})();