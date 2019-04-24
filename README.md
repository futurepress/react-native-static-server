
# react-native-static-server

A cross platform component for serving static assets with React Native.

## Getting started

`$ npm install react-native-static-server --save`

### Installation

`$ react-native link react-native-static-server`

## Linking

### Automatically (Recommend)

````bash
react-native link react-native-static-server
````

### Manually

#### iOS

Refer to the [official guide](https://facebook.github.io/react-native/docs/linking-libraries-ios.html)

Link `libFPStaticServer.a` as stated in the official RN guide.

![alt Link libFPStaticServer.a as stated in the official RN docs](https://user-images.githubusercontent.com/1566400/40619974-b5c538c6-625c-11e8-9742-309255a311aa.png)

#### Android

* Edit `android/app/src/main/java/com/munisight/MainApplication.java` to look like this (without the +):

  ```diff
   import com.corbt.keepawake.KCKeepAwakePackage;
  + import com.futurepress.staticserver.FPStaticServerPackage;

  import java.util.Arrays;
  import java.util.List;

  public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        ...

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new KCKeepAwakePackage(),
  +                 new FPStaticServerPackage()
            );
        }

        ...
    };

    ...
  }
  ```

* Edit `android/settings.gradle` to look like this (without the +):

  ```diff
  rootProject.name = 'MyApp'

  include ':app'

  + include ':react-native-static-server'
  + project(':react-native-static-server').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-static-server/android')
  ```

* Edit `android/app/build.gradle` (note: **app** folder) to look like this:

  ```diff
  apply plugin: 'com.android.application'

  android {
    ...
  }

  dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile 'com.android.support:appcompat-v7:23.0.0'
    compile 'com.facebook.react:react-native:0.16.+'
  + compile project(':react-native-static-server')
  }
  ```

## Usage

Declare the `StaticServer` with a port or use the default `0` to pick a random available port.

```javascript
import StaticServer from 'react-native-static-server';

let server = new StaticServer(8080);

// Start the server
server.start().then((url) => {
  console.log("Serving at URL", url);
});

// Stop the server
server.stop();
```

`StaticServer` serves from the document directory (default) or takes an optional absolute path to serve from.

For instance, using [react-native-fs](https://github.com/johanneslumpe/react-native-fs) you can get the document directory and specify a directory from there.

#### Default (document directory)

```javascript
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

// create a path you want to write to
let path = RNFS.DocumentDirectoryPath + '/www';

let server = new StaticServer(8080, path);
```

#### Custom folder (iOS)

##### Create the folder for static files

Create a folder in your project's top-level directory (usually next to your node_modules and index.js file), and put the files you want to access over http in there.

##### Add folder (static files) to XCode

This folder **must be added to XCode** so it gets bundled with the app.

In XCode, `Project Navigator` right click in the folder project → `Add files to "<project>"` → Select the static folder **and clic options (Uncheck copy items if needed, Create folder references)** so don't duplicate files → Clic Add.

When the app gets bundled, this folder will be next to the compiled app, so using `MainBundlePath` property from `react-native-fs` you can access to the directory.

```javascript
import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

// path where files will be served from (index.html here)
let path = RNFS.MainBundlePath + '/www';

let server = new StaticServer(8080, path);
```

If the server should only be accessible from within the app, set `localOnly` to `true`

```javascript
import StaticServer from 'react-native-static-server';

// Just set options with defaults
let server = new StaticServer({localOnly : true });
// Or also valid are:
let server = new StaticServer(8080, {localOnly : true });
let server = new StaticServer(8080, path, {localOnly : true });

```

If the server should not pause when the app is in the background, set `keepAlive` to `true`

```javascript
let server = new StaticServer({keepAlive : true });
```

Passing `0` as the port number will cause a random port to be assigned every time the server starts.
It will reset to a new random port each time the server unpauses, so this should only be used with `keepAlive`.

```javascript
let server = new StaticServer(0, {keepAlive : true });
```

## Credits

* iOS server: [GCDWebServer](https://github.com/swisspol/GCDWebServer)
* Android server: [NanoHttpd Webserver](https://github.com/NanoHttpd/nanohttpd)

Thanks to [CorHttpd](https://github.com/floatinghotpot/cordova-httpd) and [react-native-httpserver](https://gitlab.com/base.io/react-native-httpserver#README) for the basis of this library.
