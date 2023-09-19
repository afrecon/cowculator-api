export interface PredictionResult {
    time: number
    image: Image
    predictions: Prediction[]
    top: string
    confidence: number
  }
  
  export interface Image {
    width: number
    height: number
  }
  
  export interface Prediction {
    class: string
    class_id: number
    confidence: number
  }
  