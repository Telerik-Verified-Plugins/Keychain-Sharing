#import "Foundation/Foundation.h"
#import "Cordova/CDV.h"

@interface KeychainSharing : CDVPlugin

- (void) get:(CDVInvokedUrlCommand*)command;
- (void) set:(CDVInvokedUrlCommand*)command;
- (void) remove:(CDVInvokedUrlCommand*)command;

@end