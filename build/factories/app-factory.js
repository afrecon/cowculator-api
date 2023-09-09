"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppFactory = void 0;
const express = require("express");
const HTTPContext = require("express-http-context");
const cors = require("cors");
const bodyParser = require("body-parser");
const correlation_id_middleware_1 = require("../middleware/correlation-id-middleware");
const fileUpload = require('express-fileupload');
/**
 * App Factory creates and initializes and new instance of the application
 */
class AppFactory {
    /**
     * Get a configured application instance
     */
    static getInstance(plotController) {
        const app = express();
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(HTTPContext.middleware);
        app.use(fileUpload());
        app.use(cors());
        app.use(correlation_id_middleware_1.CorrelationIdMiddleware.getMiddleware());
        //app.use(security.getMiddleware()) 
        app.use('/plots', plotController.getRoutes());
        return app;
    }
}
exports.AppFactory = AppFactory;
//# sourceMappingURL=app-factory.js.map