"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_1 = require("./configuration");
const app_factory_1 = require("./factories/app-factory");
const logger_factory_1 = require("./factories/logger-factory");
const express_server_1 = require("./services/express-server");
const plot_controller_1 = require("./controllers/plot-controller");
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const plot_service_1 = require("./services/core/plot-service");
const serviceAccount = require(`./${process.env.ENV}.json`);
/**
 * Start the HTTP service
 */
const startService = async () => {
    // Logging
    const loggerFactory = new logger_factory_1.LoggerFactory(configuration_1.configuration.logger);
    const processLogger = loggerFactory.getNamedLogger('mpi-api');
    // Database 
    // firebase
    const firebase = (0, app_1.initializeApp)({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.STORAGE_BUCKET
    });
    const database = (0, firestore_1.getFirestore)(firebase);
    // Repositories
    // Services
    // const security = new SecurityMiddleware(new FirestoreRepository<APIKey>('api-keys', database), userRepo)
    // const sms = new SmsService(configuration.twilio, loggerFactory)
    // const userService = new UserService(database, notificationService, auth, uploadService, loggerFactory)
    const plotsService = new plot_service_1.PlotService(database, loggerFactory);
    const authController = new plot_controller_1.PlotsController(plotsService, loggerFactory);
    // Applicationk
    const app = app_factory_1.AppFactory.getInstance(authController);
    const expressServer = new express_server_1.ExpressServer(app, loggerFactory, configuration_1.configuration.server);
    expressServer.run()
        .catch((error) => processLogger.error('Process error', { message: error.message }));
};
Promise.resolve()
    .then(startService)
    .catch(console.error);
//# sourceMappingURL=index.js.map