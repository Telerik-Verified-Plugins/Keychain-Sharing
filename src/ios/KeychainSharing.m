#import "Cordova/CDV.h"
#import "Cordova/CDVViewController.h"
#import "KeychainSharing.h"
#import "UICKeyChainStore.h"

@implementation KeychainSharing

- (void) get:(CDVInvokedUrlCommand*)command {
  NSString *key = [self getProperty:@"key" withCommand:command];
  NSString *service = [self getProperty:@"service" withCommand:command];
  if (key != nil && service != nil) {
    NSString *val = [UICKeyChainStore stringForKey:key service:service];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:val] callbackId:command.callbackId];
  }
}

- (void) set:(CDVInvokedUrlCommand*)command {
  NSString *key = [self getProperty:@"key" withCommand:command];
  NSString *val = [self getProperty:@"val" withCommand:command];
  NSString *service = [self getProperty:@"service" withCommand:command];
  if (key != nil && val != nil && service != nil) {
    [UICKeyChainStore setString:val forKey:key service:service];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
  }
}

- (void) remove:(CDVInvokedUrlCommand*)command {
  NSString *key = [self getProperty:@"key" withCommand:command];
  NSString *service = [self getProperty:@"service" withCommand:command];
  if (key != nil && service != nil) {
    [UICKeyChainStore removeItemForKey:key service:service];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_OK] callbackId:command.callbackId];
  }
}

- (NSString*) getProperty:(NSString*)name withCommand:(CDVInvokedUrlCommand*)command {
  NSDictionary *args = [command.arguments objectAtIndex:0];
  NSString *prop = [args objectForKey:name];
  if (prop == nil) {
    NSString *msg = [NSString stringWithFormat:@"The '%@' property is mandatory", name];
    [self.commandDelegate sendPluginResult:[CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:msg] callbackId:command.callbackId];
    return nil;
  } else {
    return prop;
  }
}

@end