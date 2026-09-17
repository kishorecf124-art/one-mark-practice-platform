import { Question } from '../../types';
import { PHYSICS_DIAGRAMS } from '../physicsDiagrams';

export const UNIT_3_QUESTIONS: Question[] = [
  {
    id: 'tn12_phy_u3_q1',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 1,
    imageUrl: PHYSICS_DIAGRAMS.u3_q1,
    question: 'The magnetic field at the center O of the circular current loop of radius r carrying current I is:',
    optionA: '(μ₀ I) / (4r) ⊗',
    optionB: '(μ₀ I) / (4r) ⊙',
    optionC: '(μ₀ I) / (2r)',
    optionD: '(μ₀ I) / (2r) ⊙',
    correctAnswer: 'A',
    explanation:
      'For a semi-circular arc of radius r carrying current I, the magnetic field at the center is B = (μ₀ I) / (4r). Using the right-hand grip rule, the direction is perpendicular and pointing into the page (⊗).',
  },
  {
    id: 'tn12_phy_u3_q2',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 2,
    imageUrl: PHYSICS_DIAGRAMS.u3_q2,
    question:
      'An electron moves in a straight line inside a charged parallel plate capacitor of uniform charge density σ. The time taken by the electron to cross the parallel plate capacitor of length l undeflected when the plates are kept under constant magnetic field of induction B⃗ is:',
    optionA: 'ε₀ (e l B / σ)',
    optionB: 'ε₀ (l B / σ e)',
    optionC: 'ε₀ (l B / e σ)',
    optionD: 'ε₀ (l B / σ)',
    correctAnswer: 'D',
    explanation:
      'For undeflected motion, electric force equals magnetic force: e E = e v B ⇒ v = E / B = σ / (ε₀ B). The time taken to traverse length l is t = l / v = l / [σ / (ε₀ B)] = ε₀ (l B / σ).',
  },
  {
    id: 'tn12_phy_u3_q3',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 3,
    question:
      'A particle having mass m and charge q is accelerated through a potential difference V. Find the force experienced when it is kept under a perpendicular magnetic field B⃗:',
    optionA: '√(2q³ B V / m)',
    optionB: '√(q³ B² V / (2m))',
    optionC: '√(2q³ B² V / m)',
    optionD: '√(2q³ B V / m³)',
    correctAnswer: 'C',
    explanation:
      'Kinetic energy = 1/2 m v² = q V ⇒ v = √(2qV / m). Perpendicular Lorentz force F = q v B = q B √(2qV / m) = √(2 q³ B² V / m).',
  },
  {
    id: 'tn12_phy_u3_q4',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 4,
    question:
      'A circular coil of radius 5 cm and 50 turns carries a current of 3 ampere. The magnetic dipole moment of the coil is nearly:',
    optionA: '1.0 A m²',
    optionB: '1.2 A m²',
    optionC: '0.5 A m²',
    optionD: '0.8 A m²',
    correctAnswer: 'B',
    explanation:
      'M = N I A = N I (π r²) = 50 × 3 × π × (0.05)² = 150 × 3.1416 × 0.0025 = 1.178 ≈ 1.2 A m².',
  },
  {
    id: 'tn12_phy_u3_q5',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 5,
    question:
      'A thin insulated wire forms a plane spiral of N = 100 tight turns carrying a current I = 8 mA. The radii of inside and outside turns are a = 50 mm and b = 100 mm respectively. The magnetic induction at the center of the spiral is:',
    optionA: '5 μT',
    optionB: '7 μT',
    optionC: '8 μT',
    optionD: '10 μT',
    correctAnswer: 'B',
    explanation:
      'B = [μ₀ N I / (2(b - a))] ln(b / a) = [(4π × 10⁻⁷ × 100 × 8 × 10⁻³) / (2 × 0.05)] ln(2) ≈ 7 μT.',
  },
  {
    id: 'tn12_phy_u3_q6',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 6,
    question:
      'Three wires of equal lengths are bent in the form of loops: a circle, a semi-circle, and a square. They are placed in a uniform magnetic field with the same electric current passed through them. Which loop configuration will experience greater torque?',
    optionA: 'circle',
    optionB: 'semi-circle',
    optionC: 'square',
    optionD: 'all of them',
    correctAnswer: 'A',
    explanation:
      'Torque τ = M B sin θ = I A B sin θ. For a given perimeter/wire length, a circle encloses the maximum area (A = L² / (4π)), thus giving the largest magnetic dipole moment and experiencing the greatest torque.',
  },
  {
    id: 'tn12_phy_u3_q7',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 7,
    imageUrl: PHYSICS_DIAGRAMS.u3_q7,
    question:
      'Two identical coils, each with N turns and radius R are placed coaxially at a distance R. If I is the current passing through the loops in the same direction, then the magnetic field at a point P at a distance of R/2 from the centre of each coil is:',
    optionA: '(8 N μ₀ I) / (√5 R)',
    optionB: '(8 N μ₀ I) / (5^(3/2) R)',
    optionC: '(8 N μ₀ I) / (5 R)',
    optionD: '(4 N μ₀ I) / (√5 R)',
    correctAnswer: 'B',
    explanation:
      'This is the Helmholtz coil arrangement. The field at the midpoint is B = 2 × [μ₀ N I R² / (2(R² + (R/2)²)^(3/2))] = (8 N μ₀ I) / (5^(3/2) R).',
  },
  {
    id: 'tn12_phy_u3_q8',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 8,
    question:
      'A wire of length l carrying a current I along the Y direction is kept in a magnetic field given by B⃗ = (B / √3)(î + ĵ + k̂). The magnitude of Lorentz force acting on the wire is:',
    optionA: '√(2/3) B I l',
    optionB: '(1 / √3) B I l',
    optionC: '√2 B I l',
    optionD: '(1 / √2) B I l',
    correctAnswer: 'A',
    explanation:
      'F⃗ = I(L⃗ × B⃗) = I (l ĵ) × [(B / √3)(î + ĵ + k̂)] = (I l B / √3) [-k̂ + î]. Magnitude |F⃗| = (I l B / √3) √(1² + (-1)²) = √(2/3) B I l.',
  },
  {
    id: 'tn12_phy_u3_q9',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 9,
    imageUrl: PHYSICS_DIAGRAMS.u3_q9,
    question:
      'A bar magnet of length l and magnetic moment p_m is bent in the form of an arc subtending 60° at the center. The new magnetic dipole moment will be:',
    optionA: 'p_m',
    optionB: '(3 / π) p_m',
    optionC: '(2 / π) p_m',
    optionD: '(1 / 2) p_m',
    correctAnswer: 'B',
    explanation:
      'Arc length l = R θ = R (π/3) ⇒ R = 3l / π. The chord distance between the poles is d = 2 R sin(θ/2) = 2 R sin 30° = R = 3l / π. New magnetic dipole moment p_m\' = m · d = m (3l / π) = (3 / π) p_m.',
  },
  {
    id: 'tn12_phy_u3_q10',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 10,
    question:
      'A non-conducting charged ring carrying a charge of q, mass m and radius r is rotated about its axis with constant angular speed ω. The ratio of its magnetic moment to its angular momentum is:',
    optionA: 'q / m',
    optionB: '2q / m',
    optionC: 'q / (2m)',
    optionD: 'q / (4m)',
    correctAnswer: 'C',
    explanation:
      'Magnetic moment M = I_current × A = (q ω / 2π) × (π r²) = 1/2 q ω r². Angular momentum L = I_moment × ω = (m r²) ω. Ratio M / L = (1/2 q ω r²) / (m r² ω) = q / (2m) (gyromagnetic ratio).',
  },
  {
    id: 'tn12_phy_u3_q11',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 11,
    imageUrl: PHYSICS_DIAGRAMS.u3_q11,
    question:
      'The B-H curve for a ferromagnetic material shows coercivity H_c = 150 A m⁻¹. The material is placed inside a long solenoid containing 1000 turns/cm. The current that should be passed in the solenoid to demagnetize the ferromagnet completely is:',
    optionA: '1.00 mA',
    optionB: '1.25 mA',
    optionC: '1.50 mA',
    optionD: '1.75 mA',
    correctAnswer: 'C',
    explanation:
      'Coercivity H_c = n I. Here n = 1000 turns/cm = 100,000 turns/m = 10⁵ turns/m. So I = H_c / n = 150 / 10⁵ = 1.50 × 10⁻³ A = 1.50 mA.',
  },
  {
    id: 'tn12_phy_u3_q12',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 12,
    question:
      'Two short bar magnets have magnetic moments 1.20 A m² and 1.00 A m² respectively. They are kept on a horizontal table parallel to each other with their north poles pointing south. They have a common magnetic equator and are separated by 20.0 cm. The value of resultant horizontal magnetic induction at the midpoint O of the line joining their centers is (B_H = 3.6 × 10⁻⁵ Wb m⁻²):',
    optionA: '3.60 × 10⁻⁵ Wb m⁻²',
    optionB: '3.5 × 10⁻⁵ Wb m⁻²',
    optionC: '2.56 × 10⁻⁴ Wb m⁻²',
    optionD: '2.2 × 10⁻⁴ Wb m⁻²',
    correctAnswer: 'C',
    explanation:
      'Distance from each magnet to midpoint r = 10 cm = 0.1 m. Magnetic fields at equatorial points add up: B_eq = (μ₀ / 4π) · (M₁ + M₂) / r³ = 10⁻⁷ × (1.20 + 1.00) / (0.1)³ = 2.2 × 10⁻⁴ Wb m⁻². Adding Earth’s component gives B_total = 2.56 × 10⁻⁴ Wb m⁻².',
  },
  {
    id: 'tn12_phy_u3_q13',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 13,
    question:
      'The vertical component of Earth’s magnetic field at a place is equal to the horizontal component. What is the value of angle of dip at this place?',
    optionA: '30°',
    optionB: '45°',
    optionC: '60°',
    optionD: '90°',
    correctAnswer: 'B',
    explanation:
      'tan δ = B_V / B_H. Given B_V = B_H, tan δ = 1 ⇒ angle of dip δ = 45°.',
  },
  {
    id: 'tn12_phy_u3_q14',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 14,
    question:
      'A flat dielectric disc of radius R carries an excess charge of surface density σ. The disc rotates about its axis with angular velocity ω in a uniform magnetic field B directed perpendicular to the axis of rotation. The magnitude of torque on the disc is:',
    optionA: '1/4 σ ω π B R',
    optionB: '1/2 σ ω π B R²',
    optionC: '1/4 σ ω π B R³',
    optionD: '1/4 σ ω π B R⁴',
    correctAnswer: 'D',
    explanation:
      'Magnetic dipole moment of rotating charged disc M = ∫₀^R (1/2) (2π r dr σ ω / 2π) (π r²) = (1/4) π σ ω R⁴. Torque τ = M × B = (1/4) σ ω π B R⁴.',
  },
  {
    id: 'tn12_phy_u3_q15',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_3',
    questionNumber: 15,
    question:
      'The potential energy of a magnetic dipole whose dipole moment is p⃗_m = (-0.5î + 0.4ĵ) A m² kept in a uniform magnetic field B⃗ = 0.2î T is:',
    optionA: '-0.1 J',
    optionB: '-0.8 J',
    optionC: '+0.1 J',
    optionD: '+0.8 J',
    correctAnswer: 'C',
    explanation:
      'U = -p⃗_m · B⃗ = -[(-0.5î + 0.4ĵ) · (0.2î)] = -[(-0.5)(0.2)] = -(-0.1) = +0.1 J.',
  },
];
