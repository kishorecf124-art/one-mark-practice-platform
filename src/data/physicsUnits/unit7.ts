import { Question } from '../../types';
import { PHYSICS_DIAGRAMS } from '../physicsDiagrams';

export const UNIT_7_QUESTIONS: Question[] = [
  {
    id: 'tn12_phy_u7_q1',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 1,
    question:
      'A plane glass plate is placed over letters of various colours (violet, green, yellow, red). The letter which appears to be raised more is:',
    optionA: 'red',
    optionB: 'yellow',
    optionC: 'green',
    optionD: 'violet',
    correctAnswer: 'D',
    explanation:
      'Apparent upward shift is Δt = t(1 - 1/n). Since violet light has the shortest wavelength, glass has the highest refractive index for violet (Cauchy’s relation), making the violet letter appear raised the most.',
  },
  {
    id: 'tn12_phy_u7_q2',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 2,
    question:
      'Two point white dots are 1 mm apart on a black paper. They are viewed by eye of pupil diameter 3 mm approximately. The maximum distance at which these dots can be resolved by the eye is: [take λ = 500 nm]',
    optionA: '1 m',
    optionB: '5 m',
    optionC: '3 m',
    optionD: '6 m',
    correctAnswer: 'B',
    explanation:
      'By Rayleigh’s criterion: θ = 1.22 λ / D = y / L ⇒ L = (y · D) / (1.22 λ) = (10⁻³ × 3 × 10⁻³) / (1.22 × 500 × 10⁻⁹) ≈ 4.92 m ≈ 5 m.',
  },
  {
    id: 'tn12_phy_u7_q3',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 3,
    question:
      'In a Young’s double-slit experiment, the slit separation is doubled. To maintain the same fringe spacing on the screen, the screen-to-slit distance D must be changed to:',
    optionA: '2D',
    optionB: 'D/2',
    optionC: '√2 D',
    optionD: 'D / √2',
    correctAnswer: 'A',
    explanation:
      'Fringe width β = λ D / d. If d becomes 2d, to keep β unchanged, D must be doubled to 2D so that β\' = λ (2D) / (2d) = β.',
  },
  {
    id: 'tn12_phy_u7_q4',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 4,
    question:
      'Two coherent monochromatic light beams of intensities I and 4I are superposed. The maximum and minimum possible intensities in the resulting beam are:',
    optionA: '5I and I',
    optionB: '5I and 3I',
    optionC: '9I and I',
    optionD: '9I and 3I',
    correctAnswer: 'C',
    explanation:
      'I_max = (√I₁ + √I₂)² = (√I + √4I)² = (√I + 2√I)² = (3√I)² = 9I. I_min = (√I₂ - √I₁)² = (2√I - √I)² = I.',
  },
  {
    id: 'tn12_phy_u7_q5',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 5,
    question:
      'When light is incident on a soap film of thickness 5 × 10⁻⁵ cm, the wavelength of light reflected maximum in the visible region is 5320 Å. Refractive index of the film will be:',
    optionA: '1.22',
    optionB: '1.33',
    optionC: '1.51',
    optionD: '1.83',
    correctAnswer: 'B',
    explanation:
      'For constructive interference in reflected light from thin film: 2μt = (m + 1/2)λ. Substituting t = 5 × 10⁻⁷ m, λ = 5320 × 10⁻¹⁰ m gives μ = 1.33.',
  },
  {
    id: 'tn12_phy_u7_q6',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 6,
    question:
      'First diffraction minimum due to a single slit of width 1.0 × 10⁻⁵ cm is at 30°. Then wavelength of light used is:',
    optionA: '400 Å',
    optionB: '500 Å',
    optionC: '600 Å',
    optionD: '700 Å',
    correctAnswer: 'B',
    explanation:
      'For single slit minimum: a sin θ = n λ ⇒ (1.0 × 10⁻⁵ cm) sin 30° = 1 × λ ⇒ λ = 1.0 × 10⁻⁷ m × 0.5 = 5.0 × 10⁻⁸ m = 500 Å.',
  },
  {
    id: 'tn12_phy_u7_q7',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 7,
    question:
      'A ray of light strikes a glass plate at an angle of 60°. If the reflected and refracted rays are perpendicular to each other, the refractive index of the glass is:',
    optionA: '√3',
    optionB: '3/2',
    optionC: '√(3/2)',
    optionD: '2',
    correctAnswer: 'A',
    explanation: 'By Brewster’s law, when reflected and refracted rays are mutually perpendicular, i_p = 60°, and n = tan(i_p) = tan 60° = √3.',
  },
  {
    id: 'tn12_phy_u7_q8',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 8,
    imageUrl: PHYSICS_DIAGRAMS.u7_q8,
    question:
      'One of the slits of Young’s double slit setup is covered with a glass plate. The position of central maximum will:',
    optionA: 'get shifted downwards',
    optionB: 'get shifted upwards',
    optionC: 'will remain the same',
    optionD: 'data insufficient to conclude',
    correctAnswer: 'B',
    explanation:
      'Introducing a transparent sheet of refractive index n and thickness t introduces an optical path difference of (n - 1)t, which shifts the central fringe towards the side of the covered slit (upwards).',
  },
  {
    id: 'tn12_phy_u7_q9',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 9,
    question: 'Light transmitted by a Nicol prism is:',
    optionA: 'partially polarised',
    optionB: 'unpolarised',
    optionC: 'plane polarised',
    optionD: 'elliptically polarized',
    correctAnswer: 'C',
    explanation:
      'A Nicol prism eliminates the extra-ordinary ray by total internal reflection at the Canada balsam layer, transmitting only the linearly (plane) polarized extraordinary ray.',
  },
  {
    id: 'tn12_phy_u7_q10',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_7',
    questionNumber: 10,
    question: 'The transverse nature of light is demonstrated by:',
    optionA: 'interference',
    optionB: 'diffraction',
    optionC: 'scattering',
    optionD: 'polarization',
    correctAnswer: 'D',
    explanation:
      'Interference and diffraction occur in all wave types (transverse and longitudinal), but only transverse waves can undergo polarization.',
  },
];
