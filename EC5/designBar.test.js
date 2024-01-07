const TensionMemberDesign = require('./TensionMemberDesign'); // Adjust the path as needed

// Test suite for TensionMemberDesign
describe('TensionMemberDesign', () => {
  it('should calculate design values correctly', () => {
    // Setup the material properties and instantiate the class
    const materialProps = { tensileStrengthParallel: 24, modulusOfElasticity: 12000 };
    const timberMember = new TensionMemberDesign(materialProps);

    // Define test inputs
    const TensileForcePermanent = 50000; // N
    const TensileForceVariable = 25000; // N
    const gammaG = 1.35;
    const gammaQ = 1.5;
    const gammaM = 1.3;

    // Expected design values
    const expectedDesignForce = TensileForcePermanent * gammaG + TensileForceVariable * gammaQ;
    const expectedDesignCapacity = materialProps.tensileStrengthParallel / gammaM;

    // Call the calculateDesignValues method
    const designValues = timberMember.calculateDesignValues(
      TensileForcePermanent,
      TensileForceVariable,
      materialProps.tensileStrengthParallel,
      gammaG,
      gammaQ,
      gammaM
    );

    // Expect the method to return the correct design force and capacity
    expect(designValues.designForce).toBe(expectedDesignForce);
    expect(designValues.designCapacity).toBe(expectedDesignCapacity);
  });

 
});
