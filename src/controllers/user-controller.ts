
import { Request, Response } from 'express'
import { Controller } from '../types/controller' 
import { UserService } from '../services/core/user-service';

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
 




}

export { UserController }
