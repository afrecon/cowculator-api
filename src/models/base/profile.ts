export interface Profile {
    id:string 
    username?: string 
    emailAddress:string
    phoneNumber: string 
    dateRegistered: Date
    lastUpdated: Date
    currency: string
    currencySymbol: string
    mode: UseCase
    country: string
    liveBuyingPrice: number
    subscribed:boolean 
    countryCode: string 
}

 export enum UseCase{
    ButcherMode='Butcher',
    Farmer ='Farmer',
    Custom='Custom'
}