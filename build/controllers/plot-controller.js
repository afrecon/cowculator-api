"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlotsController = void 0;
const controller_1 = require("../types/controller");
/**
 * Health Controller handles requests that determine the health of the overall service
 */
class PlotsController extends controller_1.Controller {
    /**
     * @inheritDoc
     */
    constructor(service, loggerFactory) {
        super(loggerFactory.getNamedLogger('plot-controller'));
        this.service = service;
    }
    /**
     * @inheritDoc
     */
    setRoutes() {
        this.logger.info('Setting up routes for Auth Controller');
        this.router.post('/configure', this.configure.bind(this));
    }
    configure(request, response) {
        /**
         * Get the Repo for the Objects
         */
        const body = request.body;
        const handleError = (message) => {
            var _a, _b, _c;
            return response.json({
                success: false,
                code: (_a = message.code) !== null && _a !== void 0 ? _a : 403,
                timestamp: new Date().getTime(),
                errorMessage: (_b = message.message) !== null && _b !== void 0 ? _b : message,
                data: null
            })
                .status((_c = message.code) !== null && _c !== void 0 ? _c : 403);
        };
        /**
         * Send the response back to the client
         */
        const sendResponse = (message) => response.json({
            success: true,
            code: 200,
            timestamp: new Date().getTime(),
            errorMessage: null,
            data: message
        })
            .status(200);
        this.logger.debug('Adding Plots', body);
        return this.service.UploadData(body.countryCode)
            .then(sendResponse)
            .catch(handleError);
    }
}
exports.PlotsController = PlotsController;
//# sourceMappingURL=plot-controller.js.map