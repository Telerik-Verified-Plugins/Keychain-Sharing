console.log("Running hook to add iOS Keychain Sharing entitlements");

var xcode = require('xcode'),
    fs = require('fs'),
    path = require('path'),
    plist = require('plist'),
    util = require('util');

  module.exports = function (context) {
  var Q = context.requireCordovaModule('q');
  var deferral = new Q.defer();

  if (context.opts.cordova.platforms.indexOf('ios') < 0) {
    throw new Error('This plugin expects the ios platform to exist.');
  }

  var iosFolder = context.opts.cordova.project ? context.opts.cordova.project.root : path.join(context.opts.projectRoot, 'platforms/ios/');
  console.log("iosFolder: " + iosFolder);

  fs.readdir(iosFolder, function (err, data) {
    if (err) {
      throw err;
    }

    var projFolder;
    var projName;

    // Find the project folder by looking for *.xcodeproj
    if (data && data.length) {
      data.forEach(function (folder) {
        if (folder.match(/\.xcodeproj$/)) {
          projFolder = path.join(iosFolder, folder);
          projName = path.basename(folder, '.xcodeproj');
        }
      });
    }

    if (!projFolder || !projName) {
      throw new Error("Could not find an .xcodeproj folder in: " + iosFolder);
    }

    console.log("Will add iOS Keychain Sharing entitlements to project '" + projName + "'");

    //var projectPlistPath = path.join(context.opts.projectRoot, 'platforms/ios', projName, util.format('%s-Info.plist', projName));
    var projectPlistPath = path.join(iosFolder, projName, util.format('%s-Info.plist', projName));
    var projectPlistJson = plist.parse(fs.readFileSync(projectPlistPath, 'utf8'));
    var sharedBundleID = projectPlistJson.KeychainSharingBundleID;
    console.log("KeychainSharingBundleID passed in as variable: " + sharedBundleID);

    // create a new entitlements plist file
    //var sourceFile = 'plugins/cordova-plugin-keychainsharing/src/ios/resources/KeychainSharing.entitlements';
    var sourceFile = path.join(context.opts.plugin.pluginInfo.dir, 'src/ios/resources/KeychainSharing.entitlements');
    fs.readFile(sourceFile, 'utf8', function (err, data) {
      data = data.replace(/__KEYCHAIN_ACCESS_GROUP__/g, sharedBundleID);
      console.log(data);

      //fs.writeFileSync('platforms/ios/' + projName + '/Resources/' + projName + '.entitlements', data);
      fs.writeFileSync(path.join(iosFolder, projName, 'Resources',  projName + '.entitlements'), data);

      var projectPath = path.join(projFolder, 'project.pbxproj');
      var pbxProject = xcode.project(projectPath);

      // parsing is async, in a different process
      pbxProject.parseSync();

      pbxProject.addResourceFile(projName + ".entitlements");

      var configGroups = pbxProject.hash.project.objects['XCBuildConfiguration'];
      for (var key in configGroups) {
        var config = configGroups[key];
        if (config.buildSettings !== undefined) {
          config.buildSettings.CODE_SIGN_ENTITLEMENTS = '"' + projName + '/Resources/' + projName + '.entitlements"';
          //console.log("Adding iOS Keychain Sharing entitlements to project '" + projName + "'");
        }
      }

      // write the updated project file
      fs.writeFileSync(projectPath, pbxProject.writeSync());
      console.log("OK, added iOS Keychain Sharing entitlements to project '" + projName + "'");

      deferral.resolve();
    });
  });

  return deferral.promise;
};
