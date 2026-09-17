import { Question } from '../../types';
import { PHYSICS_DIAGRAMS } from '../physicsDiagrams';

export const UNIT_4_QUESTIONS: Question[] = [
  {
    id: 'tn12_phy_u4_q1',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 1,
    imageUrl: PHYSICS_DIAGRAMS.u4_q1,
    question:
      'An electron moves on a straight line path XY adjacent to a coil abcd. What will be the direction of current, if any, induced in the coil? (NEET-2015)',
    optionA: 'The current will reverse its direction as the electron goes past the coil',
    optionB: 'No current will be induced',
    optionC: 'abcd',
    optionD: 'adcb',
    correctAnswer: 'A',
    explanation:
      'As the electron approaches the coil, magnetic flux through the coil increases, inducing a current in one direction by Lenz’s law. As the electron moves away past the coil, the magnetic flux decreases, reversing the induced EMF and current direction.',
  },
  {
    id: 'tn12_phy_u4_q2',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 2,
    imageUrl: PHYSICS_DIAGRAMS.u4_q2,
    question:
      'A thin semi-circular conducting ring (PQR) of radius r is falling with its plane vertical in a horizontal magnetic field B. The potential difference developed across the ring when its speed is v is: (NEET 2014)',
    optionA: 'Zero',
    optionB: 'B v π r² / 2 and P is at higher potential',
    optionC: 'π r B v and R is at higher potential',
    optionD: '2r B v and R is at higher potential',
    correctAnswer: 'D',
    explanation:
      'The effective length perpendicular to the velocity is the diameter between P and R, which is 2r. The induced motional EMF is e = B v (2r) = 2r B v. By Fleming’s right hand rule, point R is at higher potential.',
  },
  {
    id: 'tn12_phy_u4_q3',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 3,
    question:
      'The magnetic flux linked with a coil at any instant t is given by Φ_B = 10t² – 50t + 250. The induced emf at t = 3 s is:',
    optionA: '-190 V',
    optionB: '-10 V',
    optionC: '10 V',
    optionD: '190 V',
    correctAnswer: 'B',
    explanation:
      'Induced EMF e = -dΦ_B/dt = -(20t - 50) = 50 - 20t. At t = 3 s, e = 50 - 20(3) = 50 - 60 = -10 V.',
  },
  {
    id: 'tn12_phy_u4_q4',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 4,
    question:
      'When the current changes from +2 A to -2 A in 0.05 s, an emf of 8 V is induced in a coil. The coefficient of self-induction of the coil is:',
    optionA: '0.2 H',
    optionB: '0.4 H',
    optionC: '0.8 H',
    optionD: '0.1 H',
    correctAnswer: 'D',
    explanation:
      '|e| = L |ΔI / Δt| ⇒ 8 = L × |(-2 - 2) / 0.05| = L × (4 / 0.05) = 80 L ⇒ L = 8 / 80 = 0.1 H.',
  },
  {
    id: 'tn12_phy_u4_q5',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 5,
    imageUrl: PHYSICS_DIAGRAMS.u4_q5,
    question:
      'The current i flowing in a coil varies linearly with time as a triangular wave. The variation of induced emf with time would be: (NEET-2011)',
    optionA: 'Alternating square waveform having positive and negative constant emf stages',
    optionB: 'Continuous sinusoidal waveform',
    optionC: 'Sawtooth waveform',
    optionD: 'Exponential decay pulses',
    correctAnswer: 'A',
    explanation:
      'Since induced EMF is e = -L (di/dt), for linear current ramps with constant positive and negative slopes (di/dt), the induced EMF is constant negative and positive respectively, producing alternating square pulses.',
  },
  {
    id: 'tn12_phy_u4_q6',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 6,
    question:
      'A circular coil with a cross-sectional area of 4 cm² has 10 turns. It is placed at the centre of a long solenoid that has 15 turns/cm and a cross-sectional area of 10 cm². The axis of the coil coincides with the axis of the solenoid. What is their mutual inductance?',
    optionA: '7.54 μH',
    optionB: '8.54 μH',
    optionC: '9.54 μH',
    optionD: '10.54 μH',
    correctAnswer: 'A',
    explanation:
      'M = μ₀ n₁ N₂ A₂ = (4π × 10⁻⁷ H/m) × (1500 m⁻¹) × 10 × (4 × 10⁻⁴ m²) = 7.54 × 10⁻⁶ H = 7.54 μH.',
  },
  {
    id: 'tn12_phy_u4_q7',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 7,
    question:
      'In a transformer, the number of turns in the primary and secondary are 410 and 1230 respectively. If the current in primary is 6 A, then that in the secondary coil is:',
    optionA: '2 A',
    optionB: '18 A',
    optionC: '12 A',
    optionD: '1 A',
    correctAnswer: 'A',
    explanation:
      'For an ideal transformer, I_s / I_p = N_p / N_s ⇒ I_s = 6 × (410 / 1230) = 6 × (1/3) = 2 A.',
  },
  {
    id: 'tn12_phy_u4_q8',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 8,
    question:
      'A step-down transformer reduces the supply voltage from 220 V to 11 V and increases the current from 6 A to 100 A. Then its efficiency is:',
    optionA: '1.2',
    optionB: '0.83',
    optionC: '0.12',
    optionD: '0.9',
    correctAnswer: 'B',
    explanation:
      'Efficiency η = P_out / P_in = (V_s × I_s) / (V_p × I_p) = (11 × 100) / (220 × 6) = 1100 / 1320 ≈ 0.83 (83%).',
  },
  {
    id: 'tn12_phy_u4_q9',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 9,
    question:
      'In an electrical circuit, R, L, C and AC voltage source are connected in series. When L is removed, the phase difference between voltage and current is π/3. When C is removed instead, the phase difference is again π/3. The power factor of the circuit is: (NEET 2012)',
    optionA: '1/2',
    optionB: '1/√2',
    optionC: '1',
    optionD: '√3/2',
    correctAnswer: 'C',
    explanation:
      'tan π/3 = X_C / R and tan π/3 = X_L / R ⇒ X_L = X_C. Therefore, the series RLC circuit is in resonance with Z = R, phase angle φ = 0, and power factor cos φ = 1.',
  },
  {
    id: 'tn12_phy_u4_q10',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 10,
    question:
      'In a series RL circuit, the resistance and inductive reactance are the same. Then the phase difference between the voltage and current in the circuit is:',
    optionA: 'π/4',
    optionB: 'π/2',
    optionC: 'π/6',
    optionD: 'zero',
    correctAnswer: 'A',
    explanation: 'tan φ = X_L / R = 1 ⇒ φ = tan⁻¹(1) = π/4 (45°).',
  },
  {
    id: 'tn12_phy_u4_q11',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 11,
    question:
      'In a series resonant RLC circuit, the voltage across 100 Ω resistor is 40 V. The resonant frequency ω is 250 rad/s. If the value of C is 4 μF, then the voltage across L is:',
    optionA: '600 V',
    optionB: '4000 V',
    optionC: '400 V',
    optionD: '1 V',
    correctAnswer: 'C',
    explanation:
      'Current I = V_R / R = 40 / 100 = 0.4 A. At resonance, X_L = X_C = 1 / (ω C) = 1 / (250 × 4 × 10⁻⁶) = 1 / 10⁻³ = 1000 Ω. Voltage across L is V_L = I X_L = 0.4 × 1000 = 400 V.',
  },
  {
    id: 'tn12_phy_u4_q12',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 12,
    question:
      'An inductor 20 mH, a capacitor 50 μF and a resistor 40 Ω are connected in series across a source of emf v = 10 sin(340 t). The power loss in the AC circuit is:',
    optionA: '0.76 W',
    optionB: '0.89 W',
    optionC: '0.46 W',
    optionD: '0.67 W',
    correctAnswer: 'C',
    explanation:
      'ω = 340 rad/s. X_L = ω L = 340 × 0.02 = 6.8 Ω; X_C = 1 / (ω C) = 1 / (340 × 50 × 10⁻⁶) ≈ 58.82 Ω. Reactance |X_L - X_C| ≈ 52.02 Ω. Impedance Z = √(40² + 52.02²) ≈ 65.62 Ω. I_rms = (10 / √2) / 65.62 = 0.1077 A. Power P = I_rms² R = (0.1077)² × 40 ≈ 0.46 W.',
  },
  {
    id: 'tn12_phy_u4_q13',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 13,
    question:
      'The instantaneous values of alternating current and voltage in a circuit are i = (1 / √2) sin(100πt) A and v = (1 / √2) sin(100πt + π/3) V. The average power in watts consumed in the circuit is: (IIT Main 2012)',
    optionA: '1/4',
    optionB: '√3/4',
    optionC: '1/2',
    optionD: '1/8',
    correctAnswer: 'D',
    explanation:
      'P_avg = V_rms I_rms cos φ = [(1/√2)/√2] × [(1/√2)/√2] × cos(π/3) = (1/2) × (1/2) × (1/2) = 1/8 W.',
  },
  {
    id: 'tn12_phy_u4_q14',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 14,
    question:
      'In an oscillating LC circuit, the maximum charge on the capacitor is Q. The charge on the capacitor when the energy is stored equally between the electric and magnetic fields is:',
    optionA: 'Q/2',
    optionB: 'Q/√3',
    optionC: 'Q/√2',
    optionD: 'Q',
    correctAnswer: 'C',
    explanation:
      'Total energy E_total = Q² / (2C). When electric energy is half of total: q² / (2C) = (1/2) [Q² / (2C)] ⇒ q² = Q² / 2 ⇒ q = Q / √2.',
  },
  {
    id: 'tn12_phy_u4_q15',
    subjectId: 'subj_physics',
    unitId: 'unit_phy_4',
    questionNumber: 15,
    question:
      'A 20/π² H inductor is connected to a capacitor of capacitance C. The value of C in order to impart maximum power at 50 Hz is:',
    optionA: '50 μF',
    optionB: '0.5 μF',
    optionC: '500 μF',
    optionD: '5 μF',
    correctAnswer: 'D',
    explanation:
      'For maximum power (resonance at f = 50 Hz), ω = 2π(50) = 100π rad/s. C = 1 / (ω² L) = 1 / [(100π)² × (20/π²)] = 1 / (10,000 × 20) = 1 / 200,000 = 5 × 10⁻⁶ F = 5 μF.',
  },
];
