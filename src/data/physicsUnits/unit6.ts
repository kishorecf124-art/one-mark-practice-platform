import { Question } from '../../types';

export const UNIT_6_QUESTIONS: Question[] = [
  {
    id: 'tn12_phy_u6_q1',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 1,
    question: 'The speed of light in an isotropic medium depends on:',
    optionA: 'its intensity',
    optionB: 'its wavelength',
    optionC: 'the nature of propagation',
    optionD: 'the motion of the source w.r.t medium',
    correctAnswer: 'B',
    explanation:
      'In a physical medium, the refractive index varies with wavelength (dispersion), so the speed of light v = c / n(λ) depends directly on the wavelength of light.',
  },
  {
    id: 'tn12_phy_u6_q2',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 2,
    question:
      'A rod of length 10 cm lies along the principal axis of a concave mirror of focal length 10 cm in such a way that its end closer to the pole is 20 cm away from the mirror. The length of the image is:',
    optionA: '2.5 cm',
    optionB: '5 cm',
    optionC: '10 cm',
    optionD: '15 cm',
    correctAnswer: 'B',
    explanation:
      'Closer end is at u₁ = -20 cm (at center of curvature C = 2f = 20 cm), so its image is at v₁ = -20 cm. The farther end is at u₂ = -30 cm: 1/v₂ = 1/(-10) - 1/(-30) = -2/30 = -1/15 ⇒ v₂ = -15 cm. The length of the image is |v₁ - v₂| = |20 - 15| = 5 cm.',
  },
  {
    id: 'tn12_phy_u6_q3',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 3,
    question:
      'An object is placed in front of a convex mirror of focal length f. The maximum and minimum distance of an object from the mirror such that the image formed is real and magnified is:',
    optionA: '2f and c',
    optionB: 'c and ∞',
    optionC: 'f and O',
    optionD: 'None of these',
    correctAnswer: 'D',
    explanation:
      'A convex mirror always forms a virtual, erect, and diminished image for all real object positions; it can never form a real and magnified image of a real object.',
  },
  {
    id: 'tn12_phy_u6_q4',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 4,
    question: 'For light incident from air on a slab of refractive index 2, the maximum possible angle of refraction is:',
    optionA: '30°',
    optionB: '45°',
    optionC: '60°',
    optionD: '90°',
    correctAnswer: 'A',
    explanation:
      'By Snell’s law: 1 · sin i = n · sin r ⇒ sin r = (sin i) / n. Maximum possible angle of incidence is i = 90° (sin 90° = 1), so sin r_max = 1 / 2 ⇒ r_max = 30°.',
  },
  {
    id: 'tn12_phy_u6_q5',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 5,
    question:
      'If the velocity and wavelength of light in air is V_a and λ_a and that in water is V_w and λ_w, then the refractive index of water is:',
    optionA: 'V_w / V_a',
    optionB: 'V_a / V_w',
    optionC: 'λ_w / λ_a',
    optionD: 'V_a λ_a / (V_w λ_w)',
    correctAnswer: 'B',
    explanation: 'Refractive index of water relative to air is defined as n_w = (Speed of light in air) / (Speed of light in water) = V_a / V_w.',
  },
  {
    id: 'tn12_phy_u6_q6',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 6,
    question: 'Stars twinkle due to:',
    optionA: 'reflection',
    optionB: 'total internal reflection',
    optionC: 'refraction',
    optionD: 'polarisation',
    correctAnswer: 'C',
    explanation:
      'Twinkling of stars is caused by atmospheric refraction through layers of air with fluctuating temperatures and optical densities.',
  },
  {
    id: 'tn12_phy_u6_q7',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 7,
    question:
      'When a biconvex lens of glass having refractive index 1.47 is dipped in a liquid, it acts as a plane sheet of glass. This implies that the liquid must have refractive index:',
    optionA: 'less than one',
    optionB: 'less than that of glass',
    optionC: 'greater than that of glass',
    optionD: 'equal to that of glass',
    correctAnswer: 'D',
    explanation:
      'By lens maker formula: 1/f = (n_lens/n_liquid - 1) (1/R₁ - 1/R₂). If the lens behaves as a plane sheet (1/f = 0), then n_lens / n_liquid = 1 ⇒ n_liquid = n_lens = 1.47.',
  },
  {
    id: 'tn12_phy_u6_q8',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 8,
    question:
      'The radius of curvature of curved surface of a thin planoconvex lens is 10 cm and the refractive index is 1.5. If the plane surface is silvered, then the focal length will be:',
    optionA: '5 cm',
    optionB: '10 cm',
    optionC: '15 cm',
    optionD: '20 cm',
    correctAnswer: 'B',
    explanation:
      'Focal length of lens f_l = R / (n - 1) = 10 / (1.5 - 1) = 20 cm. For silvered plane surface, power P = 2 P_l + P_m = 2/f_l + 1/f_m = 2/20 + 0 = 1/10 cm⁻¹ ⇒ effective focal length F = 10 cm.',
  },
  {
    id: 'tn12_phy_u6_q9',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 9,
    question:
      'An air bubble in a glass slab of refractive index 1.5 is 5 cm deep when viewed from one surface and 3 cm deep when viewed from the opposite face. The thickness of the slab is:',
    optionA: '8 cm',
    optionB: '10 cm',
    optionC: '12 cm',
    optionD: '16 cm',
    correctAnswer: 'C',
    explanation:
      'Apparent depths d₁ = x / n and d₂ = (t - x) / n. Sum of apparent depths d₁ + d₂ = t / n ⇒ 5 + 3 = t / 1.5 ⇒ t = 8 × 1.5 = 12 cm.',
  },
  {
    id: 'tn12_phy_u6_q10',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_6',
    questionNumber: 10,
    question:
      'A ray of light travelling in a transparent medium of refractive index n falls on a surface separating the medium from air at an angle of incidence of 45°. The ray can undergo total internal reflection for:',
    optionA: 'n = 1.25',
    optionB: 'n = 1.33',
    optionC: 'n = 1.4',
    optionD: 'n = 1.5',
    correctAnswer: 'D',
    explanation:
      'Condition for TIR: i > i_c ⇒ sin i > sin i_c = 1/n ⇒ sin 45° > 1/n ⇒ 1/√2 > 1/n ⇒ n > √2 ≈ 1.414. Among the choices, only n = 1.5 satisfies n > 1.414.',
  },
];
