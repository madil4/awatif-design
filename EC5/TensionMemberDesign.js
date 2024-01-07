class TensionMemberDesign {
    constructor(materialProperties) {
        // Initialize with material properties
        // tensileStrengthParallel should be in MPa (Megapascals)
        // modulusOfElasticity should also be in MPa
        this.materialProperties = materialProperties;
        // Example properties: { tensileStrengthParallel: value, modulusOfElasticity: value }
    }

    // Method to convert net tension and capacity to design force and capacity
    calculateDesignValues(TensileForcePermanent, TensileForcevariable, tensileStrengthParallel, gammaG, gammaQ, gammaM) {
       
        // TensileForcePermanent and TensileForceVariable should be in N (Newtons)
        // tensileStrengthParallel: wooden member tension capacity in MPa (Megapascals)
        // TensileForcePermanent: Charateristic permanent tensile force obtained from the solver (Assume it's a permanent load)
        // TensileForcevariable: Charateristic variable tensile force 
        // tensileStrengthParallel: wooden member tension capacity
        // gammaG: Partial factor of safey for permanent load 
        // gammaQ: Partial factor of safey for variable action
        // gammaM: Partial factor of safey for the material 
        
        
        // Calculate design force considering partial safety factors for permanent and variable actions
        let designForce = TensileForcePermanent * gammaG + TensileForcevariable * gammaQ ;

        // Calculate design capacity considering partial safety factor for the material
        let designCapacity = tensileStrengthParallel / gammaM 


        // Return the calculated design force and capacity
        return {
            designForce: designForce,
            designCapacity: designCapacity
        };
    }

    // Method to calculate utilization ratio and check safety
    checkSafety(crossSectionalArea, TensileForcePermanent, TensileForcevariable, tensileStrengthParallel, gammaG, gammaQ, gammaM) {
        // Cross-sectional area should be in mm² (square millimeters)
        // Invoke calculateDesignValues with proper arguments
        const { designForce, designCapacity } = this.calculateDesignValues(TensileForcePermanent, TensileForcevariable, tensileStrengthParallel, gammaG, gammaQ, gammaM);

        // Calculate the tensile stress
        let tensileStress = designForce / crossSectionalArea;

        // Calculate the utilization ratio
        let utilizationRatio = tensileStress / designCapacity;

        // Check if the member is safe
        let isSafe = utilizationRatio <= 1; // Safe if utilization ratio is less than or equal to 1

        return {
            utilizationRatio: utilizationRatio,
            isSafe: isSafe
        };
    }
}

module.exports = TensionMemberDesign
