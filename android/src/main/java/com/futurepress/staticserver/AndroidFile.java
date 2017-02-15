package com.futurepress.staticserver;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Date;

import android.content.res.AssetManager;
import android.util.Log;

public class AndroidFile extends File {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private final String LOGTAG = "AndroidFile";
	
	private String __path = "";
	private AssetManager __am = null;

	/*
	 * constructors
	 */
	public AndroidFile(AndroidFile dir, String name) {
		super(dir, name);
		__path = this.getPath();
		__am = dir.getAssetManager();
		//System.out.println( String.format("%s + %s => %s", dir.getPath(), name, __path) );
	}
	
	public AndroidFile(String path) {
		super(path);
		
		__path = path;
		//Log.w(LOGTAG, path);
	}
	
	public AndroidFile(String dirPath, String name) {
		super(dirPath, name);
		__path = this.getPath();
	}
	
	public AndroidFile(URI uri) {
		super(uri);
		__path = uri.getRawPath();
	}
	
	/*
	 * getter & setter
	 */
	public void setAssetManager(AssetManager am) {
		__am = am;
	}
	
	public AssetManager getAssetManager() {
		return __am;
	}
	
	public boolean isAsset() {
		return (__am != null) && (! __path.startsWith("/"));
	}
	
	/*
	 * override
	 */
	@Override
	public boolean isDirectory() {
		if(isAsset()) {
			try {
				String[] files = __am.list(__path);
				
				//for(int i=0; i<files.length; i++) Log.w(LOGTAG, files[i]);
				//Log.w(LOGTAG, String.format("isDirectory: %s, %d", __path, files.length));
				
				// if __path is a file, no IO exception, so we judge the number of files
				// so when we get a empty folder, it might be a problem.
				return files.length > 0;
				
			} catch (IOException e) {
				return false;
			} 
		}

		return super.isDirectory();
	}

	@Override
	public boolean isFile() {
		if(isAsset()) {
			try {
				InputStream is = __am.open(__path);
				is.close();
				return true;
			} catch (IOException e) {
				return false;
			} 
		}

		return super.isFile();
	}
	
	@Override
	public boolean exists() {
		if(isAsset()) {
			return isFile() || isDirectory();
		}

		return super.exists();
	}
	
	@Override
	public boolean canRead() {
		if(isAsset()) {
			return isFile() || isDirectory();
		}
		
		return super.canRead();
	}
	
	@Override
	public String[] list() {
		if(isAsset()) {
			try {
				return __am.list(__path);
			} catch (IOException e) {
			}
			String[] empty = {};
			return empty;
		}
		
		return super.list();
	}

	@Override
	public String getCanonicalPath() throws IOException {
		if(isAsset()) {
			return __path;
		}
		
		return super.getCanonicalPath();
	}
	
	@Override
	public String getAbsolutePath() {
		if(isAsset()) {
			return __path;
		}
		
		return super.getAbsolutePath();
	}
	
	@Override
	public long lastModified() {
		if(isAsset()) {
			Date now = new Date();
			return now.getTime() - 1000 * 3600 * 24; // 24 hour ago
		}
		
		return super.lastModified();
	}
	
	@Override
	public long length() {
		if(isAsset()) {
			//Log.w(LOGTAG, __path);
			long len = 0;
			try {
				InputStream is = __am.open(__path);
				len = is.available();
				is.close();
			} catch (IOException e) {
				Log.w(LOGTAG, String.format("IOException: %s", e.getMessage()) );
			}
			return len;
		}
		
		return super.length();
	}
	
	public InputStream getInputStream() throws IOException {
		if(isAsset()) {
			return __am.open(__path );
		}
		
		return new FileInputStream( this );
	}
}
