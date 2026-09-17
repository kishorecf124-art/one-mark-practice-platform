import { Question } from '../../types';

export const UNIT_8_QUESTIONS: Question[] = [
  {
    id: 'tn12_phy_u8_q1',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 1,
    question: 'The wavelength λ_e of an electron and λ_p of a photon of the same energy E are related by:',
    optionA: 'λ_p ∝ λ_e',
    optionB: 'λ_p ∝ √λ_e',
    optionC: 'λ_p ∝ 1 / √λ_e',
    optionD: 'λ_p ∝ λ_e²',
    correctAnswer: 'D',
    explanation:
      'For electron: λ_e = h / √(2m E) ⇒ E = h² / (2m λ_e²). For photon: λ_p = hc / E = hc / [h² / (2m λ_e²)] = (2mc / h) λ_e². Thus λ_p ∝ λ_e².',
  },
  {
    id: 'tn12_phy_u8_q2',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 2,
    question:
      'In an electron microscope, the electrons are accelerated by a voltage of 14 kV. If the voltage is changed to 224 kV, then the de Broglie wavelength associated with the electrons would:',
    optionA: 'increase by 2 times',
    optionB: 'decrease by 2 times',
    optionC: 'decrease by 4 times',
    optionD: 'increase by 4 times',
    correctAnswer: 'C',
    explanation: 'λ = h / √(2m e V) ∝ 1 / √V. Ratio λ₂ / λ₁ = √(V₁ / V₂) = √(14 / 224) = √(1 / 16) = 1/4 (decreases by 4 times).',
  },
  {
    id: 'tn12_phy_u8_q3',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 3,
    question:
      'The wave associated with a moving particle of mass 3 × 10⁻⁶ g has the same wavelength as an electron moving with a velocity of 6 × 10⁶ m s⁻¹. The velocity of the particle is:',
    optionA: '1.82 × 10⁻¹⁸ m s⁻¹',
    optionB: '9 × 10⁻² m s⁻¹',
    optionC: '3 × 10⁻³¹ m s⁻¹',
    optionD: '1.82 × 10⁻¹⁵ m s⁻¹',
    correctAnswer: 'D',
    explanation:
      'λ = h / (m_p v_p) = h / (m_e v_e) ⇒ v_p = (m_e v_e) / m_p = (9.11 × 10⁻³¹ kg × 6 × 10⁶ m/s) / (3 × 10⁻⁹ kg) = 1.82 × 10⁻¹⁵ m s⁻¹.',
  },
  {
    id: 'tn12_phy_u8_q4',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 4,
    question:
      'When a metallic surface is illuminated with radiation of wavelength λ, the stopping potential is V. If the same surface is illuminated with radiation of wavelength 2λ, the stopping potential is V/4. The threshold wavelength for the metallic surface is:',
    optionA: '4λ',
    optionB: '5λ',
    optionC: '5/2 λ',
    optionD: '3λ',
    correctAnswer: 'D',
    explanation:
      'eV = hc/λ - W and e(V/4) = hc/(2λ) - W. Multiplying the second equation by 4: eV = 2hc/λ - 4W. Equating both: hc/λ - W = 2hc/λ - 4W ⇒ 3W = hc/λ ⇒ W = hc / (3λ). Therefore, threshold wavelength λ₀ = hc / W = 3λ.',
  },
  {
    id: 'tn12_phy_u8_q5',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 5,
    question:
      'If a light of wavelength 330 nm is incident on a metal with work function 3.55 eV, electrons are emitted. Then the de Broglie wavelength of the wave associated with the emitted electron is: (h = 6.6 × 10⁻³⁴ J s)',
    optionA: '< 2.75 × 10⁻⁹ m',
    optionB: '≥ 2.75 × 10⁻⁹ m',
    optionC: '≤ 2.75 × 10⁻¹² m',
    optionD: '< 2.75 × 10⁻¹⁰ m',
    correctAnswer: 'B',
    explanation:
      'Photon energy E = hc / λ = (6.6 × 10⁻³⁴ × 3 × 10⁸) / (330 × 10⁻⁹ × 1.6 × 10⁻¹⁹) = 3.75 eV. Maximum KE = E - W = 3.75 - 3.55 = 0.20 eV. Since KE ≤ KE_max, λ_e = h / √(2m KE) ≥ λ_min ≈ 2.75 × 10⁻⁹ m.',
  },
  {
    id: 'tn12_phy_u8_q6',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 6,
    question:
      'A photoelectric surface is illuminated successively by monochromatic light of wavelength λ and λ/2. If the maximum kinetic energy of the emitted photoelectrons in the second case is 3 times that in the first case, the work function of the material is:',
    optionA: 'hc / λ',
    optionB: '2hc / λ',
    optionC: 'hc / (3λ)',
    optionD: 'hc / (2λ)',
    correctAnswer: 'D',
    explanation:
      'K₁ = hc/λ - W and K₂ = 2hc/λ - W. Given K₂ = 3K₁ ⇒ 2hc/λ - W = 3(hc/λ - W) = 3hc/λ - 3W ⇒ 2W = hc/λ ⇒ W = hc / (2λ).',
  },
  {
    id: 'tn12_phy_u8_q7',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 7,
    question:
      'In photoelectric emission, a radiation whose frequency is 4 times the threshold frequency of a certain metal is incident on the metal. Then the maximum possible velocity of the emitted electron will be:',
    optionA: '√(h ν₀ / m)',
    optionB: '√(6 h ν₀ / m)',
    optionC: '2 √(h ν₀ / m)',
    optionD: '√(h ν₀ / (2m))',
    correctAnswer: 'B',
    explanation:
      'KE_max = 1/2 m v_max² = h(4ν₀) - hν₀ = 3hν₀ ⇒ v_max² = 6hν₀ / m ⇒ v_max = √(6hν₀ / m).',
  },
  {
    id: 'tn12_phy_u8_q8',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 8,
    question:
      'Two radiations with photon energies 0.9 eV and 3.3 eV respectively are falling on a metallic surface successively. If the work function of the metal is 0.6 eV, then the ratio of maximum speeds of emitted electrons in the two cases will be:',
    optionA: '1:4',
    optionB: '1:3',
    optionC: '1:1',
    optionD: '1:9',
    correctAnswer: 'B',
    explanation:
      'KE₁ = 0.9 - 0.6 = 0.3 eV. KE₂ = 3.3 - 0.6 = 2.7 eV. v₁ / v₂ = √(KE₁ / KE₂) = √(0.3 / 2.7) = √(1/9) = 1/3.',
  },
  {
    id: 'tn12_phy_u8_q9',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 9,
    question:
      'A light source of wavelength 520 nm emits 1.04 × 10¹⁵ photons per second while a second source of 460 nm produces 1.38 × 10¹⁵ photons per second. The ratio of power of the second source to that of the first source is:',
    optionA: '1.00',
    optionB: '1.02',
    optionC: '1.5',
    optionD: '0.98',
    correctAnswer: 'C',
    explanation:
      'Power P = n (hc / λ). Ratio P₂ / P₁ = (n₂ / n₁) × (λ₁ / λ₂) = (1.38 × 10¹⁵ / 1.04 × 10¹⁵) × (520 / 460) = 1.3269 × 1.1304 ≈ 1.50.',
  },
  {
    id: 'tn12_phy_u8_q10',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 10,
    question:
      'If the mean wavelength of light from the sun is taken as 550 nm and its mean power as 3.8 × 10²⁶ W, then the number of photons emitted per second from the sun is of the order of:',
    optionA: '10⁴⁵',
    optionB: '10⁴²',
    optionC: '10⁵⁴',
    optionD: '10⁵¹',
    correctAnswer: 'A',
    explanation:
      'Energy of each photon E = hc / λ = (6.63 × 10⁻³⁴ × 3 × 10⁸) / (550 × 10⁻⁹) ≈ 3.61 × 10⁻¹⁹ J. Number of photons per second N = P / E = (3.8 × 10²⁶) / (3.61 × 10⁻¹⁹) ≈ 1.05 × 10⁴⁵ photons/s.',
  },
  {
    id: 'tn12_phy_u8_q11',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 11,
    question: 'The threshold wavelength for a metal surface whose photoelectric work function is 3.313 eV is:',
    optionA: '4125 Å',
    optionB: '3750 Å',
    optionC: '6000 Å',
    optionD: '2062.5 Å',
    correctAnswer: 'B',
    explanation:
      'λ₀ = hc / W = (6.626 × 10⁻³⁴ × 3 × 10⁸) / (3.313 × 1.6 × 10⁻¹⁹) = 1.9878 × 10⁻²⁵ / 5.3008 × 10⁻¹⁹ = 3.75 × 10⁻⁷ m = 3750 Å.',
  },
  {
    id: 'tn12_phy_u8_q12',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 12,
    question:
      'A light of wavelength 500 nm is incident on a sensitive metal plate of photoelectric work function 1.235 eV. The kinetic energy of the photoelectrons emitted is: (h = 6.6 × 10⁻³⁴ J s)',
    optionA: '0.58 eV',
    optionB: '2.48 eV',
    optionC: '1.24 eV',
    optionD: '1.16 eV',
    correctAnswer: 'C',
    explanation:
      'Photon energy E = hc / λ = 1240 eV·nm / 500 nm = 2.48 eV. KE = E - W = 2.48 - 1.235 = 1.245 ≈ 1.24 eV.',
  },
  {
    id: 'tn12_phy_u8_q13',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 13,
    question:
      'Photons of wavelength λ are incident on a metal. The most energetic electrons ejected from the metal are bent into a circular arc of radius R by a perpendicular magnetic field of magnitude B. The work function of the metal is:',
    optionA: 'hc/λ - m_e + (e² B² R²) / (2 m_e)',
    optionB: 'hc/λ + 2m_e + [e B R / (2 m_e)]²',
    optionC: 'hc/λ - m_e c² - (e² B² R²) / (2 m_e)',
    optionD: 'hc/λ - (e² B² R²) / (2 m_e)',
    correctAnswer: 'D',
    explanation:
      'In magnetic field, e v B = m v² / R ⇒ p = m v = e B R. KE_max = p² / (2m_e) = (e B R)² / (2m_e). By photoelectric equation: W = hc/λ - KE_max = hc/λ - (e² B² R²) / (2m_e).',
  },
  {
    id: 'tn12_phy_u8_q14',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 14,
    question:
      'The work functions for metals A, B and C are 1.92 eV, 2.0 eV and 5.0 eV respectively. The metal(s) which will emit photoelectrons for a radiation of wavelength 4100 Å is/are:',
    optionA: 'A only',
    optionB: 'both A and B',
    optionC: 'all these metals',
    optionD: 'none',
    correctAnswer: 'B',
    explanation:
      'Incident photon energy E = hc / λ = 12400 / 4100 ≈ 3.02 eV. Since E > W_A (1.92 eV) and E > W_B (2.0 eV), metals A and B will emit photoelectrons. Metal C has W_C = 5.0 eV > 3.02 eV, so no emission from C.',
  },
  {
    id: 'tn12_phy_u8_q15',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_8',
    questionNumber: 15,
    question: 'Emission of electrons by the absorption of heat energy is called:',
    optionA: 'photoelectric emission',
    optionB: 'field emission',
    optionC: 'thermionic emission',
    optionD: 'secondary emission',
    correctAnswer: 'C',
    explanation:
      'Thermionic emission is the process by which free electrons are emitted from the surface of a metal when supplied with thermal (heat) energy.',
  },
];
