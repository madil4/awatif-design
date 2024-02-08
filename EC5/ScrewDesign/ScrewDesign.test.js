const ScrewDesign = require('./ScrewDesign');

describe('ScrewDesign Tests', () => {

  test('Wood-to-wood Single Shear Calculation', () => {
    const f_hk1 = 20;     //N/mm2
    const f_hk2 = 20;     //N/mm2
    const t_1 = 200;      //mm
    const t_2 = 400;      //mm
    const d = 8;          //mm
    const F_axrk = 2000;  //N
    const M_yrk = 9000;   //N/mm

    const F_vRk = calculateScrewShearCapacity_w2w_singleShear(f_hk1, f_hk2, t_1, t_2, d, F_axrk, M_yrk);
  });

});
