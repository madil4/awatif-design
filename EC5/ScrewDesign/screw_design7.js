

// Function to display the entered text
function calculateScrew() {

    // Access the input fields by their ids
    const diameter = parseFloat(document.getElementById("diameter").value);
    const length = parseFloat(document.getElementById("length").value);
    const thickness1 = parseFloat(document.getElementById("Thickness1").value);
    const thickness2 = parseFloat(document.getElementById("Thickness2").value);
    const alpha = parseFloat(document.getElementById("alpha").value);

    const grade = document.getElementById('timberGrade').value;

    // Call the function with user input values
    const rho_k = getTimberParameters(grade);
    const distancesAxial = get_min_distances_axial(diameter);
    const distancesShear = get_min_distances_shear(diameter, rho_k, alpha);
    const F_axRk = calculateScrewAxialCapacity(diameter, length, thickness1, alpha, 350);

    document.getElementById("ShearCapacity").textContent = "Shear Capacity = " + F_axRk;
    document.getElementById("AxialCapacity").textContent = "Axial Capacity = " + F_axRk;

    document.getElementById("axial_a_1").textContent = "a_1 = " + distancesAxial[0] + " mm";
    document.getElementById("axial_a_2").textContent = "a_2 = " + distancesAxial[1] + " mm";
    document.getElementById("axial_a_1cg").textContent = "a_1cg = " + distancesAxial[2] + " mm";
    document.getElementById("axial_a_2cg").textContent = "a_2cg = " + distancesAxial[3] + " mm";

    document.getElementById("shear_a_1").textContent = "a_1 = " + distancesShear[0] + " mm";
    document.getElementById("shear_a_2").textContent = "a_2 = " + distancesShear[1] + " mm";
    document.getElementById("shear_a_3t").textContent = "a_3t = " + distancesShear[2] + " mm";
    document.getElementById("shear_a_3c").textContent = "a_3c = " + distancesShear[3] + " mm";
    document.getElementById("shear_a_4t").textContent = "a_4t = " + distancesShear[4] + " mm";
    document.getElementById("axial_a_4c").textContent = "a_4c = " + distancesShear[5] + " mm";



}

// Function to display the entered text
function calculateScrew_off() {

    // Access the input fields by their ids
    const diameter = parseFloat(document.getElementById("diameter").value);
    const length = parseFloat(document.getElementById("length").value);
    const thickness1 = parseFloat(document.getElementById("Thickness1").value);
    const thickness2 = parseFloat(document.getElementById("Thickness2").value);
    const alpha = parseFloat(document.getElementById("alpha").value);

    const grade = document.getElementById('timberGrade').value;

    // Call the function with user input values
    const rho_k = getTimberParameters(grade);
    const distancesAxial = get_min_distances_axial(diameter); 
    const [d_h, f_head, f_axk, f_tensk, M_yrk, f_hk] = getScrewParameters(diameter, rho_k);
    const F_axRk = calculateScrewAxialCapacity(diameter, length, thickness1, alpha, rho_k);

    // Display the values in the paragraph elements
    document.getElementById("Test1").textContent = "Test1 = " + f_tensk;
    document.getElementById("Test2").textContent = "Test2 = " + F_axRk;

    document.getElementById("axial_a_1").textContent = "a_1 = " + distancesAxial[0] + " mm";
    document.getElementById("axial_a_2").textContent = "a_2 = " + distancesAxial[1] + " mm";
    document.getElementById("axial_a_1cg").textContent = "a_1cg = " + distancesAxial[2] + " mm";
    document.getElementById("axial_a_2cg").textContent = "a_2cg = " + distancesAxial[3] + " mm";

}

// Function
function getTimberParameters(grade) {

    // Timber parameter
    const L_grade = ["GL24h", "GL28h"];
    const L_rhok = [350, 380];

    // Index
    const index = L_grade.indexOf(grade);

    // Zugriff auf Listenelemente
    const rho_k = L_rhok[index];

    return [rho_k];
}

// Function
function getScrewParameters(diameter, rho_k) {

    // Würth - Screw parameter
    const L_d = [6, 8, 10, 12];
    const L_f_axk = [11.5, 11, 10, 10];
    const L_f_tensk = [11, 20, 32, 45];
    const L_d_h = [14, 22, 25.2, 29.4];
    const L_f_head = [13, 13, 10, 10];

    // Index
    const index = L_d.indexOf(diameter);

    // Zugriff auf Listenelemente
    const d_h = L_d_h[index];
    const f_head = L_f_head[index];
    const f_axk = L_f_axk[index];
    const f_tensk = L_f_tensk[index];
    const M_yrk = 0.15 * 600 * Math.pow(diameter, 2.6);
    const f_hk = (0.082 * rho_k * Math.pow(diameter, -0.3));
    
    return [d_h, f_head, f_axk, f_tensk, M_yrk, f_hk];
}

// Axial load capacity
function calculateScrewAxialCapacity(diameter, length, thickness1, alpha, rho_k) {

    // Get screw parameter
    const [d_h, f_head, f_axk, f_tensk, M_yrk, f_hk] = getScrewParameters(diameter, rho_k);

    // Effective length of the screw
    const l_ef = Math.min(length - thickness1, thickness1);
    
    // Axial load capacity
    // Pull-out resistance
    let k_axk;

    if (alpha <= 45) {
        k_axk = 0.3 + (0.7 * alpha) / 45;
    } else {
        k_axk = 1;
    }

    const F_axrk1 = (k_axk * f_axk * diameter * l_ef) * Math.pow(rho_k / 350, 0.8); // N
    const F_axRk1 = F_axrk1 / 1000; // kN

    // Head pull-through resistance
    const F_headrk = f_head * Math.pow(d_h, 2) * Math.pow(rho_k / 350, 0.8); // N
    const F_headRk = F_headrk / 1000; // kN

    // Tensile strength
    const F_tRk = f_tensk; // kN

    // Resulting axial load capacity
    let F_axRk = 0; // Initialize F_axRk
    let F_axrk = 0; // Initialize F_axrk

    // if query whether head pull-through resistance must be taken into account
    if (thickness1 > 4 * diameter) {
        F_axRk = Math.min(F_axRk1, F_tRk);

        // Conversion to kilonewtons
        F_axrk = Math.min(F_axrk1, F_tRk * 1000);

    } else if (thickness1 < 4 * diameter) {
        F_axRk = Math.min(F_axRk1, F_headRk, F_tRk);

        // Conversion to kilonewtons
        F_axrk = Math.min(F_axrk1, F_headrk, F_tRk * 1000);
    }

    return F_axrk;
}

// Wood to wood connections
// Method to calculate fasteners in single shear
function calculateScrewShearCapacity_w2w_singleShear(f_hk1, f_hk2, t_1, t_2, d, F_axrk, M_yrk) {
       
        const F_vk1 = f_hk1 * t_1 * d;
        const F_vk2 = f_hk2 * t_2 * d;
        const F_vk3 = (((f_hk1 * t_1 * d) / 2) * (Math.sqrt(1 + 2 * (1 + t_2 / t_1 +
                      Math.pow((t_2 / t_1), 2)) + Math.pow((t_2 / t_1), 2)) - (1 + lt_2_ef / t_1)) + F_axrk / 4);
        const F_vk4 = 1.05 * (f_hk1 * t_1 * d) / 3 * (Math.sqrt(4 +
                      (12 * M_yrk) / (f_hk1 * Math.pow(t_1, 2) * d)) - 1) + F_axrk / 4;
        const F_vk5 = 1.05 * (f_hk1 * t_2 * d) / 3 * (Math.sqrt(4 +
                      (12 * M_yrk) / (f_hk1 * Math.pow(t_2, 2) * d)) - 1) + F_axrk / 4;
        const F_vk6 = 1.15 * Math.sqrt(2 * M_yrk * f_hk1 * d) + F_axrk / 4;
        
        // resulting shear capacity
        const F_vrk = Math.min(F_vk1, F_vk2, F_vk3, F_vk4, F_vk5, F_vk6);
}

    // Method to calculate fasteners in double shear
function calculateScrewShearCapacity_w2w_doubleShear(f_hk1, f_hk2, t_1, t_2, d, F_axrk, M_yrk) {
        
        const beta = f_hk2 / f_hk1;
        const F_vk1 = f_hk1 * t_1 * d;
        const F_vk2 = 0.5 * f_hk2 * l_ef * d;
        const F_vk3 = ((1.05* f_hk1 * t_1 * d) / (2+beta)) * (Math.sqrt(2*beta * (1+beta) + (4*beta*(2+beta)+M_yrk)/(f_hk1*d*t_1**2))-beta)+F_axrk/4;
        const F_vk4 = 1.15*Math.sqrt((2*beta)/(1+beta))*Math.sqrt(2*M_yrk*f_hk1*d)+F_axrk/4;

        // resulting shear capacity
        const F_vrk = Math.min(F_vk1, F_vk2, F_vk3, F_vk4);
}

    // Steel to wood connections
    // Method to calculate fasteners in single shear
function calculateScrewShearCapacity_s2w_singleShear(f_hk1, t_1, t_steel, d, F_axrk, M_yrk) {
        
        // Thin steel plate
        if (t_steel <= 0.5*d) {

            const F_vk1 = 0.4 * f_hk1 * t_1 * d;
            const F_vk2 = 1.15 * Math.sqrt(2 * M_yrk * f_hk1 * d) + F_axrk / 4;

            // resulting shear capacity
            const F_vrk = Math.min(F_vk1, F_vk2);

        // Thick steel plate    
        } else if (t_steel >= d) {

            const F_vk1 = f_hk1 * t_1 * d;
            const F_vk2 = f_hk1 * t_1 * d * (Math.sqrt(2 + (4 * M_yrk) / (f_hk1 * d * t_1**2)) - 1) + F_axrk / 4;
            const F_vk3 = 2.3 * Math.sqrt(M_yrk * f_hk1 * d) + F_axrk / 4;

            // resulting shear capacity
            const F_vrk = Math.min(F_vk1, F_vk2, F_vk3);
        }
}

    // Method to calculate fasteners in double shear
function calculateScrewShearCapacity_s2w_doubleShear(f_hk2, t_2, t_steel, d, F_axrk, M_yrk) {
    
        // Thin steel plate
        if (t_steel <= 0.5*d) {

            const F_vk1 = 0.5 * f_hk2 * t_2 * d;
            const F_vk2 = 1.15 * Math.sqrt(2 * M_yrk * f_hk2 * d) + F_axrk / 4;

            // resulting shear capacity
            const F_vrk = Math.min(F_vk1, F_vk2);

        // Thick steel plate    
        } else if (t_steel >= d) {

            const F_vk1 = 0.5 * f_hk2 * t_2 * d;
            const F_vk2 = 2.3 * Math.sqrt(M_yrk * f_hk2 * d) + F_axrk / 4;

            // resulting shear capacity
            const F_vrk = Math.min(F_vk1, F_vk2);
        
        }
}

// _____________________________

function get_min_distances_axial(diameter) {
    const a_1 = 7 * diameter;
    const a_2 = 5 * diameter;
    const a_1cg = 10 * diameter;
    const a_2cg = 4 * diameter;

    return [a_1, a_2, a_1cg, a_2cg];
}

function get_min_distances_shear(diameter, rho_k, alpha) {
    let a_1, a_2, a_3t, a_3c, a_4t, a_4c;

    if (rho_k <= 420) {
        a_1 = diameter < 5 ? (5 + 5 * Math.abs(Math.cos(alpha))) * diameter : (5 + 7 * Math.abs(Math.cos(alpha))) * diameter;
        a_2 = 5 * diameter;
        a_3t = (10 + 5 * Math.cos(alpha)) * diameter;
        a_3c = 10 * diameter;
        a_4t = diameter < 5 ? (5 + 2 * Math.sin(alpha)) * diameter : (5 + 5 * Math.sin(alpha)) * diameter;
        a_4c = 5 * diameter;
    } else {
        a_1 = (7 + 8 * Math.abs(Math.cos(alpha))) * diameter;
        a_2 = 7 * d;
        a_3t = (15 + 5 * Math.cos(alpha)) * diameter;
        a_3c = 15 * diameter;
        a_4t = diameter < 5 ? (7 + 2 * Math.sin(alpha)) * diameter : (7 + 5 * Math.sin(alpha)) * diameter;
        a_4c = 7 * diameter;
    }

    return [Math.round(a_1), Math.round(a_2), Math.round(a_3t), Math.round(a_3c), Math.round(a_4t), Math.round(a_4c)];
}
