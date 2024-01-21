const CompressionMemberDesign = require('./CompressionMemberDesign');

describe('CompressionMemberDesign Tests', () => {
  const materialProperties = {
    compressionStrengthParallel: 18, // MPa
    // ... any other required material properties
  };

  const design = new CompressionMemberDesign(materialProperties);

  test('Design Values Calculation', () => {
    const CompressionForcePermanent = 63937.7; // N
    const CompressionForceVariable = 0; // N
    const gammaG = 1; 
    const gammaQ = 1; // Assuming 1 as no variable force is given
    const gammaM = 1.3; // From image
    const serviceClass = '1'; // Assuming service class 1 for this test case
    const loadDuration = 'permanent'; // Load duration 
    const material = 'Solid timber'; // Material type 
    const kmod = 0.6 // Modification factor

    const designValues = design.calculateDesignValues(
      CompressionForcePermanent,
      CompressionForceVariable,
      gammaG,
      gammaQ,
      gammaM,
      serviceClass,
      loadDuration,
      material
    );

    expect(designValues.designForce).toBeCloseTo(63937.7* gammaG); // Should match the design force calculation
    expect(designValues.designCapacity).toBeCloseTo((18 * kmod) / gammaM); // Should match the design capacity calculation
  });

  test('LambdaRel Calculation', () => {
    const compressionStrengthParallel = 18; // MPa
    const E005 = 6000; // MPa 
    const leff = 1116; // mm
    const width = 50; // mm
    const height = 50; // mm

    const lambdaRel = design.calculateLambdaRel(compressionStrengthParallel, E005, leff, width, height);

    expect(lambdaRel).toBeCloseTo(1.347); 
  });

  test('Kc Calculation', () => {
    const lambdaRel = 1.347; // From previous test case
    const material = 'Solid timber'; 

    const kc = design.calculateKc(lambdaRel, material);

    expect(kc).toBeCloseTo(0.45); // 
  });

  test('Safety Check', () => {
    const kc = 0.45; // From previous test case
    const designForce = 63937.7; // N,
    const designCapacity = 11.077; // MPa
    const width = 50; // mm
    const height = 50; // mm

    const safetyCheck = design.checkSafety({kc, designForce, designCapacity, width, height});

    expect(safetyCheck.compressionStress).toBeCloseTo(25.57508); // MPa
    expect(safetyCheck.utilizationRatio).toBeCloseTo(5.13); 
    expect(safetyCheck.isSafe).toBeFalsy(); // Section is sufficient, hence it is safe
  });
});
