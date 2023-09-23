
import { firestore, } from 'firebase-admin';
import { Profile, UseCase } from '../../models/base/profile';
import { ProfileConfig } from '../../models/base/user-configs';
import { configuration } from '../../configuration';
import * as axios from 'axios';
import { PredictionResult } from '../../models/ml/prediction';
import { RevenueCatPayload } from '../../models/revenuecat/revenuecat-event';

const AUTO_ACTIVATE_ACCOUNTS = process.env.AUTO_ACTIVATE_ACCOUNTS as unknown as boolean ?? false
const ROBO_API_KEY = process.env.ROBO_API_KEY ?? '3oBQpkdXrgvJxf7AtUnm'
class UserService {
  private edenAI: axios.AxiosInstance
  private roboAPI: axios.AxiosInstance
  constructor(protected firestore: firestore.Firestore) {
    console.debug('User Service Started')
    this.edenAI = axios.default.create({
      baseURL: 'https://api.edenai.run',
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODZiZGY2MzItMGNhNi00MmRiLWE3MTMtYjU5MWVhMWZjZTZlIiwidHlwZSI6ImFwaV90b2tlbiJ9.V-LX15qVeH_5F2lfPtOv0-wkHd51C6TPo_2w1oI1cCU",
      }
    })

    this.roboAPI = axios.default.create({
      params: {
        api_key: ROBO_API_KEY
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
  }

  public async createAccount(id: string, emailAddress: string, phoneNumber: string, username: string, subscribed?: boolean) {
    const user: Profile = {
      id,
      phoneNumber,
      emailAddress,
      username,
      dateRegistered: new Date(),
      lastUpdated: new Date(),
      currency: 'BWP',
      mode: UseCase.ButcherMode,
      country: "Botswana",
      liveBuyingPrice: 28,
      subscribed: subscribed ?? AUTO_ACTIVATE_ACCOUNTS,
      countryCode: 'BW',
      currencySymbol: 'P'
    }

    const profileConfig: ProfileConfig = {
      id,
      round: 30,
      loin: 30,
      shortplate: 25,
      brisket: 30,
      chuck: 20,
      rib: 30,
      flank: 30,
      intestines: 35,
      shank: 35,
      scale: 'kg'

    }

    await this.firestore.collection('users').doc(id).set(user)
    await this.firestore.collection('profile-config').doc(id).set(profileConfig)
    return user
  }

  public async syncConfig() {
    await this.firestore.collection('system-config').doc('default').set(configuration.system)
  }


  public async generateButchersRecomendation(data: any) {



    const prompt = `I want you to act as a Beef industry expert and advisor. Given the following inputs, provide expert insights for a butcher, including a short summary with suggestions, and specific insights by cuts with relation to the total circus weight. Format the response as well formatted html  (all styling should be inline). 

    Inputs:
    Country & Region: {BW, SADC}
    Cuts:
    1. Chuck (${data['Chuck']}${data.scale})
    2. Rib (${data['Rib']}${data.scale})
    3. Round (${data['Round']}${data.scale})
    4. Loin (${data['Loin']}${data.scale})
    5. Flank (${data['Flank']}${data.scale})
    6. Shank (${data['Shank']}${data.scale})
    7. Brisket (${data['Brisket']}${data.scale})
    8. Shortplate (${data['Shortplate']}${data.scale})
    9. Intestines (${data['Intestines']}${data.scale})
    User: ${data.username}
    Total Carcus Weight: ${data.totalWeight}${data.scale}
    
    Please structure your response as follows:
    
    Summary:
    [Provide a brief summary of the insights]
    
    Suggestions:
    [Provide a brief summary of the insights in the format of a conversation response to the user]
    
    Insights by Cuts:
     
   etc. for all cuts`

    const payload = {
      "providers": "openai",
      "text": prompt,
      "chatbot_global_action": "Act as an assistant who can increase revenue further subdividing cuts given the weights",
      "temperature": 0.6,
      "max_tokens": 1000
    }

    return await this.edenAI.post('/v2/text/chat', payload).then((resp) => {
      return { result: resp.data.openai.generated_text }
    }).catch((e) => {
      console.log(e.response.data)
      throw e
    })



  }

  public async generateFarmerRecomendation(data: any) {



    const prompt = `I want you to act as a Beef industry expert and advisor. Given the following inputs, provide expert insights for a Farmer/Cattle breeder, including a short summary with suggestions, and specific insights on improving the grade of beef given its current live weight. Give a break down section by the age. Format the response as well formatted html  (all styling should be inline). 

    Inputs:
    Country & Region: {BW, SADC} 

    User: ${data.username}
    Total Live Weight: ${data.totalWeight}${data.scale}
    
    Please structure your response as follows:
    
    Summary:
    [Provide a brief summary of the insights]
    
    Suggestions:
    [Provide a brief summary of the insights in the format of a conversation response to the user]
    
    Insights by Age (example):
    6-12 Months : [Your recommendatation]
    12-16: [Your recommendation]
    
   etc. for all ages`

    const payload = {
      "providers": "openai",
      "text": prompt,
      "chatbot_global_action": "Act as cattle breeding expert who can help increase the quality of the beef given its current weight through recommending specific items. Provide All the information you can",
      "temperature": 0.6,
      "max_tokens": 1000
    }

    return await this.edenAI.post('/v2/text/chat', payload).then((resp) => {
      return { result: resp.data.openai.generated_text }
    }).catch((e) => {
      console.log(e.response.data)
      throw e
    })



  }

  public async detectDesease(userId: string, image: any) {
    console.log('Detecting deseases', userId, image)
    const execute = async () => {

      const buffer = image.data as Buffer
      return this.roboAPI.post('https://classify.roboflow.com/a-simple-model/1',
        buffer.toString('base64')
      ).then((res: axios.AxiosResponse<PredictionResult>) => {
        return res.data
      }).catch((e) => {
        console.log('ERR', e)
        throw e.response.data
      })
    }

    const formatResults = async (res: PredictionResult) => {
      var results = []
      for (var i = 0; i < res.predictions.length; i++) {

        const item = res.predictions[i]
        var name = this.getDeseaseName(item.class)
        results.push({
          name,
          confidence: item.confidence
        })

      }

      var status = this.getDeseaseName(res.top)
      return {
        status,
        confidence: res.confidence,
        results
      }

    }

    return execute().then(formatResults)
  }

  public async detectBreed(userId: string, image: any) {
    console.log('Detecting deseases', userId, image)
    const execute = async () => {

      const buffer = image.data as Buffer
      return this.roboAPI.post('https://detect.roboflow.com/cattle-breeds/1',
        buffer.toString('base64')
      ).then((res: axios.AxiosResponse<PredictionResult>) => {
        return res.data
      }).catch((e) => {
        console.log('ERR', e)
        throw e.response.data
      })
    }

    const formatResults = async (res: PredictionResult) => {
      console.log('RESULT', res)
      if (undefined == res || null == res || undefined == res.predictions || null == res.predictions) {
        return {
          status: 'Unknown Specimen',
          confidence: 95,
          results: []
        }
      } else {
        var results = []
        if (0 == res.predictions.length) {
          return {
            status: 'Unknown Specimen',
            confidence: 95,
            results: []
          }
        } else {
          for (var i = 0; i < res.predictions.length; i++) {

            const item = res.predictions[i]
            var name = item.class.toUpperCase()
            results.push({
              name,
              confidence: item.confidence
            })

          }

          var status = results[0].name
          var confidence = results[0].confidence
          return {
            status,
            confidence: confidence,
            results
          }
        }
      }

    }

    return execute().then(formatResults)
  }
  public async handleSubscriptionUpdate(payload: RevenueCatPayload) {
    const event = payload.event;

    const getAccount = async () => {
      var res = await this.firestore.collection('users').where('payerId', '==', event.original_app_user_id).limit(1).get()
      if (res.empty) {
        throw {
          code: 404,
          message: 'Unable to identify user'
        }
      }
      return res.docs[0].data() as Profile
    }

    const evaluatePurchase = async (client: Profile) => {
      let error = 'SUCCESS'
      client.subscriptionId = event.transaction_id
      switch (event.type) {
        case 'RENEWAL':
          client.subscribed = true;
         // client.subscriptionEndDate = event.event_timestamp_ms
          break;
        case 'INITIAL_PURCHASE':
          client.subscribed = true;
        //  client.subscriptionEndDate = event.event_timestamp_ms
          break;
        case 'CANCELLATION':
          client.subscribed = false;
          error = event.cancel_reason;
        //  client.subscriptionEndDate = moment().utc().valueOf()
          break;
        case 'EXPIRATION':
          client.subscribed = false;
      //    client.subscriptionEndDate = moment().utc().valueOf()
          error = event.expiration_reason;
          break;
        default:
          error = 'ERROR'
          break
      }
      const subscription = {
        id: Buffer.from(event.product_id + ':' + client.id).toString('base64'),
        clientId: client.id,
        active: client.subscribed,
        status: error,
        subscription: event
      }
      await this.firestore.collection('subscriptions').doc(subscription.id).set(subscription)
      await this.firestore.collection('users').doc(client.id).update({ subscribed: client.subscribed, subscriptionId: client.subscriptionId })
      return subscription
    }


    return getAccount().then(evaluatePurchase)


  }
  private getDeseaseName(nm: string) {
    switch (nm) {
      case 'FMD':
        return "Foot & Mouth Disease"
      case 'LSD':
        return "Lumpy Skin Disease"
      case 'IBK':
        return "Pink Eye"
      default:
        return "No Visible Issues"
    }
  }



}

export { UserService }

