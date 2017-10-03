import {
	NativeModules,
	AppState,
	Platform
 } from 'react-native';

const { FPStaticServer } = NativeModules;

const PORT = '';
const ROOT = null;
const LOCALHOST = 'http://127.0.0.1:';

class StaticServer {
	constructor(port, root, opts) {
		switch (arguments.length) {
			case 3:
				this.port = `${port}` || PORT;
				this.root = root || ROOT;
				this.localOnly = (opts && opts.localOnly) || false;
				this.keepAlive = (opts && opts.keepAlive) || false;
				break;
			case 2:
				this.port = `${port}`;
				if (typeof(arguments[1]) === 'string') {
					this.root = root;
					this.localOnly = false;
					this.keepAlive = false;
				} else {
					this.root = ROOT;
					this.localOnly = (arguments[1] && arguments[1].localOnly) || false;
					this.keepAlive = (arguments[1] && arguments[1].keepAlive) || false;
				}
				break;
			case 1:
				if (typeof(arguments[0]) === 'number') {
					this.port = `${port}`;
					this.root = ROOT;
					this.localOnly = false;
					this.keepAlive = false;
				} else {
					this.port = PORT;
					this.root = ROOT;
					this.localOnly = (arguments[0] && arguments[0].localOnly) || false;
					this.keepAlive = (arguments[0] && arguments[0].keepAlive) || false;
				}
				break;
			default:
				this.port = PORT;
				this.root = ROOT;
				this.localOnly = false;
				this.keepAlive = false;
		}


		this.started = false;
	}

	start() {
		if( this.running ){
			return console.warn('StaticServer already running');
		}

		this.started = true;
		this.running = true;

		if (!this.keepAlive && (Platform.OS === 'android')) {
			AppState.addEventListener('change', this._handleAppStateChange.bind(this));
		}

		return FPStaticServer.start(this.port, this.root, this.localOnly, this.keepAlive);
	}

	stop() {
		if( !this.running ){
			return console.warn('StaticServer not running');
		}

		this.running = false;

		return FPStaticServer.stop();
	}

	kill() {
		this.stop();
		this.started = false;
		AppState.removeEventListener('change', this._handleAppStateChange.bind(this));
	}

	_handleAppStateChange(appState) {
		if (!this.started) {
			return;
		}

		if (appState === "active" && !this.running) {
			this.start();
		}

		if (appState === "background" && this.running) {
			this.stop();
		}

		if (appState === "inactive" && this.running) {
			this.stop();
		}
	}


}

export default StaticServer;
