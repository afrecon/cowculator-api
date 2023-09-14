
import { firestore, } from 'firebase-admin';
import { Profile, UseCase } from '../../models/base/profile';
import { ProfileConfig } from '../../models/base/user-configs';
import { configuration } from '../../configuration';
import * as axios from 'axios';


class UserService {
  private edenAI: axios.AxiosInstance
  constructor(protected firestore: firestore.Firestore) {
    console.debug('User Service Started')
    this.edenAI = axios.default.create({
      baseURL: 'https://api.edenai.run',
      headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODZiZGY2MzItMGNhNi00MmRiLWE3MTMtYjU5MWVhMWZjZTZlIiwidHlwZSI6ImFwaV90b2tlbiJ9.V-LX15qVeH_5F2lfPtOv0-wkHd51C6TPo_2w1oI1cCU",
      }
    })
  }

  public async createAccount(id: string, emailAddress: string, phoneNumber: string, username: string, subscribed?:boolean) {
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
      subscribed:subscribed ?? false,
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
      return {result: resp.data.openai.generated_text}
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
      return {result: resp.data.openai.generated_text}
    }).catch((e) => {
      console.log(e.response.data)
      throw e
    })



  }




}

export { UserService }

