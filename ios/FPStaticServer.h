#import <React/RCTBridgeModule.h>

@class HTTPServer;

@interface FPStaticServer : NSObject <RCTBridgeModule>
    @property(nonatomic, retain) HTTPServer *httpServer;
    @property(nonatomic, retain) NSString *localPath;
    @property(nonatomic, retain) NSString *url;

    @property (nonatomic, retain) NSString* www_root;
    @property (assign) int port;
    @property (assign) BOOL localhost_only;

    - (NSDictionary *)getIPAddresses;
    - (NSString *)getIPAddress:(BOOL)preferIPv4;
@end
  
