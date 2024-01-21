const TensionMemberDesign = require('./TensionMemberDesign');


describe('TensionMemberDesign Tests', () => {
    let timberMember;
    let materialProps;
    let TensileForcePermanent, TensileForceVariable, gammaG, gammaQ, gammaM, serviceClass, loadDuration, material, width, height;

    beforeEach(() => {
        materialProps = { tensileStrengthParallel: 11, modulusOfElasticity: 12000 };
        timberMember = new TensionMemberDesign(materialProps);

        TensileForcePermanent = 8177.42; // N
        TensileForceVariable = 0; // N
        gammaG = 1;
        gammaQ = 1;
        gammaM = 1.3;
        serviceClass = '1';
        loadDuration = 'permanent';
        material = 'Solid timber';
        width = 50; // mm
        height = 50; // mm
    });

    it('should calculate design values correctly', () => {
        let kmod = timberMember._getKmod(serviceClass, loadDuration, material);
        const expectedDesignForce = TensileForcePermanent * gammaG + TensileForceVariable * gammaQ;
        const expectedDesignCapacity = (materialProps.tensileStrengthParallel * kmod) / gammaM;

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

        expect(designValues.designForce).toBe(expectedDesignForce);
        expect(designValues.designCapacity).toBeCloseTo(expectedDesignCapacity, 3);
    });

    it('should calculate safety correctly', () => {
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

        const safetyCheck = timberMember.checkSafety({
            width,
            height,
            designForce: designValues.designForce,
            designCapacity: designValues.designCapacity
        });

        const crossSectionalArea = width * height;
        const expectedTensileStress = designValues.designForce / crossSectionalArea;
        const expectedUtilizationRatio = expectedTensileStress / designValues.designCapacity;
        const expectedIsSafe = expectedUtilizationRatio <= 1;

        expect(safetyCheck.tensileStress).toBeCloseTo(expectedTensileStress, 3);
        expect(safetyCheck.utilizationRatio).toBeCloseTo(expectedUtilizationRatio, 3);
        expect(safetyCheck.isSafe).toBe(expectedIsSafe);
    });
});



