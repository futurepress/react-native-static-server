/**
 * Sample React Native Static Server
 * https://github.com/futurepress/react-native-static-server
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  WebView,
  Image,
} from 'react-native';

import StaticServer from 'react-native-static-server';
import RNFS from 'react-native-fs';

type Props = {};
export default class App extends Component<Props> {

  constructor(opts) {
    super();

    this.state = {
      origin: ''
    }
  }

  componentWillMount() {
    this.port = this.props.port || 3030;
    this.root = this.props.root || "www/";
    this.file = this.props.file || './index.html';

    // Get HTML file from require
    let html = require('./index.html');
    let {uri} = Image.resolveAssetSource(html);

    let path = RNFS.DocumentDirectoryPath + '/www';

    // Add the directory
    RNFS.mkdir(path, { NSURLIsExcludedFromBackupKey: true });

    // Fetch the file
    let download = RNFS.downloadFile({
      fromUrl: uri,
      toFile: path + "/index.html"
    })

    download.promise.then(() => {
      // Create a StaticServer at port 3030
      this.server = new StaticServer(this.port, this.root, {localOnly: true, keepAlive: true});

      return this.server.start().then((origin) => {
        this.setState({origin});
      });
    })

  }

  componentWillUnmount() {
    if (this.server) {
      this.server.kill();
    }
  }

  render() {

    if (!this.state.origin) {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <WebView
        source={{uri: `${this.state.origin}/index.html`}}
        style={styles.webview}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  webview: {
    marginTop: 20,
    flex: 1,
  }
});
