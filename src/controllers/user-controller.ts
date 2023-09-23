
import { Request, Response } from 'express'
import { Controller } from '../types/controller' 
import { UserService } from '../services/core/user-service';
import { configuration } from '../configuration';

/**
 * Health Controller handles requests that determine the health of the overall service
 */
class UserController extends Controller {

  /**
   * @inheritDoc
   */
  constructor(protected service: UserService) {
    super();
  }

  /**
   * @inheritDoc
   */
  public setRoutes(): void {
    console.info('Setting up routes for Auth Controller')
    this.router.post('/create', this.createAccount.bind(this))
    this.router.post('/:id/detect/desease', this.detectDesease.bind(this))

    this.router.post('/:id/detect/breed', this.detectBreed.bind(this))

    this.router.post('/insights/butcher', this.generateButcherInsights.bind(this))

    this.router.post('/insights/farmer', this.generateFarmerInsights.bind(this))

    this.router.get('/system-config', this.getSystemConfig.bind(this))
    this.router.post('/subscription-callback', this.subscriptionCallback.bind(this))
 
  }
  public detectDesease(request: any, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */ 
     const file = request.files.image
    const body = request.body
    const id = request.params.id
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    console.debug('Detion Started', body)
    return this.service.detectDesease(id, file)
      .then(sendResponse)
      .catch(handleError)
  }
  public detectBreed(request: any, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */ 
     const file = request.files.image
    const body = request.body
    const id = request.params.id
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    console.debug('Detion Started', body)
    return this.service.detectBreed(id, file)
      .then(sendResponse)
      .catch(handleError)
  }
  public createAccount(request: Request, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */
    const body = request.body
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    console.debug('Adding New Account', body)
    return this.service.createAccount(body.id,body.email, body.phone,body.username)
      .then(sendResponse)
      .catch(handleError)
  }
  public generateButcherInsights(request: Request, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */
    const body = request.body
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    console.debug('Generating Insights', body)
    return this.service.generateButchersRecomendation(body)
      .then(sendResponse)
      .catch(handleError)
  }

  public generateFarmerInsights(request: Request, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */
    const body = request.body
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    console.debug('Generating Insights - Farmer', body)
    return this.service.generateFarmerRecomendation(body)
      .then(sendResponse)
      .catch(handleError)
  }
 
  public getSystemConfig(request: Request, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */ 
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    
      const execute = async()=>{
        return configuration.system
      }
    return execute()
      .then(sendResponse)
      .catch(handleError)
  }
  public subscriptionCallback(request: Request, response: Response): Promise<Response> {
    /**
     * Get the Repo for the Objects
     */ 

    const body = request.body;
    console.log('REC_CAT', body)
    const handleError = (message: any) => response.json({
      success: false,
      code: message.code as number ?? 403,
      timestamp: new Date().getTime(),
      errorMessage: message.message ?? message,
      data: null

    })
      .status(message.code as number ?? 403)
    /**
     * Send the response back to the client
     */
    const sendResponse = (message: object) => response.json({
      success: true,
      code: 200,
      timestamp: new Date().getTime(),
      errorMessage: null,
      data: message

    })
      .status(200)
    
      const execute = async()=>{
        return configuration.system
      }
    return execute()
      .then(sendResponse)
      .catch(handleError)
  }
 



}

export { UserController }
