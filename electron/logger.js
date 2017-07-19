'use strict';
const dateFormat = require('dateformat');
const winston = require('winston')
const path = require('path')
const mkdirp = require('mkdirp')

const app = process.type === 'browser' ?
    require('electron').app :
    require('electron').remote.app;

const logDir = path.resolve(app.getPath('userData'), 'logs');


var logDate = dateFormat(new Date(), 'yyyymmdd');
var logFileName = path.resolve(logDir, logDate + '.log');
// const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logLevel = 'debug';

const levels = {
    'debug': 0,
    'info': 1,
    'warn': 2,
    'error': 3
};

const d = (level, message) => {
    if (levels[level] >= levels[logLevel]) {
        const consoleLevel = level === 'debug' ? 'log' : level;
        console[consoleLevel](message);
    }
};

// ensure the log dir exists
try {
    mkdirp.sync(logDir);
} catch (e) {
    d('error', e);
}

const meta = {
    electronVersion: process.versions.electron,
    appVersion: app.getVersion()
};

function Logger() {
    this.logger = new winston.Logger();
    this.logger.add(winston.transports.File, {
        level: logLevel,
        filename: logFileName,
        timestamp: function() { 
            var _date = new Date();
            return dateFormat(_date, 'yyyy-mm-dd HH:MM:ss');
        }
    });
    return this;
}

Logger.prototype.debug = function debug(message) {
    d('debug', message);
    return this.logger.debug(message, meta);
};

Logger.prototype.info = function info(message) {
    d('info', message);
    return this.logger.info(message, meta);
};

Logger.prototype.warn = function warn(message) {
    d('warn', message);
    return this.logger.warn(message, meta);
};

Logger.prototype.error = function error(message) {
    d('error', message);
    return this.logger.error(message, meta);
};

module.exports = new Logger();