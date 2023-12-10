function checkWoodColumnDesign({
    E, 
    E_min, 
    Fc, 
    C_F, 
    C_M, 
    C_t, 
    C_i, 
    C_D, 
    C_T, 
    b, 
    d, 
    length, 
    C_sawn = 0.8 // Default value for C_sawn
}) {

  // Area 
  let area = b * d; // Calculate Area 

  // Adjusted modulus ASD modulus of elasticity for column buckling
  let E_adjust = E * C_M * C_t * C_i;
  let E_min_adjust = E_min * C_M * C_i * C_t * C_T;

  return {
    E_adjust,
    E_min_adjust
  };
}





let results = checkWoodColumnDesign({
    E: 1400000, //(psi)
    E_min: 510000, //(psi) 
    le_d: 20,
    Fc: 1450,
    C_F: 1.0,
    C_M: 1.0,
    C_t: 1.0,
    C_i: 1.0,
    C_D: 1.0,
    C_T: 1.0,
    b: 3,
    d: 3,
    
});



console.log(results);
