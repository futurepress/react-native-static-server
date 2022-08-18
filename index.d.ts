declare module 'react-native-static-server' {
  type Options = {
<<<<<<< HEAD
    localOnly?: boolean
    keepAlive?: boolean
    mimeTypeOverrides?: Record<string, string>
=======
    localOnly?: boolean;
    keepAlive?: boolean;
    mimeTypeOverrides?: Record<string, string>;
>>>>>>> d05a67501a63b4a14ecb6f3890cf9a96fbd7da9b
  };

  export default class StaticServer {
    constructor(port: number, root?: string, opts?: Options,);

<<<<<<< HEAD
    port: number
    root: string
    localOnly: boolean
    keepAlive: boolean
    started: boolean
    _origin?: string
    mimeTypeOverrides: Record<string, string>
=======
    port: number;
    root: string;
    localOnly: boolean;
    keepAlive: boolean;
    started: boolean;
    _origin?: string;
    mimeTypeOverrides: Record<string, string>;
>>>>>>> d05a67501a63b4a14ecb6f3890cf9a96fbd7da9b

    start: () => Promise<string>;
    stop: () => Promise<any>;
    isRunning: () => Promise<boolean>;
    kill: () => void;
  }
}
