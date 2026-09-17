import React from 'react';
import { ArrowRight, Zap, Sparkles, Beaker, Layers } from 'lucide-react';

interface ChemicalRendererProps {
  content: string;
  className?: string;
  highlightEquations?: boolean;
}

/**
 * Parses and formats chemical text into superscripts, subscripts, and symbols
 */
export const formatChemicalText = (text: string): React.ReactNode => {
  if (!text) return text;

  // Split by newlines first to preserve formatting
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Check if line is a reaction sequence with arrow notation
    const isReactionSequence =
      line.includes('-->') || line.includes('→') || line.includes('⇌') || line.includes('⇄');

    // Check if it's a Latimer potential diagram (e.g. BrO₄⁻ --(1.82V)--> BrO₃⁻)
    const isLatimerDiagram =
      isReactionSequence && (line.includes('V)') || line.includes('V)-->'));

    if (isLatimerDiagram) {
      return (
        <div key={lineIdx} className="my-3 overflow-x-auto">
          <LatimerDiagramVisualizer line={line} />
        </div>
      );
    }

    if (isReactionSequence && (line.includes('-->') || (line.includes('(') && line.includes(')')))) {
      return (
        <div key={lineIdx} className="my-2.5">
          <ReactionSequenceVisualizer line={line} />
        </div>
      );
    }

    // Format chemical tokens inside normal lines
    return (
      <span key={lineIdx} className="inline">
        {lineIdx > 0 && <br />}
        {renderInlineChemistry(line)}
      </span>
    );
  });
};

/**
 * Latimer Diagram Visualizer (Electrochemistry standard reduction potential diagram)
 */
const LatimerDiagramVisualizer: React.FC<{ line: string }> = ({ line }) => {
  // Example: BrO₄⁻ --(1.82V)--> BrO₃⁻ --(1.5V)--> HBrO --(1.595V)--> Br₂ --(1.065V)--> Br⁻
  const parts = line.split(/--\((.*?)\)-->|→/g).filter(Boolean);

  // Parse steps: Species -> Voltage -> Species -> Voltage...
  const steps: { species: string; potential?: string }[] = [];
  
  // Extract with regex
  const regex = /([^\s\-\(]+(?:\s*[^\s\-\(]+)?)\s*(?:--\(([^\)]+)\)-->|→|$)/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    if (match[1]?.trim()) {
      steps.push({
        species: match[1].trim(),
        potential: match[2]?.trim(),
      });
    }
  }

  if (steps.length <= 1) {
    return (
      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 font-mono text-sm">
        {line}
      </div>
    );
  }

  return (
    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-indigo-50/60 to-purple-50/80 dark:from-slate-900 dark:via-indigo-950/30 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-2.5">
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        <span>Latimer Reduction Potential Diagram (Volts)</span>
      </div>
      <div className="flex items-center gap-2 flex-nowrap min-w-max pb-1">
        {steps.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold text-slate-800 dark:text-slate-100 font-mono text-sm">
              {renderInlineChemistry(step.species)}
            </div>
            {step.potential && (
              <div className="flex flex-col items-center px-1 text-center">
                <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-100/90 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-300 dark:border-amber-700 shadow-2xs">
                  +{step.potential.replace('+', '')}
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400 -mt-0.5" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * Organic / Inorganic Reaction Sequence Flowchart
 * Formats: "A --(Reagents)--> B --(Reagents)--> C"
 */
const ReactionSequenceVisualizer: React.FC<{ line: string }> = ({ line }) => {
  // Check if line contains sequence arrows
  const segments: Array<{ reactant: string; reagent?: string }> = [];

  // Match items like: "Ethanol --(PCl₅)--> X --(alc. KOH)--> Y"
  const stepRegex = /(.*?)(?:--\((.*?)\)-->|-->(.*?)|→(.*?)|$)/g;
  let match;
  let lastIndex = 0;

  const rawTokens = line.split(/--\((.*?)\)-->/);
  
  if (rawTokens.length > 1) {
    for (let i = 0; i < rawTokens.length; i += 2) {
      const reactant = rawTokens[i]?.trim();
      const reagent = rawTokens[i + 1]?.trim();
      if (reactant || reagent) {
        segments.push({ reactant: reactant || '?', reagent });
      }
    }
  }

  if (segments.length <= 1) {
    // Normal single-arrow equation: A + B → C + D
    return (
      <div className="p-3 my-2 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 font-mono text-sm sm:text-base text-slate-800 dark:text-slate-200">
        {renderInlineChemistry(line)}
      </div>
    );
  }

  return (
    <div className="my-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-2xs overflow-x-auto">
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
        <Beaker className="w-3.5 h-3.5 text-indigo-500" />
        <span>Reaction Pathway Scheme</span>
      </div>
      <div className="flex items-center gap-2 flex-nowrap min-w-max pb-1">
        {segments.map((seg, idx) => (
          <React.Fragment key={idx}>
            <div className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-bold text-slate-900 dark:text-white font-mono text-sm">
              {renderInlineChemistry(seg.reactant)}
            </div>
            {seg.reagent && (
              <div className="flex flex-col items-center px-1">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 shadow-2xs whitespace-nowrap">
                  {seg.reagent}
                </span>
                <ArrowRight className="w-4 h-4 text-indigo-500 dark:text-indigo-400 -mt-0.5" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * Renders subscripts and superscripts in standard chemical formulas and math expressions
 */
const renderInlineChemistry = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split by LaTeX tokens like $...$ if present
  const parts = text.split(/(\$[^\$]+\$)/g);

  return parts.map((part, pIdx) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      const inner = part.slice(1, -1);
      return (
        <span key={pIdx} className="font-serif italic font-semibold px-0.5 text-indigo-700 dark:text-indigo-300">
          {formatMathString(inner)}
        </span>
      );
    }

    return <span key={pIdx}>{formatChemicalString(part)}</span>;
  });
};

/**
 * Helper to format chemical strings with subscripts/superscripts (H2O, Fe3+, CO3^2-, 10^-2)
 */
const formatChemicalString = (str: string): React.ReactNode => {
  // Parse common chemistry subscripts and superscripts
  // Match patterns like: [A]₀, e⁻⁶⁰ˣ, mol⁻¹, 10⁻², [Fe(CN)₆]⁴⁻, CH₃, H₂SO₄
  const elements = str.split(/(\b(?:[A-Z][a-z]?\d+)+(?:[A-Z][a-z]?\d*)*\b|10[⁻\^][\d\-\+]+|\b[A-Z][a-z]?[\⁺\⁻\²\³\⁴\⁵\⁶\⁷\⁸\⁹\⁰]+\b|\[.*?\][⁺⁻\d]*|[a-zA-Z]+[₀₁₂₃₄₅₆₇₈₉\+\-]+)/g);

  return elements.map((elem, eIdx) => {
    // If element contains unicode sub/superscripts, keep it clean
    if (
      elem.includes('₀') ||
      elem.includes('₁') ||
      elem.includes('₂') ||
      elem.includes('₃') ||
      elem.includes('₄') ||
      elem.includes('₅') ||
      elem.includes('₆') ||
      elem.includes('₇') ||
      elem.includes('₈') ||
      elem.includes('₉') ||
      elem.includes('⁻') ||
      elem.includes('⁺') ||
      elem.includes('²') ||
      elem.includes('³') ||
      elem.includes('⁴')
    ) {
      return (
        <span key={eIdx} className="font-mono tracking-tight font-medium">
          {elem}
        </span>
      );
    }

    return elem;
  });
};

/**
 * Format math strings inside $...$
 */
const formatMathString = (str: string): React.ReactNode => {
  // Simple LaTeX replacements
  let formatted = str
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\delta/g, 'δ')
    .replace(/\\theta/g, 'θ')
    .replace(/\\pi/g, 'π')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\mu/g, 'μ')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\infty/g, '∞')
    .replace(/\\pm/g, '±')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\sqrt/g, '√')
    .replace(/\\rightarrow/g, '→')
    .replace(/\\rightleftharpoons/g, '⇌')
    .replace(/\\text\{([^}]+)\}/g, '$1');

  return formatted;
};

/**
 * Dedicated Chemistry Diagram Card for visual representation
 */
export const ChemistryDiagramCard: React.FC<{
  type: string;
  title?: string;
  description?: string;
}> = ({ type, title, description }) => {
  return (
    <div className="my-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
          {title || 'Chemical Structure & Diagram'}
        </span>
      </div>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
          {description}
        </p>
      )}
    </div>
  );
};

export const ChemicalContent: React.FC<ChemicalRendererProps> = ({
  content,
  className = '',
}) => {
  return (
    <div className={`leading-relaxed ${className}`}>
      {formatChemicalText(content)}
    </div>
  );
};
