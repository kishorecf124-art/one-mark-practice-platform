/**
 * Vector SVG diagrams for Tamil Nadu Class 12 Physics Bookback 1-Mark Questions
 * Clean, high-contrast, scalable SVGs formatted as Data URIs.
 */

function svgToUri(svgContent: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
}

export const PHYSICS_DIAGRAMS = {
  // Unit 1 - Electrostatics Q1: Point charges -q, P with +q, arrows A1, A2, B1, B2
  u1_q1: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 180" width="100%" height="100%">
  <rect width="440" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#1e293b"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f46e5"/>
    </marker>
  </defs>

  <!-- Horizontal line joining charges -->
  <line x1="70" y1="90" x2="370" y2="90" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4,4"/>

  <!-- Left Charge -q -->
  <circle cx="70" cy="90" r="18" fill="#1e293b"/>
  <text x="70" y="95" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">-q</text>

  <!-- Right Charge -q -->
  <circle cx="370" cy="90" r="18" fill="#1e293b"/>
  <text x="370" y="95" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">-q</text>

  <!-- Center point P with +q -->
  <circle cx="220" cy="90" r="16" fill="#4f46e5"/>
  <text x="220" y="95" fill="#ffffff" font-size="13" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">+q</text>
  <text x="200" y="112" fill="#1e293b" font-size="14" font-weight="bold" font-family="system-ui, sans-serif">P</text>

  <!-- Arrows A1 (left) and A2 (right) along axis -->
  <line x1="195" y1="90" x2="150" y2="90" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="165" y="80" fill="#1e293b" font-size="13" font-weight="bold" font-family="system-ui, sans-serif">A₁</text>

  <line x1="245" y1="90" x2="290" y2="90" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="265" y="80" fill="#1e293b" font-size="13" font-weight="bold" font-family="system-ui, sans-serif">A₂</text>

  <!-- Arrows B1 (up) and B2 (down) perpendicular -->
  <line x1="220" y1="65" x2="220" y2="25" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="228" y="35" fill="#1e293b" font-size="13" font-weight="bold" font-family="system-ui, sans-serif">B₁</text>

  <line x1="220" y1="115" x2="220" y2="155" stroke="#1e293b" stroke-width="2.5" marker-end="url(#arrow)"/>
  <text x="228" y="150" fill="#1e293b" font-size="13" font-weight="bold" font-family="system-ui, sans-serif">B₂</text>
</svg>
`),

  // Unit 1 - Electrostatics Q3: Ratio of charges |q1/q2| electric field line pattern
  u1_q3: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="100%" height="100%">
  <rect width="460" height="200" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <defs>
    <marker id="arrow-f" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 2 L 7 5 L 0 8 z" fill="#3b82f6"/>
    </marker>
  </defs>

  <!-- Left charge q1 -->
  <circle cx="140" cy="100" r="18" fill="#ef4444"/>
  <text x="140" y="105" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">+q₁</text>

  <!-- Right charge q2 -->
  <circle cx="320" cy="100" r="16" fill="#3b82f6"/>
  <text x="320" y="105" fill="#ffffff" font-size="14" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">-q₂</text>

  <!-- Connecting curves q1 -> q2 -->
  <path d="M 158 100 L 304 100" stroke="#64748b" stroke-width="1.5" marker-mid="url(#arrow-f)"/>
  <path d="M 155 90 Q 230 45 306 92" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <path d="M 155 110 Q 230 155 306 108" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <path d="M 150 82 Q 230 15 312 85" fill="none" stroke="#64748b" stroke-width="1.5"/>
  <path d="M 150 118 Q 230 185 312 115" fill="none" stroke="#64748b" stroke-width="1.5"/>

  <!-- Radiating field lines from q1 leaving left -->
  <line x1="122" y1="100" x2="60" y2="100" stroke="#64748b" stroke-width="1.5"/>
  <line x1="126" y1="88" x2="70" y2="60" stroke="#64748b" stroke-width="1.5"/>
  <line x1="126" y1="112" x2="70" y2="140" stroke="#64748b" stroke-width="1.5"/>
  <line x1="135" y1="82" x2="90" y2="35" stroke="#64748b" stroke-width="1.5"/>
  <line x1="135" y1="118" x2="90" y2="165" stroke="#64748b" stroke-width="1.5"/>
  <line x1="140" y1="82" x2="140" y2="25" stroke="#64748b" stroke-width="1.5"/>
  <line x1="140" y1="118" x2="140" y2="175" stroke="#64748b" stroke-width="1.5"/>
  <line x1="148" y1="84" x2="170" y2="35" stroke="#64748b" stroke-width="1.5"/>
  <line x1="148" y1="116" x2="170" y2="165" stroke="#64748b" stroke-width="1.5"/>

  <!-- Inward lines entering q2 right -->
  <line x1="336" y1="100" x2="385" y2="100" stroke="#64748b" stroke-width="1.5"/>
  <line x1="333" y1="90" x2="380" y2="65" stroke="#64748b" stroke-width="1.5"/>
  <line x1="333" y1="110" x2="380" y2="135" stroke="#64748b" stroke-width="1.5"/>

  <!-- Caption / Question details -->
  <text x="230" y="190" fill="#475569" font-size="12" font-weight="600" font-family="system-ui, sans-serif" text-anchor="middle">Lines from q₁ = 25, Lines ending on q₂ = 11</text>
</svg>
`),

  // Unit 1 - Electrostatics Q5: Four Gaussian surfaces A, B, C, D
  u1_q5: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 260" width="100%" height="100%">
  <rect width="380" height="260" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Outer shape D -->
  <ellipse cx="190" cy="130" rx="170" ry="115" fill="#f1f5f9" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="330" y="140" fill="#0f172a" font-size="16" font-weight="bold" font-family="system-ui, sans-serif">D</text>
  <circle cx="285" cy="180" r="12" fill="#ef4444"/>
  <text x="285" y="184" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">+q</text>

  <!-- Surface C -->
  <ellipse cx="160" cy="115" rx="120" ry="85" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
  <text x="260" y="75" fill="#0f172a" font-size="16" font-weight="bold" font-family="system-ui, sans-serif">C</text>
  <circle cx="215" cy="100" r="12" fill="#3b82f6"/>
  <text x="215" y="104" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>

  <!-- Surface B -->
  <ellipse cx="130" cy="110" rx="80" ry="60" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
  <text x="180" y="75" fill="#0f172a" font-size="16" font-weight="bold" font-family="system-ui, sans-serif">B</text>

  <!-- Surface A -->
  <ellipse cx="115" cy="110" rx="45" ry="35" fill="#94a3b8" stroke="#334155" stroke-width="1.5"/>
  <text x="115" y="90" fill="#0f172a" font-size="15" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">A</text>
  <circle cx="115" cy="120" r="12" fill="#ef4444"/>
  <text x="115" y="124" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">+2q</text>
</svg>
`),

  // Unit 1 - Electrostatics Q8: Rank potential energy for 4 systems
  u1_q8: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 140" width="100%" height="100%">
  <rect width="460" height="140" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- System (a): -q, -q separated by r -->
  <g transform="translate(15, 20)">
    <circle cx="20" cy="40" r="11" fill="#1e293b"/>
    <text x="20" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>
    <line x1="31" y1="40" x2="69" y2="40" stroke="#64748b" stroke-width="1.5"/>
    <text x="50" y="32" fill="#475569" font-size="11" font-weight="bold" text-anchor="middle">r</text>
    <circle cx="80" cy="40" r="11" fill="#1e293b"/>
    <text x="80" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>
    <text x="50" y="85" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">(a)</text>
  </g>

  <!-- System (b): -q, +q separated by r -->
  <g transform="translate(125, 20)">
    <circle cx="20" cy="40" r="11" fill="#1e293b"/>
    <text x="20" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>
    <line x1="31" y1="40" x2="69" y2="40" stroke="#64748b" stroke-width="1.5"/>
    <text x="50" y="32" fill="#475569" font-size="11" font-weight="bold" text-anchor="middle">r</text>
    <circle cx="80" cy="40" r="11" fill="#1e293b"/>
    <text x="80" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>
    <text x="50" y="85" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">(b)</text>
  </g>

  <!-- System (c): -q, -2q separated by r -->
  <g transform="translate(235, 20)">
    <circle cx="20" cy="40" r="11" fill="#1e293b"/>
    <text x="20" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>
    <line x1="31" y1="40" x2="69" y2="40" stroke="#64748b" stroke-width="1.5"/>
    <text x="50" y="32" fill="#475569" font-size="11" font-weight="bold" text-anchor="middle">r</text>
    <circle cx="80" cy="40" r="13" fill="#1e293b"/>
    <text x="80" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-2q</text>
    <text x="50" y="85" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">(c)</text>
  </g>

  <!-- System (d): -q, -2q separated by 2r -->
  <g transform="translate(345, 20)">
    <circle cx="15" cy="40" r="11" fill="#1e293b"/>
    <text x="15" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-q</text>
    <line x1="26" y1="40" x2="74" y2="40" stroke="#64748b" stroke-width="1.5"/>
    <text x="50" y="32" fill="#475569" font-size="11" font-weight="bold" text-anchor="middle">2r</text>
    <circle cx="85" cy="40" r="13" fill="#1e293b"/>
    <text x="85" y="44" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">-2q</text>
    <text x="50" y="85" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">(d)</text>
  </g>
</svg>
`),

  // Unit 1 - Electrostatics Q10: Plot of V vs r for spherical shell of radius R
  u1_q10: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="100%" height="100%">
  <rect width="460" height="200" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Option (a) -->
  <g transform="translate(20, 20)">
    <line x1="10" y1="65" x2="90" y2="65" stroke="#334155" stroke-width="1.5"/>
    <line x1="10" y1="65" x2="10" y2="5" stroke="#334155" stroke-width="1.5"/>
    <text x="5" y="10" fill="#334155" font-size="10" font-weight="bold">V</text>
    <text x="92" y="68" fill="#334155" font-size="10" font-weight="bold">r</text>
    <line x1="45" y1="65" x2="45" y2="68" stroke="#334155" stroke-width="1"/>
    <text x="45" y="78" fill="#475569" font-size="9" text-anchor="middle">R</text>
    <path d="M 10 65 L 45 20 Q 65 50 85 62" fill="none" stroke="#4f46e5" stroke-width="2"/>
    <text x="50" y="92" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">(a)</text>
  </g>

  <!-- Option (b) CORRECT: constant inside, 1/r outside -->
  <g transform="translate(130, 20)">
    <line x1="10" y1="65" x2="90" y2="65" stroke="#334155" stroke-width="1.5"/>
    <line x1="10" y1="65" x2="10" y2="5" stroke="#334155" stroke-width="1.5"/>
    <text x="5" y="10" fill="#334155" font-size="10" font-weight="bold">V</text>
    <text x="92" y="68" fill="#334155" font-size="10" font-weight="bold">r</text>
    <line x1="45" y1="65" x2="45" y2="68" stroke="#334155" stroke-width="1"/>
    <text x="45" y="78" fill="#475569" font-size="9" text-anchor="middle">R</text>
    <path d="M 10 25 L 45 25 Q 65 45 85 60" fill="none" stroke="#16a34a" stroke-width="2.5"/>
    <text x="50" y="92" fill="#16a34a" font-size="12" font-weight="bold" text-anchor="middle">(b) Correct</text>
  </g>

  <!-- Option (c) -->
  <g transform="translate(240, 20)">
    <line x1="10" y1="65" x2="90" y2="65" stroke="#334155" stroke-width="1.5"/>
    <line x1="10" y1="65" x2="10" y2="5" stroke="#334155" stroke-width="1.5"/>
    <text x="5" y="10" fill="#334155" font-size="10" font-weight="bold">V</text>
    <text x="92" y="68" fill="#334155" font-size="10" font-weight="bold">r</text>
    <line x1="45" y1="65" x2="45" y2="68" stroke="#334155" stroke-width="1"/>
    <text x="45" y="78" fill="#475569" font-size="9" text-anchor="middle">R</text>
    <path d="M 10 20 Q 45 55 85 62" fill="none" stroke="#4f46e5" stroke-width="2"/>
    <text x="50" y="92" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">(c)</text>
  </g>

  <!-- Option (d) -->
  <g transform="translate(350, 20)">
    <line x1="10" y1="65" x2="90" y2="65" stroke="#334155" stroke-width="1.5"/>
    <line x1="10" y1="65" x2="10" y2="5" stroke="#334155" stroke-width="1.5"/>
    <text x="5" y="10" fill="#334155" font-size="10" font-weight="bold">V</text>
    <text x="92" y="68" fill="#334155" font-size="10" font-weight="bold">r</text>
    <line x1="45" y1="65" x2="45" y2="68" stroke="#334155" stroke-width="1"/>
    <text x="45" y="78" fill="#475569" font-size="9" text-anchor="middle">R</text>
    <path d="M 10 65 Q 45 15 85 62" fill="none" stroke="#4f46e5" stroke-width="2"/>
    <text x="50" y="92" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">(d)</text>
  </g>

  <text x="230" y="160" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">Potential inside spherical shell is uniform (V = kQ/R) and drops as 1/r outside</text>
</svg>
`),

  // Unit 1 - Electrostatics Q14: Three capacitors in a triangle
  u1_q14: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" width="100%" height="100%">
  <rect width="380" height="220" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Triangle vertices: A (90, 60), B (290, 60), C (190, 180) -->
  <circle cx="90" cy="60" r="5" fill="#0f172a"/>
  <text x="70" y="65" fill="#0f172a" font-size="16" font-weight="bold">A</text>

  <circle cx="290" cy="60" r="5" fill="#0f172a"/>
  <text x="305" y="65" fill="#0f172a" font-size="16" font-weight="bold">B</text>

  <circle cx="190" cy="180" r="5" fill="#0f172a"/>
  <text x="190" y="205" fill="#0f172a" font-size="16" font-weight="bold" text-anchor="middle">C</text>

  <!-- Top branch A-B: 2 uF capacitor -->
  <line x1="90" y1="60" x2="180" y2="60" stroke="#0f172a" stroke-width="2"/>
  <line x1="180" y1="45" x2="180" y2="75" stroke="#0f172a" stroke-width="3"/>
  <line x1="190" y1="45" x2="190" y2="75" stroke="#0f172a" stroke-width="3"/>
  <line x1="190" y1="60" x2="290" y2="60" stroke="#0f172a" stroke-width="2"/>
  <text x="185" y="38" fill="#4f46e5" font-size="13" font-weight="bold" text-anchor="middle">2 μF</text>

  <!-- Branch B-C: 2 uF capacitor -->
  <line x1="290" y1="60" x2="245" y2="114" stroke="#0f172a" stroke-width="2"/>
  <!-- Cap plates slanted or perpendicular -->
  <line x1="240" y1="108" x2="255" y2="120" stroke="#0f172a" stroke-width="3"/>
  <line x1="235" y1="114" x2="250" y2="126" stroke="#0f172a" stroke-width="3"/>
  <line x1="240" y1="120" x2="190" y2="180" stroke="#0f172a" stroke-width="2"/>
  <text x="268" y="130" fill="#4f46e5" font-size="13" font-weight="bold">2 μF</text>

  <!-- Branch A-C: 1 uF capacitor -->
  <line x1="90" y1="60" x2="135" y2="114" stroke="#0f172a" stroke-width="2"/>
  <line x1="130" y1="120" x2="145" y2="108" stroke="#0f172a" stroke-width="3"/>
  <line x1="135" y1="126" x2="150" y2="114" stroke="#0f172a" stroke-width="3"/>
  <line x1="140" y1="120" x2="190" y2="180" stroke="#0f172a" stroke-width="2"/>
  <text x="100" y="130" fill="#4f46e5" font-size="13" font-weight="bold">1 μF</text>
</svg>
`),

  // Unit 2 - Current Electricity Q1: I vs V graph (line with slope R = 2 ohm)
  u2_q1: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 260" width="100%" height="100%">
  <rect width="380" height="260" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <defs>
    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" stroke-width="1"/>
    </pattern>
  </defs>
  <!-- Grid -->
  <rect x="70" y="30" width="240" height="180" fill="url(#grid)" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Axes -->
  <line x1="70" y1="210" x2="330" y2="210" stroke="#0f172a" stroke-width="2"/>
  <line x1="70" y1="210" x2="70" y2="20" stroke="#0f172a" stroke-width="2"/>

  <!-- X axis labels (V) -->
  <text x="335" y="215" fill="#0f172a" font-size="12" font-weight="bold">V (Volt)</text>
  <text x="70" y="228" fill="#475569" font-size="11" text-anchor="middle">0</text>
  <text x="118" y="228" fill="#475569" font-size="11" text-anchor="middle">1</text>
  <text x="166" y="228" fill="#475569" font-size="11" text-anchor="middle">2</text>
  <text x="214" y="228" fill="#475569" font-size="11" text-anchor="middle">3</text>
  <text x="262" y="228" fill="#475569" font-size="11" text-anchor="middle">4</text>
  <text x="310" y="228" fill="#475569" font-size="11" text-anchor="middle">5</text>

  <!-- Y axis labels (I) -->
  <text x="65" y="18" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="end">I (Ampere)</text>
  <text x="58" y="214" fill="#475569" font-size="11" text-anchor="end">0</text>
  <text x="58" y="174" fill="#475569" font-size="11" text-anchor="end">1</text>
  <text x="58" y="138" fill="#475569" font-size="11" text-anchor="end">2</text>
  <text x="58" y="102" fill="#475569" font-size="11" text-anchor="end">3</text>
  <text x="58" y="66" fill="#475569" font-size="11" text-anchor="end">4</text>
  <text x="58" y="34" fill="#475569" font-size="11" text-anchor="end">5</text>

  <!-- Graph Line: through (0,0) and (4V, 2A) -> (70, 210) to (262, 138) -->
  <line x1="70" y1="210" x2="310" y2="102" stroke="#4f46e5" stroke-width="3"/>
  <circle cx="262" cy="138" r="4" fill="#ef4444"/>
  <line x1="262" y1="210" x2="262" y2="138" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3"/>
  <line x1="70" y1="138" x2="262" y2="138" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="3,3"/>

  <text x="210" y="250" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">At V = 4 V, I = 2 A ⇒ R = V / I = 4 / 2 = 2 Ω</text>
</svg>
`),

  // Unit 2 - Current Electricity Q2: Circular wire with points A and B
  u2_q2: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 180" width="100%" height="100%">
  <rect width="340" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Circular ring radius 1m, resistance 2 ohm/m -> circumference = 2*pi m -> R = 4*pi ohm -->
  <circle cx="170" cy="90" r="55" fill="none" stroke="#0f172a" stroke-width="3"/>
  <!-- Diametrical points A and B -->
  <circle cx="115" cy="90" r="5" fill="#4f46e5"/>
  <line x1="60" y1="90" x2="115" y2="90" stroke="#4f46e5" stroke-width="2.5"/>
  <text x="100" y="80" fill="#0f172a" font-size="15" font-weight="bold">A</text>

  <circle cx="225" cy="90" r="5" fill="#4f46e5"/>
  <line x1="225" y1="90" x2="280" y2="90" stroke="#4f46e5" stroke-width="2.5"/>
  <text x="235" y="80" fill="#0f172a" font-size="15" font-weight="bold">B</text>

  <text x="170" y="28" fill="#475569" font-size="12" font-weight="600" text-anchor="middle">Circle radius = 1 m, Resistance = 2 Ω/m</text>
  <text x="170" y="165" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Upper half = 2π Ω || Lower half = 2π Ω ⇒ R_eq = π Ω</text>
</svg>
`),

  // Unit 2 - Current Electricity Q5: Resistor color code (Brown, Black, Yellow, Gold)
  u2_q5: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" width="100%" height="100%">
  <rect width="420" height="160" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Leads -->
  <line x1="40" y1="80" x2="120" y2="80" stroke="#94a3b8" stroke-width="4"/>
  <line x1="300" y1="80" x2="380" y2="80" stroke="#94a3b8" stroke-width="4"/>

  <!-- Body -->
  <rect x="120" y="55" width="180" height="50" rx="14" fill="#fed7aa" stroke="#fdba74" stroke-width="2"/>

  <!-- Color bands -->
  <!-- Band 1: Brown (1) -->
  <rect x="150" y="55" width="12" height="50" fill="#854d0e"/>
  <text x="156" y="125" fill="#854d0e" font-size="11" font-weight="bold" text-anchor="middle">Brown (1)</text>

  <!-- Band 2: Black (0) -->
  <rect x="180" y="55" width="12" height="50" fill="#0f172a"/>
  <text x="186" y="140" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Black (0)</text>

  <!-- Band 3: Yellow (10^4) -->
  <rect x="210" y="55" width="12" height="50" fill="#eab308"/>
  <text x="216" y="125" fill="#ca8a04" font-size="11" font-weight="bold" text-anchor="middle">Yellow (10⁴)</text>

  <!-- Band 4: Gold (5%) -->
  <rect x="260" y="55" width="12" height="50" fill="#d97706"/>
  <text x="266" y="140" fill="#d97706" font-size="11" font-weight="bold" text-anchor="middle">Gold (±5%)</text>

  <text x="210" y="35" fill="#0f172a" font-size="13" font-weight="bold" text-anchor="middle">R = 10 × 10⁴ Ω = 100 kΩ ± 5%</text>
</svg>
`),

  // Unit 2 - Current Electricity Q10: Circuit with 9V, 3 ohm, 2.5 ohm, P
  u2_q10: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" height="100%">
  <rect width="380" height="200" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- 9V Battery on left -->
  <line x1="80" y1="50" x2="80" y2="85" stroke="#0f172a" stroke-width="2"/>
  <line x1="65" y1="85" x2="95" y2="85" stroke="#0f172a" stroke-width="3"/>
  <line x1="72" y1="95" x2="88" y2="95" stroke="#0f172a" stroke-width="2"/>
  <line x1="80" y1="95" x2="80" y2="150" stroke="#0f172a" stroke-width="2"/>
  <text x="45" y="94" fill="#0f172a" font-size="13" font-weight="bold">9V</text>

  <!-- Top branch with 3 ohm -->
  <line x1="80" y1="50" x2="160" y2="50" stroke="#0f172a" stroke-width="2"/>
  <path d="M 160 50 L 165 42 L 175 58 L 185 42 L 195 58 L 205 42 L 210 50" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="210" y1="50" x2="300" y2="50" stroke="#0f172a" stroke-width="2"/>
  <text x="185" y="35" fill="#4f46e5" font-size="12" font-weight="bold" text-anchor="middle">3 Ω</text>

  <!-- Right vertical branch with 2.5 ohm -->
  <line x1="300" y1="50" x2="300" y2="85" stroke="#0f172a" stroke-width="2"/>
  <path d="M 300 85 L 292 90 L 308 100 L 292 110 L 308 120 L 300 125" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="300" y1="125" x2="300" y2="150" stroke="#0f172a" stroke-width="2"/>
  <text x="325" y="110" fill="#4f46e5" font-size="12" font-weight="bold">2.5 Ω</text>

  <!-- Bottom branch with P -->
  <line x1="80" y1="150" x2="160" y2="150" stroke="#0f172a" stroke-width="2"/>
  <path d="M 160 150 L 165 142 L 175 158 L 185 142 L 195 158 L 205 142 L 210 150" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="210" y1="150" x2="300" y2="150" stroke="#0f172a" stroke-width="2"/>
  <text x="185" y="175" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">P = ?</text>

  <text x="190" y="192" fill="#475569" font-size="11" font-weight="600" text-anchor="middle">Total Current I = 1.0 A</text>
</svg>
`),

  // Unit 2 - Current Electricity Q11: 5V battery with three 15 ohm resistors in parallel
  u2_q11: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <rect width="380" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Left battery 5V -->
  <line x1="70" y1="40" x2="70" y2="75" stroke="#0f172a" stroke-width="2"/>
  <line x1="55" y1="75" x2="85" y2="75" stroke="#0f172a" stroke-width="3"/>
  <line x1="62" y1="85" x2="78" y2="85" stroke="#0f172a" stroke-width="2"/>
  <line x1="70" y1="85" x2="70" y2="140" stroke="#0f172a" stroke-width="2"/>
  <text x="35" y="84" fill="#0f172a" font-size="13" font-weight="bold">5V</text>

  <!-- Top busbar -->
  <line x1="70" y1="40" x2="310" y2="40" stroke="#0f172a" stroke-width="2"/>
  <!-- Bottom busbar -->
  <line x1="70" y1="140" x2="310" y2="140" stroke="#0f172a" stroke-width="2"/>

  <!-- Parallel Branch 1: 15 ohm -->
  <line x1="150" y1="40" x2="150" y2="70" stroke="#0f172a" stroke-width="2"/>
  <path d="M 150 70 L 144 75 L 156 85 L 144 95 L 156 105 L 150 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="150" y1="110" x2="150" y2="140" stroke="#0f172a" stroke-width="2"/>
  <text x="135" y="93" fill="#4f46e5" font-size="11" font-weight="bold" text-anchor="end">15 Ω</text>

  <!-- Parallel Branch 2: 15 ohm -->
  <line x1="230" y1="40" x2="230" y2="70" stroke="#0f172a" stroke-width="2"/>
  <path d="M 230 70 L 224 75 L 236 85 L 224 95 L 236 105 L 230 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="230" y1="110" x2="230" y2="140" stroke="#0f172a" stroke-width="2"/>
  <text x="215" y="93" fill="#4f46e5" font-size="11" font-weight="bold" text-anchor="end">15 Ω</text>

  <!-- Parallel Branch 3: 15 ohm -->
  <line x1="310" y1="40" x2="310" y2="70" stroke="#0f172a" stroke-width="2"/>
  <path d="M 310 70 L 304 75 L 316 85 L 304 95 L 316 105 L 310 110" fill="none" stroke="#0f172a" stroke-width="2"/>
  <line x1="310" y1="110" x2="310" y2="140" stroke="#0f172a" stroke-width="2"/>
  <text x="325" y="93" fill="#4f46e5" font-size="11" font-weight="bold">15 Ω</text>

  <text x="190" y="168" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">R_parallel = 15 / 3 = 5 Ω ⇒ I = 5V / 5Ω = 1 A</text>
</svg>
`),

  // Unit 3 - Magnetism Q1: Current loop semi-circle
  u3_q1: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <rect width="380" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <defs>
    <marker id="arrow-blk" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 2 L 7 5 L 0 8 z" fill="#0f172a"/>
    </marker>
  </defs>

  <!-- Semicircle radius r -->
  <path d="M 130 110 A 60 60 0 0 1 250 110" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <!-- Center O -->
  <circle cx="190" cy="110" r="4" fill="#ef4444"/>
  <text x="190" y="130" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">O</text>

  <!-- Radius indicator -->
  <line x1="190" y1="110" x2="225" y2="60" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="215" y="80" fill="#64748b" font-size="12" font-weight="bold">r</text>

  <!-- Left incoming lead -->
  <line x1="50" y1="110" x2="130" y2="110" stroke="#0f172a" stroke-width="2.5" marker-end="url(#arrow-blk)"/>
  <text x="80" y="100" fill="#0f172a" font-size="12" font-weight="bold">I</text>

  <!-- Right outgoing lead -->
  <line x1="250" y1="110" x2="330" y2="110" stroke="#0f172a" stroke-width="2.5" marker-end="url(#arrow-blk)"/>
  <text x="290" y="100" fill="#0f172a" font-size="12" font-weight="bold">I</text>

  <!-- Arrow on semicircle arc -->
  <path d="M 180 50 L 195 50" stroke="#0f172a" stroke-width="2.5" marker-end="url(#arrow-blk)"/>

  <text x="190" y="165" fill="#475569" font-size="12" font-weight="bold" text-anchor="middle">Semi-circle loop of radius r carrying current I</text>
</svg>
`),

  // Unit 3 - Magnetism Q2: Crossed electric field E and magnetic field B
  u3_q2: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <rect width="380" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Top plate +++++ -->
  <rect x="60" y="30" width="260" height="15" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5"/>
  <text x="190" y="42" fill="#b91c1c" font-size="12" font-weight="bold" text-anchor="middle">+ + + + + + + + + + + + + + +</text>

  <!-- Bottom plate ----- -->
  <rect x="60" y="125" width="260" height="15" fill="#dbeafe" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="190" y="137" fill="#1d4ed8" font-size="12" font-weight="bold" text-anchor="middle">- - - - - - - - - - - - - - -</text>

  <!-- Magnetic field B into page (crosses) -->
  <g fill="#94a3b8" font-size="13" font-family="monospace" font-weight="bold">
    <text x="90" y="70">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
    <text x="90" y="95">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
    <text x="90" y="115">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
  </g>

  <!-- Electric field downward arrow -->
  <line x1="335" y1="50" x2="335" y2="120" stroke="#ef4444" stroke-width="2"/>
  <text x="345" y="85" fill="#ef4444" font-size="13" font-weight="bold">E</text>

  <text x="35" y="90" fill="#3b82f6" font-size="13" font-weight="bold">B ⊗</text>

  <!-- Electron entering -->
  <circle cx="50" cy="85" r="7" fill="#1e293b"/>
  <text x="50" y="89" fill="#fff" font-size="9" font-weight="bold" text-anchor="middle">e⁻</text>
  <line x1="57" y1="85" x2="320" y2="85" stroke="#10b981" stroke-width="2" stroke-dasharray="4,4"/>
  <text x="190" y="165" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Undeflected path: qE = qvB ⇒ v = E/B</text>
</svg>
`),

  // Unit 3 - Magnetism Q7: Two coaxial coils separated by R
  u3_q7: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <rect width="380" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axis line -->
  <line x1="40" y1="90" x2="340" y2="90" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4,4"/>

  <!-- Coil 1 (left) -->
  <ellipse cx="130" cy="90" rx="15" ry="50" fill="none" stroke="#4f46e5" stroke-width="3"/>
  <text x="130" y="32" fill="#4f46e5" font-size="12" font-weight="bold" text-anchor="middle">Coil 1 (N, R)</text>

  <!-- Coil 2 (right) -->
  <ellipse cx="250" cy="90" rx="15" ry="50" fill="none" stroke="#4f46e5" stroke-width="3"/>
  <text x="250" y="32" fill="#4f46e5" font-size="12" font-weight="bold" text-anchor="middle">Coil 2 (N, R)</text>

  <!-- Distance R between coils -->
  <line x1="130" y1="150" x2="250" y2="150" stroke="#0f172a" stroke-width="1.5"/>
  <text x="190" y="165" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Distance R</text>

  <!-- Center point P at R/2 -->
  <circle cx="190" cy="90" r="4" fill="#ef4444"/>
  <text x="190" y="80" fill="#ef4444" font-size="13" font-weight="bold" text-anchor="middle">P (at R/2)</text>
</svg>
`),

  // Unit 3 - Magnetism Q9: Bar magnet bent in an arc subtending 60 deg
  u3_q9: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 180" width="100%" height="100%">
  <rect width="340" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Center O -->
  <circle cx="80" cy="90" r="3" fill="#64748b"/>
  <!-- Rays to arc -->
  <line x1="80" y1="90" x2="250" y2="35" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>
  <line x1="80" y1="90" x2="250" y2="145" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3,3"/>

  <!-- Angle 60 deg -->
  <path d="M 120 78 A 45 45 0 0 1 120 102" fill="none" stroke="#ef4444" stroke-width="2"/>
  <text x="135" y="95" fill="#ef4444" font-size="13" font-weight="bold">60°</text>

  <!-- Arc representing bent bar magnet -->
  <path d="M 250 35 A 160 160 0 0 1 250 145" fill="none" stroke="#4f46e5" stroke-width="5"/>

  <!-- Magnetic poles S and N -->
  <circle cx="250" cy="35" r="7" fill="#ef4444"/>
  <text x="265" y="40" fill="#ef4444" font-size="13" font-weight="bold">N</text>

  <circle cx="250" cy="145" r="7" fill="#3b82f6"/>
  <text x="265" y="150" fill="#3b82f6" font-size="13" font-weight="bold">S</text>

  <text x="270" y="95" fill="#0f172a" font-size="12" font-weight="bold">Length l</text>
  <text x="170" y="170" fill="#475569" font-size="11" font-weight="bold" text-anchor="middle">New moment M' = 2M sin(θ/2) / θ = 3/π M</text>
</svg>
`),

  // Unit 3 - Magnetism Q11: B-H Hysteresis curve
  u3_q11: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 220" width="100%" height="100%">
  <rect width="380" height="220" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Axes -->
  <line x1="50" y1="110" x2="330" y2="110" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="190" y1="20" x2="190" y2="200" stroke="#0f172a" stroke-width="1.5"/>

  <text x="335" y="114" fill="#0f172a" font-size="12" font-weight="bold">H (A/m)</text>
  <text x="195" y="25" fill="#0f172a" font-size="12" font-weight="bold">B (Tesla)</text>

  <!-- Hysteresis Loop -->
  <path d="M 290 50 Q 230 50 190 70 Q 140 90 100 110 Q 70 125 90 170 Q 150 170 190 150 Q 240 130 280 110 Q 310 95 290 50 Z" 
        fill="#e0e7ff" fill-opacity="0.3" stroke="#4f46e5" stroke-width="2.5"/>

  <circle cx="100" cy="110" r="4" fill="#ef4444"/>
  <text x="80" y="100" fill="#ef4444" font-size="11" font-weight="bold">Coercivity</text>
  <text x="190" y="212" fill="#475569" font-size="11" font-weight="600" text-anchor="middle">Demagnetizing current = 1.25 mA</text>
</svg>
`),

  // Unit 4 - Induction Q1: Electron path XY with circular loop abcd
  u4_q1: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <rect width="380" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <defs>
    <marker id="arrow-el" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 2 L 7 5 L 0 8 z" fill="#3b82f6"/>
    </marker>
  </defs>

  <!-- Circular coil abcd -->
  <circle cx="210" cy="70" r="35" fill="none" stroke="#0f172a" stroke-width="2.5"/>
  <text x="210" y="30" fill="#4f46e5" font-size="13" font-weight="bold" text-anchor="middle">a</text>
  <text x="165" y="75" fill="#4f46e5" font-size="13" font-weight="bold">b</text>
  <text x="210" y="118" fill="#4f46e5" font-size="13" font-weight="bold" text-anchor="middle">c</text>
  <text x="255" y="75" fill="#4f46e5" font-size="13" font-weight="bold">d</text>

  <!-- Straight path XY below coil -->
  <line x1="60" y1="140" x2="320" y2="140" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrow-el)"/>
  <text x="50" y="145" fill="#3b82f6" font-size="14" font-weight="bold">X</text>
  <text x="330" y="145" fill="#3b82f6" font-size="14" font-weight="bold">Y</text>

  <!-- Electron -->
  <circle cx="120" cy="140" r="6" fill="#ef4444"/>
  <text x="120" y="160" fill="#ef4444" font-size="11" font-weight="bold" text-anchor="middle">Electron e⁻</text>

  <text x="210" y="170" fill="#475569" font-size="11" font-weight="bold" text-anchor="middle">Current reverses direction as electron passes past the coil</text>
</svg>
`),

  // Unit 4 - Induction Q2: Semicircular ring PQR falling in magnetic field
  u4_q2: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" height="100%">
  <rect width="380" height="200" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <defs>
    <marker id="arrow-v" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 2 L 7 5 L 0 8 z" fill="#ef4444"/>
    </marker>
  </defs>

  <!-- Magnetic field region with crosses -->
  <g fill="#94a3b8" font-size="14" font-family="monospace" font-weight="bold">
    <text x="60" y="40">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
    <text x="60" y="70">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
    <text x="60" y="100">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
    <text x="60" y="130">✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕ ✕</text>
  </g>

  <!-- Semicircular ring PQR -->
  <path d="M 120 100 A 60 60 0 0 0 240 100" fill="none" stroke="#0f172a" stroke-width="3"/>
  <text x="105" y="100" fill="#0f172a" font-size="14" font-weight="bold">P</text>
  <text x="180" y="175" fill="#0f172a" font-size="14" font-weight="bold" text-anchor="middle">Q</text>
  <text x="250" y="100" fill="#0f172a" font-size="14" font-weight="bold">R</text>

  <!-- Velocity arrow falling downwards -->
  <line x1="180" y1="100" x2="180" y2="145" stroke="#ef4444" stroke-width="2.5" marker-end="url(#arrow-v)"/>
  <text x="195" y="125" fill="#ef4444" font-size="13" font-weight="bold">v</text>

  <text x="190" y="190" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Induced emf = 2 r B v, with R at higher potential</text>
</svg>
`),

  // Unit 4 - Induction Q5: Graphs of variation of induced emf with time
  u4_q5: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 200" width="100%" height="100%">
  <rect width="460" height="200" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Input Current waveform -->
  <g transform="translate(10, 15)">
    <text x="10" y="15" fill="#0f172a" font-size="11" font-weight="bold">Current i(t):</text>
    <line x1="80" y1="40" x2="200" y2="40" stroke="#64748b" stroke-width="1"/>
    <line x1="80" y1="40" x2="80" y2="10" stroke="#64748b" stroke-width="1"/>
    <path d="M 80 40 L 110 15 L 140 15 L 170 40 L 200 40" fill="none" stroke="#3b82f6" stroke-width="2"/>
    <text x="110" y="52" fill="#64748b" font-size="8">T/4</text>
    <text x="140" y="52" fill="#64748b" font-size="8">2T/4</text>
    <text x="170" y="52" fill="#64748b" font-size="8">3T/4</text>
  </g>

  <!-- Option (a) - CORRECT -->
  <g transform="translate(20, 80)">
    <rect x="0" y="0" width="180" height="100" fill="#ecfdf5" rx="8" stroke="#10b981" stroke-width="1.5"/>
    <text x="10" y="18" fill="#047857" font-size="11" font-weight="bold">(a) Correct</text>
    <line x1="20" y1="55" x2="160" y2="55" stroke="#64748b" stroke-width="1"/>
    <line x1="20" y1="15" x2="20" y2="90" stroke="#64748b" stroke-width="1"/>
    <!-- Negative pulse, 0, Positive pulse, 0 -->
    <path d="M 20 80 L 50 80 L 50 55 L 85 55 L 85 30 L 120 30 L 120 55 L 155 55" fill="none" stroke="#047857" stroke-width="2"/>
  </g>

  <!-- Option (b) -->
  <g transform="translate(240, 80)">
    <rect x="0" y="0" width="180" height="100" fill="#ffffff" rx="8" stroke="#cbd5e1" stroke-width="1"/>
    <text x="10" y="18" fill="#475569" font-size="11" font-weight="bold">(b)</text>
    <line x1="20" y1="55" x2="160" y2="55" stroke="#64748b" stroke-width="1"/>
    <line x1="20" y1="15" x2="20" y2="90" stroke="#64748b" stroke-width="1"/>
    <path d="M 20 30 L 50 30 L 50 55 L 85 55 L 85 80 L 120 80 L 120 55" fill="none" stroke="#64748b" stroke-width="2"/>
  </g>
</svg>
`),

  // Unit 7 - Wave Optics Q8: Young's double slit with glass plate covering upper slit
  u7_q8: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 180" width="100%" height="100%">
  <rect width="380" height="180" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Slit barrier -->
  <line x1="80" y1="20" x2="80" y2="60" stroke="#0f172a" stroke-width="4"/>
  <line x1="80" y1="75" x2="80" y2="105" stroke="#0f172a" stroke-width="4"/>
  <line x1="80" y1="120" x2="80" y2="160" stroke="#0f172a" stroke-width="4"/>

  <!-- Slit S1 and S2 -->
  <text x="60" y="70" fill="#4f46e5" font-size="12" font-weight="bold">S₁</text>
  <text x="60" y="115" fill="#4f46e5" font-size="12" font-weight="bold">S₂</text>

  <!-- Glass slide covering S1 -->
  <rect x="84" y="58" width="16" height="20" fill="#93c5fd" fill-opacity="0.8" stroke="#3b82f6" stroke-width="1.5"/>
  <text x="105" y="52" fill="#1d4ed8" font-size="11" font-weight="bold">Glass slide</text>

  <!-- Screen on right -->
  <line x1="300" y1="20" x2="300" y2="160" stroke="#0f172a" stroke-width="3"/>
  <text x="310" y="90" fill="#0f172a" font-size="12" font-weight="bold">Screen</text>

  <!-- Central maximum shifted upwards -->
  <line x1="80" y1="90" x2="300" y2="90" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,3"/>
  <text x="245" y="85" fill="#94a3b8" font-size="10">Original center</text>

  <line x1="90" y1="68" x2="300" y2="55" stroke="#ef4444" stroke-width="1.5"/>
  <line x1="85" y1="112" x2="300" y2="55" stroke="#ef4444" stroke-width="1.5"/>
  <circle cx="300" cy="55" r="4" fill="#ef4444"/>
  <text x="310" y="55" fill="#ef4444" font-size="11" font-weight="bold">Shifted upwards</text>

  <text x="190" y="170" fill="#0f172a" font-size="11" font-weight="bold" text-anchor="middle">Introduction of glass plate shifts central maximum UPWARDS</text>
</svg>
`),

  // Unit 10 - Electronics Q11: Diode bias diagrams (a, b, c, d)
  u10_q11: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 220" width="100%" height="100%">
  <rect width="460" height="220" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Circuit (a) Forward Biased: 0V and -2V -->
  <g transform="translate(20, 20)">
    <rect x="0" y="0" width="195" height="85" fill="#ecfdf5" rx="8" stroke="#10b981" stroke-width="1.5"/>
    <text x="10" y="18" fill="#047857" font-size="12" font-weight="bold">(a) Forward Bias (Correct)</text>
    <text x="10" y="50" fill="#0f172a" font-size="12" font-weight="bold">0 V</text>
    <line x1="38" y1="46" x2="65" y2="46" stroke="#0f172a" stroke-width="2"/>
    <!-- Diode symbol: triangle and bar -->
    <path d="M 65 36 L 65 56 L 80 46 Z" fill="#10b981"/>
    <line x1="80" y1="36" x2="80" y2="56" stroke="#10b981" stroke-width="2.5"/>
    <line x1="80" y1="46" x2="105" y2="46" stroke="#0f172a" stroke-width="2"/>
    <!-- Resistor R -->
    <path d="M 105 46 L 110 40 L 118 52 L 126 40 L 134 52 L 140 46" fill="none" stroke="#0f172a" stroke-width="2"/>
    <line x1="140" y1="46" x2="160" y2="46" stroke="#0f172a" stroke-width="2"/>
    <text x="165" y="50" fill="#0f172a" font-size="12" font-weight="bold">-2 V</text>
    <text x="97" y="75" fill="#047857" font-size="10" font-weight="bold" text-anchor="middle">V_p (0V) &gt; V_n (-2V)</text>
  </g>

  <!-- Circuit (b) -4V and -3V (Reverse) -->
  <g transform="translate(245, 20)">
    <rect x="0" y="0" width="195" height="85" fill="#ffffff" rx="8" stroke="#cbd5e1" stroke-width="1"/>
    <text x="10" y="18" fill="#475569" font-size="12" font-weight="bold">(b)</text>
    <text x="10" y="50" fill="#0f172a" font-size="12" font-weight="bold">-4 V</text>
    <line x1="38" y1="46" x2="65" y2="46" stroke="#0f172a" stroke-width="2"/>
    <path d="M 65 36 L 65 56 L 80 46 Z" fill="#64748b"/>
    <line x1="80" y1="36" x2="80" y2="56" stroke="#64748b" stroke-width="2.5"/>
    <line x1="80" y1="46" x2="105" y2="46" stroke="#0f172a" stroke-width="2"/>
    <path d="M 105 46 L 110 40 L 118 52 L 126 40 L 134 52 L 140 46" fill="none" stroke="#0f172a" stroke-width="2"/>
    <line x1="140" y1="46" x2="160" y2="46" stroke="#0f172a" stroke-width="2"/>
    <text x="165" y="50" fill="#0f172a" font-size="12" font-weight="bold">-3 V</text>
  </g>

  <!-- Circuit (c) -2V and +2V (Reverse) -->
  <g transform="translate(20, 118)">
    <rect x="0" y="0" width="195" height="85" fill="#ffffff" rx="8" stroke="#cbd5e1" stroke-width="1"/>
    <text x="10" y="18" fill="#475569" font-size="12" font-weight="bold">(c)</text>
    <text x="10" y="50" fill="#0f172a" font-size="12" font-weight="bold">-2 V</text>
    <line x1="38" y1="46" x2="65" y2="46" stroke="#0f172a" stroke-width="2"/>
    <path d="M 65 36 L 65 56 L 80 46 Z" fill="#64748b"/>
    <line x1="80" y1="36" x2="80" y2="56" stroke="#64748b" stroke-width="2.5"/>
    <line x1="80" y1="46" x2="105" y2="46" stroke="#0f172a" stroke-width="2"/>
    <path d="M 105 46 L 110 40 L 118 52 L 126 40 L 134 52 L 140 46" fill="none" stroke="#0f172a" stroke-width="2"/>
    <line x1="140" y1="46" x2="160" y2="46" stroke="#0f172a" stroke-width="2"/>
    <text x="165" y="50" fill="#0f172a" font-size="12" font-weight="bold">+2 V</text>
  </g>

  <!-- Circuit (d) -3V and +5V (Reverse) -->
  <g transform="translate(245, 118)">
    <rect x="0" y="0" width="195" height="85" fill="#ffffff" rx="8" stroke="#cbd5e1" stroke-width="1"/>
    <text x="10" y="18" fill="#475569" font-size="12" font-weight="bold">(d)</text>
    <text x="10" y="50" fill="#0f172a" font-size="12" font-weight="bold">-3 V</text>
    <line x1="38" y1="46" x2="65" y2="46" stroke="#0f172a" stroke-width="2"/>
    <path d="M 65 36 L 65 56 L 80 46 Z" fill="#64748b"/>
    <line x1="80" y1="36" x2="80" y2="56" stroke="#64748b" stroke-width="2.5"/>
    <line x1="80" y1="46" x2="105" y2="46" stroke="#0f172a" stroke-width="2"/>
    <path d="M 105 46 L 110 40 L 118 52 L 126 40 L 134 52 L 140 46" fill="none" stroke="#0f172a" stroke-width="2"/>
    <line x1="140" y1="46" x2="160" y2="46" stroke="#0f172a" stroke-width="2"/>
    <text x="165" y="50" fill="#0f172a" font-size="12" font-weight="bold">+5 V</text>
  </g>
</svg>
`),

  // Unit 10 - Electronics Q12: Logic gate network equivalent to AND gate
  u10_q12: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" width="100%" height="100%">
  <rect width="420" height="160" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Inputs A and B -->
  <text x="25" y="55" fill="#0f172a" font-size="13" font-weight="bold">A</text>
  <text x="25" y="95" fill="#0f172a" font-size="13" font-weight="bold">B</text>

  <!-- NOR Gate 1 -->
  <line x1="45" y1="50" x2="80" y2="50" stroke="#0f172a" stroke-width="2"/>
  <line x1="45" y1="90" x2="80" y2="90" stroke="#0f172a" stroke-width="2"/>
  <!-- NOR body -->
  <path d="M 80 40 Q 95 70 80 100 Q 115 100 130 70 Q 115 40 80 40 Z" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/>
  <circle cx="134" cy="70" r="4" fill="#ffffff" stroke="#4f46e5" stroke-width="2"/>

  <!-- Connection to second inverter gate -->
  <line x1="138" y1="70" x2="170" y2="70" stroke="#0f172a" stroke-width="2"/>
  <line x1="170" y1="55" x2="170" y2="85" stroke="#0f172a" stroke-width="2"/>
  <line x1="170" y1="55" x2="190" y2="55" stroke="#0f172a" stroke-width="2"/>
  <line x1="170" y1="85" x2="190" y2="85" stroke="#0f172a" stroke-width="2"/>

  <!-- NOR Gate 2 (as Inverter) -->
  <path d="M 190 45 Q 205 70 190 95 Q 225 95 240 70 Q 225 45 190 45 Z" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/>
  <circle cx="244" cy="70" r="4" fill="#ffffff" stroke="#4f46e5" stroke-width="2"/>

  <!-- Output Y -->
  <line x1="248" y1="70" x2="310" y2="70" stroke="#0f172a" stroke-width="2"/>
  <text x="320" y="75" fill="#0f172a" font-size="14" font-weight="bold">Y</text>

  <text x="210" y="140" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Output Y = NOT(NOT(A + B)) = A + B (or AND gate configuration)</text>
</svg>
`),

  // Unit 10 - Electronics Q13: Logic circuit with inputs A, B, C and output 1
  u10_q13: svgToUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 160" width="100%" height="100%">
  <rect width="420" height="160" fill="#f8fafc" rx="16" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Inputs A, B -->
  <text x="25" y="45" fill="#0f172a" font-size="13" font-weight="bold">A</text>
  <text x="25" y="75" fill="#0f172a" font-size="13" font-weight="bold">B</text>
  <line x1="45" y1="40" x2="80" y2="40" stroke="#0f172a" stroke-width="2"/>
  <line x1="45" y1="70" x2="80" y2="70" stroke="#0f172a" stroke-width="2"/>

  <!-- NOR Gate for A, B -->
  <path d="M 80 30 Q 95 55 80 80 Q 115 80 130 55 Q 115 30 80 30 Z" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/>
  <circle cx="134" cy="55" r="4" fill="#ffffff" stroke="#4f46e5" stroke-width="2"/>

  <!-- Input C -->
  <text x="25" y="115" fill="#0f172a" font-size="13" font-weight="bold">C</text>
  <line x1="45" y1="110" x2="190" y2="110" stroke="#0f172a" stroke-width="2"/>

  <!-- Line from first gate to second gate -->
  <line x1="138" y1="55" x2="190" y2="55" stroke="#0f172a" stroke-width="2"/>
  <line x1="190" y1="55" x2="190" y2="75" stroke="#0f172a" stroke-width="2"/>
  <line x1="190" y1="75" x2="220" y2="75" stroke="#0f172a" stroke-width="2"/>
  <line x1="190" y1="110" x2="190" y2="95" stroke="#0f172a" stroke-width="2"/>
  <line x1="190" y1="95" x2="220" y2="95" stroke="#0f172a" stroke-width="2"/>

  <!-- Gate 2 -->
  <path d="M 220 65 Q 235 85 220 105 Q 255 105 270 85 Q 255 65 220 65 Z" fill="#e0e7ff" stroke="#4f46e5" stroke-width="2"/>
  <circle cx="274" cy="85" r="4" fill="#ffffff" stroke="#4f46e5" stroke-width="2"/>

  <!-- Output Y -->
  <line x1="278" y1="85" x2="330" y2="85" stroke="#0f172a" stroke-width="2"/>
  <text x="340" y="90" fill="#ef4444" font-size="14" font-weight="bold">Y = 1</text>

  <text x="210" y="145" fill="#0f172a" font-size="12" font-weight="bold" text-anchor="middle">Output is 1 when input ABC is 101</text>
</svg>
`)
};
