const TensionMemberDesign = require('./TensionMemberDesign'); 

// Test suite for TensionMemberDesign
describe('TensionMemberDesign', () => {
  let timberMember;
  let materialProps;
  let TensileForcePermanent, TensileForceVariable, gammaG, gammaQ, gammaM, serviceClass, loadDuration, material;

  // Setup before each test
  beforeEach(() => {
    // Setup the material properties and instantiate the class
    materialProps = { tensileStrengthParallel: 24, modulusOfElasticity: 12000 };
    timberMember = new TensionMemberDesign(materialProps);

    // Define common test inputs
    TensileForcePermanent = 50000; // N
    TensileForceVariable = 25000; // N
    gammaG = 1.35;
    gammaQ = 1.5;
    gammaM = 1.3;
    serviceClass = '1'; // Assuming service class 1 for testing
    loadDuration = 'permanent'; // Assuming permanent load duration for testing
    material = 'Solid timber'; // Assuming material for testing
  });

  it('should calculate design values correctly', () => {
    // Expected design values
    let kmod = timberMember._getKmod(serviceClass, loadDuration, material);
    const expectedDesignForce = TensileForcePermanent * gammaG + TensileForceVariable * gammaQ;
    const expectedDesignCapacity = (materialProps.tensileStrengthParallel * kmod) / gammaM;

    // Call the calculateDesignValues method
    const designValues = timberMember.calculateDesignValues(
      TensileForcePermanent,
      TensileForceVariable,
      gammaG,
      gammaQ,
      gammaM,
      serviceClass,
      loadDuration,
      material
    );

    // Expect the method to return the correct design force and capacity
    expect(designValues.designForce).toBe(expectedDesignForce);
    expect(designValues.designCapacity).toBeCloseTo(expectedDesignCapacity);
  });

});
