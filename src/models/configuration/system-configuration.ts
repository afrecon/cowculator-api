/**
 * Representation of the server specific configuration required
 */
interface SystemConfiguration {
  /**
   * The Weight Distribution
   */
  distributions:WeightDistributionConfig
  yield: YieldRetailWeights


}

interface WeightDistributionConfig{
hotMass:number 
coldMass: number
round:number
loin:number 
shortplate:number 
brisket:number 
chuck: number 
rib:number 
flank: number 
intestines: number
shank: number
}

interface YieldRetailWeights{
  yeildGradeA:number
  yeildGradeB:number
  yeildGradeC:number
  yeildGradeD:number
  yeildGradeE:number
}

export { SystemConfiguration, WeightDistributionConfig,YieldRetailWeights }
