import * as express from 'express'
import * as HTTPContext from 'express-http-context'
import * as cors from 'cors'
import * as bodyParser from 'body-parser'
import { CorrelationIdMiddleware } from '../middleware/correlation-id-middleware';
import {  UserController } from '../controllers/user-controller';
const fileUpload = require('express-fileupload');

/**
 * App Factory creates and initializes and new instance of the application
 */
class AppFactory {
  /**
   * Get a configured application instance
   */
  public static getInstance(
    plotController: UserController,
  ): express.Express {
    const app: express.Express = express()
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(HTTPContext.middleware)
    app.use(fileUpload())
    app.use(cors())
    app.use(CorrelationIdMiddleware.getMiddleware())
    //app.use(security.getMiddleware()) 
    app.use('/users', plotController.getRoutes())

    return app
  }
}

export { AppFactory }
