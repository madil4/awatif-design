class TensionMemberDesign {
    constructor(materialProperties) {
        // Initialize with material properties
        // tensileStrengthParallel should be in MPa (Megapascals)
        // modulusOfElasticity should also be in MPa
        this.materialProperties = materialProperties;
        // Example properties: { tensileStrengthParallel: value, modulusOfElasticity: value }
    }

    // Private method to determine kmod (make sure to include the logic for this)
    _getKmod(serviceClass, loadDuration, material) {
        // Determine kmod based on service class and load duration
        // The values of kmod coeffients are determined according to Table 3.1 in EC5
        const kmodValues = 
        {
            // Standard: EN 14081-1
            'Solid timber': {
                '1': { 'permanent': 0.60, 'longTerm': 0.70, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.60, 'longTerm': 0.75, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '3': { 'permanent': 0.50, 'longTerm': 0.55, 'mediumTerm': 0.65, 'shortTerm': 0.70, 'instantaneous': 0.9 }
            },

            // Standard: EN 14080
            'Glued laminated timber': {
                '1': { 'permanent': 0.60, 'longTerm': 0.70, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.60, 'longTerm': 0.75, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '3': { 'permanent': 0.50, 'longTerm': 0.55, 'mediumTerm': 0.65, 'shortTerm': 0.70, 'instantaneous': 0.9 }
            },

            // standard: EN 14374, EN 14279
            'LVL': {
                '1': { 'permanent': 0.60, 'longTerm': 0.70, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.60, 'longTerm': 0.70, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '3': { 'permanent': 0.50, 'longTerm': 0.55, 'mediumTerm': 0.65, 'shortTerm': 0.70, 'instantaneous': 0.9 }
            },

            // Standard: EN 636.
            // Type EN 636-1 for servie class 1
            // Type EN 363-2 for service class 2
            // Type EN 636-3 for service class 3 

            'Plywood': {
                '1': { 'permanent': 0.60, 'longTerm': 0.70, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.60, 'longTerm': 0.70, 'mediumTerm': 0.80, 'shortTerm': 0.90, 'instantaneous': 1.10 },
                '3': { 'permanent': 0.50, 'longTerm': 0.55, 'mediumTerm': 0.65, 'shortTerm': 0.70, 'instantaneous': 0.90 }
            },

            // Standard: EN 300
            // OSB/2 for service class 1
            // OSB/3, OSB/4 for service class 2
            'OSB': {
                '1': { 'permanent': 0.30, 'longTerm': 0.45, 'mediumTerm': 0.65, 'shortTerm': 0.85, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.30, 'longTerm': 0.40, 'mediumTerm': 0.55, 'shortTerm': 0.70, 'instantaneous': 0.9 },
                
            },
            
            // Standard: EN 312
            // Type P4, Type P5 for service class 1
            // Type P5 for service class 2
            'Particleboard': {
                '1': { 'permanent': 0.30, 'longTerm': 0.45, 'mediumTerm': 0.65, 'shortTerm': 0.85, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.20, 'longTerm': 0.30, 'mediumTerm': 0.45, 'shortTerm': 0.60, 'instantaneous': 0.80 },
              
            },

            // Standard: EN 622-2
            // Type HB.LA, HB.HLA 1 or 2 for service class 1
            // Type HB.HLA1 or 2 for service class 2
            'Fibreboard, hard': {
                '1': { 'permanent': 0.30, 'longTerm': 0.45, 'mediumTerm': 0.65, 'shortTerm': 0.85, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.20, 'longTerm': 0.30, 'mediumTerm': 0.45, 'shortTerm': 0.60, 'instantaneous': 0.80 }
            },

            // Standard: EN 622-3
            // MBH.LA1 or 2 for service class 1
            // MBH.HLS1 or 2 for service class 2

            'Fibreboard, medium': {
                '1': { 'permanent': 0.20, 'longTerm': 0.40, 'mediumTerm': 0.60, 'shortTerm': 0.80, 'instantaneous': 1.10 },
                '2': { 'permanent': 0.20, 'longTerm': 0.40, 'mediumTerm': 0.60, 'shortTerm': 0.80, 'instantaneous': 1.10 }
            },

            // Standard 622-5
            // MDF.LA, MDF.HLS for service class 1
            // MDF.HLS for service class 2
            'Fibreboard, MDF': {
                '1': { 'permanent': 0.20, 'longTerm': 0.40, 'mediumTerm': 0.60, 'shortTerm': 0.80, 'instantaneous': 1.10 },
                '2': { 'permanent': 1, 'longTerm': 1, 'mediumTerm': 1, 'shortTerm': 0.45, 'instantaneous': 0.8 }
            }
        };

        //Note: Modification factors for the influence of load-duration and moisture content on strength o are given in 3.1.3 in EC5

        // Get kmod based on material, service class, and load duration
        if (!kmodValues[material] || !kmodValues[material][serviceClass] || typeof kmodValues[material][serviceClass][loadDuration] !== 'number') {
            throw new Error('Invalid material type, service class, or load duration for kmod determination');
        }
        let kmod = kmodValues[material][serviceClass][loadDuration];

        return kmod;
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
    checkSafety(width, height, TensileForcePermanent, TensileForceVariable, gammaG, gammaQ, gammaM) {
        // Cross-sectional area should be in mm² (square millimeters)
        // Invoke calculateDesignValues with proper arguments

        // Access tensileStrengthParallel and modulusOfElasticity from this.materialProperties
        const { tensileStrengthParallel} = this.materialProperties;
        const { designForce, designCapacity } = this.calculateDesignValues(TensileForcePermanent, TensileForceVariable, tensileStrengthParallel, gammaG, gammaQ, gammaM);

        // Calculate cross section area
        const crossSectionalArea = width * height; // width and height in [mm]
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
