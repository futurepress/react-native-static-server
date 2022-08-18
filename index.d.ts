declare module 'pb-react-native-static-server' {
  type Options = {
    localOnly?: boolean;
    keepAlive?: boolean;
    overridesMimeType?: Record<string, string>;

  };

  export default class StaticServer {
    constructor(port: number, root?: string, opts?: Options,);

    port: number;
    root: string;
    localOnly: boolean;
    keepAlive: boolean;
    started: boolean;
    _origin?: string;
    overridesMimeType: Record<string, string>;


    start: () => Promise<string>;
    stop: () => Promise<any>;
    isRunning: () => Promise<boolean>;
    kill: () => void;
  }
}
