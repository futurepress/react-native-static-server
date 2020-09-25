declare module 'react-native-static-server' {
  type Options = {
    localOnly?: boolean
    keepAlive?: boolean
  }

  export default class StaticServer {
    constructor(port: number, root?: string, opts?: Options)

    port: number
    root: string
    localOnly: boolean
    keepAlive: boolean
    started: boolean

    start: () => Promise<string>
    stop: () => Promise<any>
    isRunning: () => Promise<boolean>
    getOrigin: () => Promise<string>
    kill: () => void
  }
}