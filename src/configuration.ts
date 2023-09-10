require('dotenv')
  .config()

import { AppConfiguration } from './models/configuration/app-configuration'

const configuration: AppConfiguration = {
 
  server: {
    port: process.env.PORT
  },
  system: {
    distributions: {
      hotMass: process.env.WIEGHT_HOT as unknown as number,
      coldMass: process.env.WIEGHT_COLD as unknown as number,
      round: process.env.WIEGHT_ROUND as unknown as number,
      loin: process.env.WIEGHT_LOIN as unknown as number,
      shortplate: process.env.WIEGHT_SHORTPLATE as unknown as number,
      brisket: process.env.WIEGHT_BRISKET as unknown as number,
      chuck: process.env.WIEGHT_CHUCK as unknown as number,
      rib: process.env.WIEGHT_RIB as unknown as number,
      flank: process.env.WIEGHT_FLANK as unknown as number,
      intestines: process.env.WIEGHT_MALA as unknown as number,
      shank: process.env.WIEGHT_SHANK as unknown as number
    },
    grades: {
      yeildGradeA: process.env.YIELD_A as unknown as number,
      yeildGradeB:process.env.YIELD_B as unknown as number,
      yeildGradeC: process.env.YIELD_C as unknown as number,
      yeildGradeD: process.env.YIELD_D as unknown as number,
      yeildGradeE: process.env.YIELD_E as unknown as number,
    }
  }
}

export { configuration }
