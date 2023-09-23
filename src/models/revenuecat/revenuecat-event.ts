export interface RevenueCatPayload {
    api_version: string
    event: RevenueCatEvent
  }
  
  export interface RevenueCatEvent {
    aliases: string[]
    app_id: string
    app_user_id: string
    commission_percentage: number
    country_code: string
    currency: string
    entitlement_id: string
    entitlement_ids: string[]
    environment: string
    event_timestamp_ms: number
    expiration_at_ms: number
    id: string
    expiration_reason?:string
    cancel_reason:string
    is_family_share: string
    offer_code: string
    original_app_user_id: string
    original_transaction_id: string
    period_type: string
    presented_offering_id: string
    price: number
    price_in_purchased_currency: number
    product_id: string
    purchased_at_ms: number
    store: string 
    takehome_percentage: number
    tax_percentage: number
    transaction_id: string
    type: string
  }
  
   
  
  export interface DisplayName {
    updated_at_ms: number
    value: string
  }
  
  export interface Email {
    updated_at_ms: number
    value: string
  }
  
  export interface PhoneNumber {
    updated_at_ms: number
    value: string
  }
  
  
  