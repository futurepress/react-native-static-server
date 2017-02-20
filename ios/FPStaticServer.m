#import "FPStaticServer.h"

#include <ifaddrs.h>
#include <arpa/inet.h>
#include <net/if.h>

#define IOS_CELLULAR    @"pdp_ip0"
#define IOS_WIFI        @"en0"
#define IP_ADDR_IPv4    @"ipv4"
#define IP_ADDR_IPv6    @"ipv6"

#define OPT_WWW_ROOT        @"www_root"
#define OPT_PORT            @"port"
#define OPT_LOCALHOST_ONLY  @"localhost_only"

#define IP_LOCALHOST        @"127.0.0.1"
#define IP_ANY              @"0.0.0.0"

#import "HTTPServer.h"
#import "DDLog.h"
#import "DDTTYLogger.h"

@implementation FPStaticServer

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

- (dispatch_queue_t)methodQueue
{
    return dispatch_queue_create("com.futurepress.staticserver", DISPATCH_QUEUE_SERIAL);
}

- (NSString *)getIPAddress:(BOOL)preferIPv4
{
    NSArray *searchArray = preferIPv4 ?
    @[ IOS_WIFI @"/" IP_ADDR_IPv4, IOS_WIFI @"/" IP_ADDR_IPv6, IOS_CELLULAR @"/" IP_ADDR_IPv4, IOS_CELLULAR @"/" IP_ADDR_IPv6 ] :
    @[ IOS_WIFI @"/" IP_ADDR_IPv6, IOS_WIFI @"/" IP_ADDR_IPv4, IOS_CELLULAR @"/" IP_ADDR_IPv6, IOS_CELLULAR @"/" IP_ADDR_IPv4 ] ;

    NSDictionary *addresses = [self getIPAddresses];
    NSLog(@"addresses: %@", addresses);

    __block NSString *address;
    [searchArray enumerateObjectsUsingBlock:^(NSString *key, NSUInteger idx, BOOL *stop)
     {
         address = addresses[key];
         if(address) *stop = YES;
     } ];
    return address ? address : IP_ANY;
}

- (NSDictionary *)getIPAddresses
{
    NSMutableDictionary *addresses = [NSMutableDictionary dictionaryWithCapacity:8];

    // retrieve the current interfaces - returns 0 on success
    struct ifaddrs *interfaces;
    if(!getifaddrs(&interfaces)) {
        // Loop through linked list of interfaces
        struct ifaddrs *interface;
        for(interface=interfaces; interface; interface=interface->ifa_next) {
            if(!(interface->ifa_flags & IFF_UP) /* || (interface->ifa_flags & IFF_LOOPBACK) */ ) {
                continue; // deeply nested code harder to read
            }
            const struct sockaddr_in *addr = (const struct sockaddr_in*)interface->ifa_addr;
            char addrBuf[ MAX(INET_ADDRSTRLEN, INET6_ADDRSTRLEN) ];
            if(addr && (addr->sin_family==AF_INET || addr->sin_family==AF_INET6)) {
                NSString *name = [NSString stringWithUTF8String:interface->ifa_name];
                NSString *type;
                if(addr->sin_family == AF_INET) {
                    if(inet_ntop(AF_INET, &addr->sin_addr, addrBuf, INET_ADDRSTRLEN)) {
                        type = IP_ADDR_IPv4;
                    }
                } else {
                    const struct sockaddr_in6 *addr6 = (const struct sockaddr_in6*)interface->ifa_addr;
                    if(inet_ntop(AF_INET6, &addr6->sin6_addr, addrBuf, INET6_ADDRSTRLEN)) {
                        type = IP_ADDR_IPv6;
                    }
                }
                if(type) {
                    NSString *key = [NSString stringWithFormat:@"%@/%@", name, type];
                    addresses[key] = [NSString stringWithUTF8String:addrBuf];
                }
            }
        }
        // Free memory
        freeifaddrs(interfaces);
    }
    return [addresses count] ? addresses : nil;
}

RCT_EXPORT_METHOD(start: (NSString *)port
                  root:(NSString *)optroot
                  localOnly:(BOOL *)localhost_only
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {

    NSString * root;

    if( [optroot isEqualToString:@"DocumentDir"] ){
        root = [NSString stringWithFormat:@"%@", [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0] ];
    } else if( [optroot isEqualToString:@"BundleDir"] ){
        root = [NSString stringWithFormat:@"%@", [[NSBundle mainBundle] bundlePath] ];
    } else if([optroot hasPrefix:@"/"]) {
        root = optroot;
    } else {
        root = [NSString stringWithFormat:@"%@/%@", [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0], optroot ];
    }


    if(root) self.www_root = root;

    if(port) self.port = [port intValue];

    self.localhost_only = localhost_only;

    if(self.httpServer != nil) {
        if([self.httpServer isRunning]) {
            NSError *error = nil;
            reject(@"server_error", @"server is already up", error);
            return;
        }
    }

    [DDLog addLogger:[DDTTYLogger sharedInstance]];
    self.httpServer = [[HTTPServer alloc] init];

    [self.httpServer setPort:self.port];

    if(self.localhost_only) [self.httpServer setInterface:IP_LOCALHOST];

    //self.localPath = self.www_root;

    // NSLog(@"Setting document root: %@", self.www_root);
    [self.httpServer setDocumentRoot:self.www_root];


    NSError *error;
    if([self.httpServer start:&error]) {
        int listenPort = [self.httpServer listeningPort];
        NSString* ip = self.localhost_only ? IP_LOCALHOST : [self getIPAddress:YES];
        NSLog(@"Started httpd on port %d", listenPort);

        self.url = [NSString stringWithFormat:@"http://%@:%d", ip, listenPort];
        resolve(self.url);

    } else {
        NSLog(@"Error starting httpd: %@", error);

        //        NSString* errmsg = [error description];
        reject(@"server_error", @"server could not start", error);

    }

}

RCT_EXPORT_METHOD(stop) {
    if(self.httpServer != nil) {

        [self.httpServer stop];
        self.httpServer = nil;

        self.www_root = @"";
        self.url = @"";

        NSLog(@"httpd stopped");
    }
}


@end
