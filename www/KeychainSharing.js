var exec = require("cordova/exec");
module.exports = {
  get: function (options, onSuccess, onError) {
    exec(onSuccess, onError, "KeychainSharing", "get", [options]);
  },
  set: function (options, onSuccess, onError) {
    exec(onSuccess, onError, "KeychainSharing", "set", [options]);
  },
  remove: function (options, onSuccess, onError) {
    exec(onSuccess, onError, "KeychainSharing", "remove", [options]);
  }
};