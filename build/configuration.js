"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
require('dotenv')
    .config();
const configuration = {
    logger: {
        level: process.env.LOGGER_LEVEL,
        service: process.env.LOGGER_SERVICE,
        logglyToken: process.env.LOGGER_LOGGLY_TOKEN,
        logglySubdomain: process.env.LOGGER_LOGGLY_SUBDOMAIN
    },
    server: {
        port: process.env.PORT
    }
};
exports.configuration = configuration;
//# sourceMappingURL=configuration.js.map