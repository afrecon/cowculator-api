
import { firestore, } from 'firebase-admin';
import { Profile, UseCase } from '../../models/base/profile';
import { ProfileConfig } from '../../models/base/user-configs';
import { configuration } from '../../configuration';


class UserService {

  constructor(protected firestore: firestore.Firestore) {
    console.debug('User Service Started')
  }

  public async createAccount(id: string, emailAddress: string, phoneNumber: string, username: string) {
    const user: Profile = {
      id,
      phoneNumber,
      emailAddress,
      username,
      dateRegistered: new Date(),
      lastUpdated: new Date(),
      currency: '',
      mode: UseCase.ButcherMode,
      country: "",
      liveBuyingPrice: 28,
      subscribed: true,
      countryCode: ''
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
      scale:'kg'
    
    }

    await this.firestore.collection('users').doc(id).set(user)
    await this.firestore.collection('profile-config').doc(id).set(profileConfig)
    return user
  }

  public async syncConfig() {
    await this.firestore.collection('system-config').doc('default').set(configuration.system)
  }




}

export { UserService }

