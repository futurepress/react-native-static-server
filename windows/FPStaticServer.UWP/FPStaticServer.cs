using ReactNative.Bridge;
using Restup.Webserver;
using Restup.Webserver.File;
using Restup.Webserver.Http;
using Restup.WebServer.Logging;
using System;

namespace FPStaticServer
{
    public class FPStaticServer : ReactContextNativeModuleBase
    {
        public override string Name
        {
            get
            {
                return "FPStaticServer";
            }
        }

        public string localPath { get; private set; }
        public string url { get; private set; }

        public string www_root { get; private set; }
        public int port { get; private set; }
        public bool localhost_only { get; private set; }
        public bool keep_alive { get; private set; }

        private HttpServer server;

        public FPStaticServer(ReactContext reactContext) : base(reactContext)
        {
        }

        [ReactMethod]
        public async void start(int port, string root, bool localOnly, bool keepAlive)
        {
            this.port = port;
            this.www_root = root.Replace('/', '\\');
            this.localhost_only = localOnly;
            this.keep_alive = keepAlive;

            var configuration = new HttpServerConfiguration()
              .ListenOnPort(port)
              .RegisterRoute(new StaticFileRouteHandler(www_root))
              .EnableCors();

            LogManager.SetLogFactory(new DebugLogFactory());

            server = new HttpServer(configuration);
            await server.StartServerAsync();
        }


        [ReactMethod]
        public void stop()
        {
            if (server != null)
                server.StopServer();
        }

        public override void OnReactInstanceDispose()
        {
            base.OnReactInstanceDispose();
            stop();
        }

        public void OnDestroy()
        {
            stop();
        }

        public async void OnResume()
        {
            if (server != null)
                await server.StartServerAsync();
        }

        public void OnSuspend()
        {
            stop();
        }
    }

    public class DebugLogger : AbstractLogger
    {
        protected override bool IsLogEnabled(LogLevel trace)
        {
            // Ignore level, log everything
            return true;
        }

        protected override void LogMessage(string message, LogLevel loggingLevel, Exception ex)
        {
            System.Diagnostics.Debug.WriteLine($"{loggingLevel}: {message}");
            System.Diagnostics.Debug.WriteLine($"{ex}");
        }

        protected override void LogMessage(string message, LogLevel loggingLevel, params object[] args)
        {
            System.Diagnostics.Debug.WriteLine($"{loggingLevel}: {(string.Format(message, args))}");
        }
    }

    public class DebugLogFactory : ILogFactory
    {
        private ILogger _debugLogger;

        public DebugLogFactory()
        {
            _debugLogger = new DebugLogger();
        }

        public void Dispose()
        {
            _debugLogger = null;
        }

        public ILogger GetLogger(string name)
        {
            return _debugLogger;
        }

        public ILogger GetLogger<T>()
        {
            return _debugLogger;
        }
    }
}
