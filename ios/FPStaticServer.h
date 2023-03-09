#import <React/RCTBridgeModule.h>

// GCDWebServer: https://github.com/swisspol/GCDWebServer
#import "GCDWebServer.h"
#import "GCDWebUploader.h"
#import "GCDWebServerFunctions.h"
#import "GCDWebServerFileResponse.h"
#import "GCDWebServerHTTPStatusCodes.h"

@interface FPStaticServer : NSObject <RCTBridgeModule> {
    GCDWebServer* _webServer;
    GCDWebUploader* _webUploader;
}

    @property(nonatomic, retain) NSString *localPath;
    @property(nonatomic, retain) NSString *url;

    @property (nonatomic, retain) NSString* www_root;
    @property (nonatomic, retain) NSNumber* port;
    @property (assign) BOOL localhost_only;
    @property (assign) BOOL keep_alive;

@end
  
