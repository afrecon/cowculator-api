// A class to be used for other parts of the cow on sale

export interface CustomCut{
    id:string 
    name: string 
    description?: string 
    onceOff: boolean 
    price: number 
    userId:string
}