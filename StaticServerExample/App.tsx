/**
 * Sample React Native Static Server
 * https://github.com/futurepress/react-native-static-server
 * @flow
 */

import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native'

// requires react-native-webview, see: https://github.com/uuidjs/uuid#getrandomvalues-not-supported
import 'react-native-get-random-values'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { v4 as uuidv4 } from 'uuid'
import StaticServer from 'react-native-static-server'
import RNFetchBlob from 'rn-fetch-blob'
import { WebView } from 'react-native-webview'

interface ITestViewProps {
  port?: number
  root?: string
  file?: string
  target?: any
}

export default function App (props: ITestViewProps): JSX.Element {
  const [origin, setOrigin] = useState<string>('')
  const [server, setServer] = useState<StaticServer>(null)
  const port = typeof props.port !== 'undefined' ? props.port : 3030
  const root = typeof props.root !== 'undefined' ? props.root : 'www/'
  const file = typeof props.file !== 'undefined' ? props.file : 'index.html'
  const target = typeof props.target !== 'undefined' ? props.target : require('./index.html')

  useEffect(() => {
    if (origin === '') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const index = target
      const { uri } = Image.resolveAssetSource(index)
      const path = RNFetchBlob.fs.dirs.DocumentDir + '/' + root
      const dest = path + file
      const startServer = async (): Promise<void> => {
        const newServer = new StaticServer(port, root, { localOnly: true })
        const origin = await newServer.start()
        setOrigin(origin)
        setServer(newServer)
      }
      const prepare = async (): Promise<void> => {
        try {
          await RNFetchBlob.fs.mkdir(path)
        } catch (e) {
          console.log(`directory is created ${path}`)
        }
        let added: Promise<boolean>
        if (uri.includes('file://')) {
          // Copy file in release
          const result = await RNFetchBlob.fs.exists(dest)
          if (!result) {
            added = RNFetchBlob.fs.cp(uri, dest)
          }
        } else {
          // Download for development
          const result = await RNFetchBlob.config({ fileCache: true }).fetch('GET', uri)
          added = RNFetchBlob.fs.mv(result.path(), dest)
        }
        try {
          await added
        } catch (e) {
          console.log(e)
        }
        await startServer()
      }
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      prepare()
      return () => {
        if (server !== null) {
          server.kill()
        }
      }
    }
  }, [])

  if (origin !== '') {
    return <WebView
      source={{ uri: `${origin}/${file}` }}
      style={styles.webview}
    />
  }
  return <View style={styles.container}>
    <Text>Loading...</Text>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  webview: {
    marginTop: 20,
    flex: 1
  }
})
