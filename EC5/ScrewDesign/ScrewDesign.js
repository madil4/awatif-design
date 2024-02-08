
class TimberScrewDesign {

    // Wood to wood connections
    // Method to calculate fasteners in single shear
    calculateScrewShearCapacity_w2w_singleShear(f_hk1, f_hk2, t_1, t_2, d, F_axrk, M_yrk) {
       
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
    calculateScrewShearCapacity_w2w_doubleShear(f_hk1, f_hk2, t_1, t_2, d, F_axrk, M_yrk) {
        
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
    calculateScrewShearCapacity_s2w_singleShear(f_hk1, t_1, t_steel, d, F_axrk, M_yrk) {
        
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
    calculateScrewShearCapacity_s2w_doubleShear(f_hk2, t_2, t_steel, d, F_axrk, M_yrk) {
    
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
}