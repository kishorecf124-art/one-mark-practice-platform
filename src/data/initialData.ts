import { Subject, Unit, Question } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj_physics',
    name: 'Physics',
    description: 'Mechanics, Electrodynamics, Optics, and Modern Physics one-mark conceptual questions.',
    icon: 'Atom',
    color: 'indigo',
  },
  {
    id: 'subj_chemistry',
    name: 'Chemistry',
    description: 'Physical, Inorganic, and Organic Chemistry one-mark formulations and reactions.',
    icon: 'FlaskConical',
    color: 'emerald',
  },
  {
    id: 'subj_math',
    name: 'Mathematics',
    description: 'Calculus, Algebra, Matrices, Vectors, and Probability objective questions.',
    icon: 'Calculator',
    color: 'amber',
  },
  {
    id: 'subj_cs',
    name: 'Computer Science',
    description: 'Python programming, Algorithmic strategies, SQL, and Object-Oriented concepts.',
    icon: 'Terminal',
    color: 'sky',
  },
];

export const INITIAL_UNITS: Unit[] = [
  // Physics units (TN 12th State Board Book Back)
  { id: 'unit_phy_1', subjectId: 'subj_physics', unitNumber: 1, name: 'Unit 1: Electrostatics' },
  { id: 'unit_phy_2', subjectId: 'subj_physics', unitNumber: 2, name: 'Unit 2: Current Electricity' },
  { id: 'unit_phy_3', subjectId: 'subj_physics', unitNumber: 3, name: 'Unit 3: Magnetism and Magnetic Effects of Electric Current' },
  { id: 'unit_phy_4', subjectId: 'subj_physics', unitNumber: 4, name: 'Unit 4: Electromagnetic Induction and Alternating Current' },
  { id: 'unit_phy_5', subjectId: 'subj_physics', unitNumber: 5, name: 'Unit 5: Electromagnetic Waves' },
  { id: 'unit_phy_6', subjectId: 'subj_physics', unitNumber: 6, name: 'Unit 6: Ray Optics' },
  { id: 'unit_phy_7', subjectId: 'subj_physics', unitNumber: 7, name: 'Unit 7: Wave Optics' },
  { id: 'unit_phy_8', subjectId: 'subj_physics', unitNumber: 8, name: 'Unit 8: Dual Nature of Radiation and Matter' },
  { id: 'unit_phy_9', subjectId: 'subj_physics', unitNumber: 9, name: 'Unit 9: Atomic and Nuclear Physics' },
  { id: 'unit_phy_10', subjectId: 'subj_physics', unitNumber: 10, name: 'Unit 10: Electronics and Communication' },
  { id: 'unit_phy_11', subjectId: 'subj_physics', unitNumber: 11, name: 'Unit 11: Recent Developments in Physics' },

  // Chemistry units (TN 12th State Board Book Back)
  { id: 'unit_chem_1', subjectId: 'subj_chemistry', unitNumber: 1, name: 'Unit 1: Metallurgy' },
  { id: 'unit_chem_2', subjectId: 'subj_chemistry', unitNumber: 2, name: 'Unit 2: p-Block Elements – I' },
  { id: 'unit_chem_3', subjectId: 'subj_chemistry', unitNumber: 3, name: 'Unit 3: p-Block Elements – II' },
  { id: 'unit_chem_4', subjectId: 'subj_chemistry', unitNumber: 4, name: 'Unit 4: Transition and Inner Transition Elements' },
  { id: 'unit_chem_5', subjectId: 'subj_chemistry', unitNumber: 5, name: 'Unit 5: Coordination Chemistry' },
  { id: 'unit_chem_6', subjectId: 'subj_chemistry', unitNumber: 6, name: 'Unit 6: Solid State' },
  { id: 'unit_chem_7', subjectId: 'subj_chemistry', unitNumber: 7, name: 'Unit 7: Chemical Kinetics' },
  { id: 'unit_chem_8', subjectId: 'subj_chemistry', unitNumber: 8, name: 'Unit 8: Ionic Equilibrium' },
  { id: 'unit_chem_9', subjectId: 'subj_chemistry', unitNumber: 9, name: 'Unit 9: Electrochemistry' },
  { id: 'unit_chem_10', subjectId: 'subj_chemistry', unitNumber: 10, name: 'Unit 10: Surface Chemistry' },
  { id: 'unit_chem_11', subjectId: 'subj_chemistry', unitNumber: 11, name: 'Unit 11: Hydroxy Compounds and Ethers' },
  { id: 'unit_chem_12', subjectId: 'subj_chemistry', unitNumber: 12, name: 'Unit 12: Carbonyl Compounds and Carboxylic Acids' },
  { id: 'unit_chem_13', subjectId: 'subj_chemistry', unitNumber: 13, name: 'Unit 13: Organic Nitrogen Compounds' },
  { id: 'unit_chem_14', subjectId: 'subj_chemistry', unitNumber: 14, name: 'Unit 14: Biomolecules' },
  { id: 'unit_chem_15', subjectId: 'subj_chemistry', unitNumber: 15, name: 'Unit 15: Chemistry in Everyday Life' },

  // Mathematics units (TN 12th State Board Book Back)
  { id: 'unit_math_1', subjectId: 'subj_math', unitNumber: 1, name: 'Unit 1: Applications of Matrices and Determinants' },
  { id: 'unit_math_2', subjectId: 'subj_math', unitNumber: 2, name: 'Unit 2: Complex Numbers' },
  { id: 'unit_math_3', subjectId: 'subj_math', unitNumber: 3, name: 'Unit 3: Theory of Equations' },
  { id: 'unit_math_4', subjectId: 'subj_math', unitNumber: 4, name: 'Unit 4: Inverse Trigonometric Functions' },
  { id: 'unit_math_5', subjectId: 'subj_math', unitNumber: 5, name: 'Unit 5: Two Dimensional Analytical Geometry – II' },
  { id: 'unit_math_6', subjectId: 'subj_math', unitNumber: 6, name: 'Unit 6: Applications of Vector Algebra' },
  { id: 'unit_math_7', subjectId: 'subj_math', unitNumber: 7, name: 'Unit 7: Applications of Differential Calculus' },
  { id: 'unit_math_8', subjectId: 'subj_math', unitNumber: 8, name: 'Unit 8: Differentials and Partial Derivatives' },
  { id: 'unit_math_9', subjectId: 'subj_math', unitNumber: 9, name: 'Unit 9: Applications of Integration' },
  { id: 'unit_math_10', subjectId: 'subj_math', unitNumber: 10, name: 'Unit 10: Ordinary Differential Equations' },
  { id: 'unit_math_11', subjectId: 'subj_math', unitNumber: 11, name: 'Unit 11: Probability Distributions' },
  { id: 'unit_math_12', subjectId: 'subj_math', unitNumber: 12, name: 'Unit 12: Discrete Mathematics' },

  // Computer Science units (TN 12th State Board Book Back)
  { id: 'unit_cs_1', subjectId: 'subj_cs', unitNumber: 1, name: 'Unit 1: Function' },
  { id: 'unit_cs_2', subjectId: 'subj_cs', unitNumber: 2, name: 'Unit 2: Data Abstraction' },
  { id: 'unit_cs_3', subjectId: 'subj_cs', unitNumber: 3, name: 'Unit 3: Scoping' },
  { id: 'unit_cs_4', subjectId: 'subj_cs', unitNumber: 4, name: 'Unit 4: Algorithmic Strategies' },
  { id: 'unit_cs_5', subjectId: 'subj_cs', unitNumber: 5, name: 'Unit 5: Python - Variables and Operators' },
  { id: 'unit_cs_6', subjectId: 'subj_cs', unitNumber: 6, name: 'Unit 6: Control Structures' },
  { id: 'unit_cs_7', subjectId: 'subj_cs', unitNumber: 7, name: 'Unit 7: Python Functions' },
  { id: 'unit_cs_8', subjectId: 'subj_cs', unitNumber: 8, name: 'Unit 8: Strings and String Manipulation' },
  { id: 'unit_cs_9', subjectId: 'subj_cs', unitNumber: 9, name: 'Unit 9: Lists, Tuples, Sets and Dictionary' },
  { id: 'unit_cs_10', subjectId: 'subj_cs', unitNumber: 10, name: 'Unit 10: Python Classes and Objects' },
  { id: 'unit_cs_11', subjectId: 'subj_cs', unitNumber: 11, name: 'Unit 11: Database Concepts' },
  { id: 'unit_cs_12', subjectId: 'subj_cs', unitNumber: 12, name: 'Unit 12: Structured Query Language (SQL)' },
  { id: 'unit_cs_13', subjectId: 'subj_cs', unitNumber: 13, name: 'Unit 13: Python and CSV Files' },
  { id: 'unit_cs_14', subjectId: 'subj_cs', unitNumber: 14, name: 'Unit 14: Importing C++ Programs in Python' },
  { id: 'unit_cs_15', subjectId: 'subj_cs', unitNumber: 15, name: 'Unit 15: Data Manipulation through SQL' },
  { id: 'unit_cs_16', subjectId: 'subj_cs', unitNumber: 16, name: 'Unit 16: Data Visualization using Pyplot' },
];

export function generateInitialQuestions(): Question[] {
  return [];
}
