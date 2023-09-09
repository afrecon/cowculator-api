"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressServer = void 0;
/**
 * Express specific implementation of an HTTP server
 */
class ExpressServer {
    /**
     * @constructor
     */
    constructor(app, loggerFactory, configuration) {
        this.app = app;
        this.logger = loggerFactory.getNamedLogger('express-server');
        this.port = configuration.port;
    }
    /**
     * @inheritDoc
     */
    run() {
        /**
         * Determine if the instance is already running
         */
        const isRunning = () => {
            if (this.server) {
                this.logger.error('Server instance is already running');
                throw new Error('Server instance already running');
            }
        };
        /**
         * Start the server
         */
        const startServer = () => {
            this.server = this.app.listen(this.port, () => {
                this.logger.info(`Server available on port ${this.port}`);
                console.info(`Server available on port ${this.port}`);
            });
        };
        this.logger.info('Attempting to start server');
        console.info('Attempting to start server');
        return Promise.resolve()
            .then(isRunning)
            .then(startServer);
    }
    /**
     * @inheritDoc
     */
    shutdown() {
        /**
         * Stop the server
         */
        const stopServer = () => {
            if (!this.server) {
                return this.logger.info('Server stopped successfully');
            }
            this.server.close((error) => {
                if (error) {
                    this.logger.error('Error occurred while stopping the server', { message: error.message });
                    throw error;
                }
                return this.logger.info('Server stopped successfully');
            });
        };
        this.logger.info('Attempting to stop server');
        return Promise.resolve()
            .then(stopServer);
    }
}
exports.ExpressServer = ExpressServer;
//# sourceMappingURL=express-server.js.map