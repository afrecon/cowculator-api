"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
const Logger = require("bunyan");
const BunyanLoggly = require("bunyan-loggly");
const stream_correlation_id_decorator_1 = require("../middleware/stream-correlation-id-decorator");
//import { StreamCorrelationIdDecorator } from '..//middleware/stream-correlation-id-decorator'
const HTTPContext = require("express-http-context");
/**
 * Logger factory produces named logger instance based of an initial application level logger
 */
class LoggerFactory {
    /**
     * @constructor
     */
    constructor(configuration) {
        const options = {
            level: configuration.level,
            name: configuration.service,
            streams: [
                {
                    type: 'raw',
                    stream: this.getRawStream(configuration)
                }
            ]
        };
        this.logger = Logger.createLogger(options);
    }
    /**
     * Get a new named logger based off of the application level logger
     */
    getNamedLogger(loggerName) {
        return this.logger.child({ loggerName });
    }
    /**
     * Get a configured raw stream for bunyan to use
     */
    getRawStream(configuration) {
        const loggly = new BunyanLoggly({
            token: configuration.logglyToken,
            subdomain: configuration.logglySubdomain
        });
        return new stream_correlation_id_decorator_1.StreamCorrelationIdDecorator(loggly, HTTPContext.get);
    }
}
exports.LoggerFactory = LoggerFactory;
//# sourceMappingURL=logger-factory.js.map