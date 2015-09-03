Keychain Sharing Cordova plugin
===============================

This plugin allows you to share data between your apps (with different bundle ID's) by leveraging iOS Keychain Sharing.

The trick is to use the same shared bundle id which (from experience) should be one of your app's bundle id's. Example:

App A:
```
cordova create keychainsharingb com.telerik.plugindemo.keychainsharinga
cordova plugin add cordova-plugin-keychainsharing --variable SHARED_BUNDLE_ID=com.telerik.plugindemo.keychainsharinga
```

App B:
```
cordova create keychainsharingb com.telerik.plugindemo.keychainsharingb
cordova plugin add cordova-plugin-keychainsharing --variable SHARED_BUNDLE_ID=com.telerik.plugindemo.keychainsharinga
```

Note that the value for `SHARED_BUNDLE_ID` above is identical.