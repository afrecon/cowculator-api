// import { NextFunction, Request, Response } from 'express'
// import { APIKey } from '../models/security/api-key';
// import { User } from '../models/base/plot';
// import { FirestoreRepository } from '../repositories/firebase-repo';
// /**
//  * Security Middleware is responsible for authenticating all requests
//  */
// class SecurityMiddleware {
//   /**
//    * Get the middleware component
//    */
//   constructor(protected apiRepo: FirestoreRepository<APIKey>, protected userRepo: FirestoreRepository<User>) {
//   }
//   public getMiddleware() {
//     return async (req: Request, res: Response, next: NextFunction) => {
//       if (req.path.includes('/link/')) {
//         next()
//       } else {
//         const apiKey = req.header("x-api-key");
//         if (!apiKey) {
//           return res.status(401).send("Unauthorized");
//         }
//         const key = await this.apiRepo.findByField('apiKey', apiKey);
//         if (!key || !key[0].active) {
//           return res.status(401).send("Unauthorized");
//         }
//         //   const userRef = req.header('x-user-ref')
//         //   const _arr_no_auth = ['/accounts/register/','/system/types/', '/auth/users/groups', '/auth/users/otp','/link/','loan/parse','airtime/parse'];
//         //   let _requires_auth = true;
//         // for(let i =0;i<_arr_no_auth.length;i++){
//         //     if(req.path.includes(_arr_no_auth[i])){
//         //       _requires_auth = false;
//         //       break;
//         //     }
//         // }
//         //   if(_requires_auth){
//         //     if (!userRef) {
//         //       return res.status(401).send({
//         //         success:true,
//         //         code:401,
//         //         timestamp: new Date().getTime(),
//         //         errorMessage:'Unauthorized Access - Missing Reference',
//         //         data:null
//         //        });
//         //     }
//         //     const user = await this.userRepo.findOne({
//         //       relations:{
//         //         role:true
//         //       },
//         //       where:{
//         //       reference:userRef
//         //     } });
//         //     if (!user || !user.active) {
//         //       return res.status(401).send({
//         //         success:true,
//         //         code:401,
//         //         timestamp: new Date().getTime(),
//         //         errorMessage:'Unauthorized Access',
//         //         data:null
//         //        });
//         //     }else{
//         //       req.headers['x-user-id'] = user.id.toString();
//         //       req.headers['x-user-role'] = user.role.securityLevel.toString();
//         //     }
//         //   }
//         next();
//       }
//     }
//   }
// }
// export { SecurityMiddleware }
//# sourceMappingURL=security-middleware.js.map