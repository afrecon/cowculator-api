
import { configuration } from './configuration'
import { AppFactory } from './factories/app-factory'

import { ExpressServer } from './services/express-server'
import { UserController } from './controllers/user-controller'
import { initializeApp } from 'firebase-admin/app';

import { getFirestore } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin'
import { UserService } from './services/core/user-service'
const serviceAccount = require(`./${process.env.ENV}.json`)
/**
 * Start the HTTP service
 */
const startService = async () => {



  // Database 
  // firebase
  const firebase = initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET
  });

  const database = getFirestore(firebase)

  // Repositories

  // Services
  // const security = new SecurityMiddleware(new FirestoreRepository<APIKey>('api-keys', database), userRepo)
  // const sms = new SmsService(configuration.twilio, loggerFactory)
  // const userService = new UserService(database, notificationService, auth, uploadService, loggerFactory)

  const plotsService = new UserService(database)

  const authController = new UserController(plotsService)
  // Applicationk
  const app = AppFactory.getInstance(
    authController
  )

  const expressServer = new ExpressServer(app, configuration.server)

  expressServer.run()
    .then(() => plotsService.syncConfig())
    .catch((error: Error) => console.error('Process error', { message: error.message }))
}

Promise.resolve()
  .then(startService)
  .catch(console.error)
