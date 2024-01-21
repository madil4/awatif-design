const TimberMemberDesign = require('./TimberMemberDesign');

class TensionMemberDesign extends TimberMemberDesign {
   constructor(materialProperties) {
        super(materialProperties); // Call the parent class constructor
    }


    // Method to convert net tension and capacity to design force and capacity
    calculateDesignValues(TensileForcePermanent, TensileForceVariable, gammaG, gammaQ, gammaM, serviceClass, loadDuration, material) {
       
        // TensileForcePermanent and TensileForceVariable should be in N (Newtons)
        // tensileStrengthParallel: wooden member tension capacity in MPa (Megapascals)
        // TensileForcePermanent: Charateristic permanent tensile force obtained from the solver (Assume it's a permanent load)
        // TensileForceVariable: Charateristic variable tensile force 
        // tensileStrengthParallel: wooden member tension capacity
        // gammaG: Partial factor of safey for permanent load 
        // gammaQ: Partial factor of safey for variable action
        // gammaM: Partial factor of safey for the material 
        // serviceClass: The service class (1,2, or 3)
        // loadDuratoin: The load duration category (e.g. 'permanent','longTerm', 'mediumTerm', 'shortTerm', 'instantaneous' )


        // Access tensileStrengthParallel from this.materialProperties
        const tensileStrengthParallel = this.materialProperties.tensileStrengthParallel;

        // Determine kmod based on service class and load duration
        let kmod = this._getKmod(serviceClass, loadDuration, material);
    
        // Calculate design force considering partial safety factors for permanent and variable actions
        let designForce = TensileForcePermanent * gammaG + TensileForceVariable * gammaQ ;

      
        // Calculate design capacity considering partial safety factor for the material and the modification factor kmod
        let designCapacity = (tensileStrengthParallel * kmod) / gammaM;


        // Return the calculated design force and capacity
        return {
            designForce: designForce,
            designCapacity: designCapacity
        };
    }

    // Method to calculate utilization ratio and check safety
      // Modified method to calculate utilization ratio and check safety
    checkSafety({ width, height, designForce, designCapacity }) {
        // Cross-sectional area should be in mm² (square millimeters)

        // Calculate cross-sectional area
        const crossSectionalArea = width * height; // width and height in [mm]

        // Calculate the tensile stress
        let tensileStress = designForce / crossSectionalArea;

        // Calculate the utilization ratio
        let utilizationRatio = tensileStress / designCapacity;

        // Check if the member is safe
        let isSafe = utilizationRatio <= 1; // Safe if utilization ratio is less than or equal to 1

        return {
             tensileStress: tensileStress,
            utilizationRatio: utilizationRatio,
            isSafe: isSafe
        };
    }
}

module.exports = TensionMemberDesign
