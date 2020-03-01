//app.js
App({
  detector: require("utils/detector.js"),

  onLaunch: function () {
    this.detector.init({
      //debugLog: true,//true可以打开debugLog
    });
  },

})