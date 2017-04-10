package com.futurepress.staticserver;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import fi.iki.elonen.SimpleWebServer;

public class WebServer extends SimpleWebServer
{
    public WebServer(String localAddr, int port, File wwwroot) throws IOException {
        super(localAddr, port, wwwroot, true, "*");

        mimeTypes().put("xhtml", "application/xhtml+xml");
        mimeTypes().put("opf", "application/oebps-package+xml");
        mimeTypes().put("ncx", "application/xml");
        mimeTypes().put("epub", "application/epub+zip");
        mimeTypes().put("otf", "application/x-font-otf");
        mimeTypes().put("ttf", "application/x-font-ttf");
        mimeTypes().put("js", "application/javascript");
        mimeTypes().put("svg", "image/svg+xml");
    }

    @Override
    protected boolean useGzipWhenAccepted(Response r) {
        return super.useGzipWhenAccepted(r) && r.getStatus() != Response.Status.NOT_MODIFIED;
    }
}
