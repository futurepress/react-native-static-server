declare module 'react-native-static-server' {
  type Options = {
    localOnly?: boolean;
    keepAlive?: boolean;
    extension?: string;
    mimeType?: string;
  };

  export default class StaticServer {
    constructor(port: number, root?: string, opts?: Options,);

    port: number;
    root: string;
    localOnly: boolean;
    keepAlive: boolean;
    started: boolean;
    _origin?: string;
    extension?: string;
    mimeType?: string;

    start: () => Promise<string>;
    stop: () => Promise<any>;
    isRunning: () => Promise<boolean>;
    kill: () => void;
  }
}
