const TimberMemberDesign = require('./TimberMemberDesign');

class CompressionMemberDesign extends TimberMemberDesign {
    constructor(materialProperties) {
        super(materialProperties); // Call the parent class constructor
    }

    // Method to convert net tension and capacity to design force and capacity
    calculateDesignValues(CompressionForcePermanent, CompressionForceVariable, gammaG, gammaQ, gammaM, serviceClass, loadDuration, material) {
       
        // CompressionForcePermanent and CompressionForceVariable should be in N (Newtons)
        // CompressionForcePermanent: Charateristic permanent tensile force obtained from the solver (Assume it's a permanent load)
        // CompressionForceVariable: Charateristic variable compression force 
        // compressionStrengthParallel: wooden member tension capacity
        // gammaG: Partial factor of safey for permanent load 
        // gammaQ: Partial factor of safey for variable action
        // gammaM: Partial factor of safey for the material 
        // serviceClass: The service class (1,2, or 3)
        // loadDuratoin: The load duration category (e.g. 'permanent','longTerm', 'mediumTerm', 'shortTerm', 'instantaneous' )


        // Access compressionStrengthParallel from this.materialProperties
        const compressionStrengthParallel = this.materialProperties.compressiontrengthParallel;

        // Determine kmod based on service class and load duration
        let kmod = this._getKmod(serviceClass, loadDuration, material);
    
        // Calculate design force considering partial safety factors for permanent and variable actions
        let designForce = CompressionForcePermanent * gammaG + CompressionForceVariable * gammaQ ;

      
        // Calculate design capacity considering partial safety factor for the material and the modification factor kmod
        let designCapacity = (compressionStrengthParallel * kmod) / gammaM;


        // Return the calculated design force and capacity
        return{
            designForce: designForce,
            designCapacity: designCapacity
            };
    }

    calculateLambdaRel(compressionStrengthParallel, E005, leff, width, height) {
    // compressionStrengthParallel is: characteristic compression strength parallel to grain.
    // leff is: effective buckling length in compression.
    // E005: fifth percentile value of modulus of elasticity

    // Calculate the radius of gyration (i), which is the square root of the second moment of area (I)
    // divided by the cross-sectional area (A). It gives a measure of the distribution of the cross-sectional
    // area and is used to determine the slenderness of the column.
    

    // Calculate the area of the section
    const A = width * height; //[mm^2]

    // Calculate the moment of intertia
    const I = (width * Math.pow(height, 3)) / 12; //[mm^2]

    // Calculate the radious of giration 
    const i = Math.sqrt(I / A);

    // Calculate the slenderness ratio (lambda), which is the effective length of the column (leff)
    // divided by the radius of gyration (i). This ratio is a measure of the column's propensity to buckle:
    // the higher the ratio, the more likely the column is to buckle under compression.
    const lambda = leff / i;

    // Calculate the relative slenderness ratio (lambdaRel). This is a normalized measure of slenderness
    // that takes into account the material properties, specifically the modulus of elasticity.
    // It is calculated by multiplying the slenderness ratio (lambda) by the square root of the ratio
    // of the mean modulus of elasticity (E0mean) over the 5th percentile modulus of elasticity (E005).
    // This gives a relative measure of slenderness with respect to the material's elastic properties.

     // Access tensileStrengthParallel from this.materialProperties
    const compressionStrengthParallel = this.materialProperties.compressionStrengthParallel;
    const lambdaRel = lambda * Math.sqrt(compressionStrengthParallel / E005);

    // Return the calculated relative slenderness ratio.
    return lambdaRel;
    }

   calculateKc(lambdaRel, material) {
    // Set the default value of beta to 1
    let beta = 1;
    
    // Adjust the beta parameter based on material type
    if (material === 'Solid timber') {
        beta = 0.2; // beta for structural timber
    } else if (material === 'LVL' || material === 'Glued laminated timber') {
        beta = 0.1; // beta for LVL or glulam
    }

    // Ensure that lambdaRel is greater than 0.3 to apply the kc calculation.
    // For lambdaRel <= 0.3, the buckling coefficient kc is not needed, as buckling is not a concern.
    if (lambdaRel <= 0.3) {
        return 1; // If lambdaRel is less than or equal to 0.3, return kc as 1 (no buckling effect).
    }
    
    // Calculate the factor 'k' based on lambdaRel and beta. This factor adjusts for the likelihood of buckling.
    const k = 0.5 * (1 + (beta * (lambdaRel - 0.3) + Math.pow(lambdaRel, 2)));

    // Calculate the buckling coefficient 'kc', which modifies the compression strength of the member.
    // The formula for 'kc' takes into account the potential for buckling based on the member's slenderness.
    const kc = 1 / (k + Math.sqrt(Math.pow(k, 2) - Math.pow(lambdaRel, 2)));

    // Return the calculated buckling coefficient 'kc'.
    return kc;
    }

    checkSafety({kc, designForce, designCapacity, width, height}){

        const crossSectionalArea = width * height;

        // Calculate the tensile stress
        let compressionStress = designForce / crossSectionalArea;

        let designCapacity = kc * designCapacity;

        // Calculate the utilization ratio
        let utilizationRatio = compressionStress / designCapacity;

        // Check if the member is safe
        let isSafe = utilizationRatio <= 1; // Safe if utilization ratio is less than or equal to 1

        return {
            compressionStress: compressionStress,
            utilizationRatio: utilizationRatio,
            isSafe: isSafe
        };
    }








   



}




module.exports = CompressionMemberDesign