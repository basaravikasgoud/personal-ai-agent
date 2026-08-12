import React from 'react';

/**
 * Clean, lightweight Markdown Renderer for ChatGPT-style outputs
 */
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableHeader = null;
  let tableRows = [];
  let inCodeBlock = false;
  let codeBlockLines = [];
  let codeLanguage = '';

  const flushTable = (key) => {
    if (!inTable) return;
    elements.push(
      <div key={`table-${key}`} className="my-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80">
        <table className="w-full text-left text-xs border-collapse">
          {tableHeader && (
            <thead className="bg-slate-900/90 text-cyan-400 font-semibold border-b border-slate-800">
              <tr>
                {tableHeader.map((th, idx) => (
                  <th key={idx} className="px-4 py-2.5 border-r border-slate-800/60 last:border-r-0">
                    {parseInline(th)}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 border-r border-slate-800/60 last:border-r-0">
                    {parseInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    inTable = false;
    tableHeader = null;
    tableRows = [];
  };

  const flushCodeBlock = (key) => {
    if (!inCodeBlock) return;
    elements.push(
      <div key={`code-${key}`} className="my-4 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-cyan-300 overflow-x-auto">
        {codeLanguage && (
          <div className="text-[10px] uppercase font-bold text-slate-500 mb-2 border-b border-slate-800 pb-1">
            {codeLanguage}
          </div>
        )}
        <pre className="whitespace-pre">{codeBlockLines.join('\n')}</pre>
      </div>
    );
    inCodeBlock = false;
    codeBlockLines = [];
    codeLanguage = '';
  };

  const parseInline = (text) => {
    if (!text) return null;

    // Bold text (**text**)
    const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-100">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-cyan-300">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Code block toggles
    if (trimmed.startsWith('```')) {
      if (inTable) flushTable(index);
      if (inCodeBlock) {
        flushCodeBlock(index);
      } else {
        inCodeBlock = true;
        codeLanguage = trimmed.slice(3).trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      return;
    }

    // Table rows (| col1 | col2 |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed
        .split('|')
        .slice(1, -1)
        .map((c) => c.trim());

      // Check if separator line (| --- | --- |)
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        return;
      }

      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(index);
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={index} className="text-xl sm:text-2xl font-extrabold text-slate-100 font-display mt-6 mb-3 border-b border-slate-800 pb-2">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={index} className="text-lg sm:text-xl font-bold text-cyan-400 font-display mt-5 mb-2.5 flex items-center gap-2">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={index} className="text-base font-semibold text-slate-200 mt-4 mb-2">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed === '---') {
      elements.push(<hr key={index} className="my-6 border-slate-800" />);
    } else if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="my-3 pl-4 py-1.5 border-l-2 border-cyan-500 bg-cyan-950/20 text-cyan-200 text-xs sm:text-sm italic rounded-r-lg">
          {parseInline(trimmed.slice(2))}
        </blockquote>
      );
    } else if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
      const checked = trimmed.startsWith('- [x] ');
      elements.push(
        <div key={index} className="flex items-center gap-2.5 my-1.5 text-xs sm:text-sm text-slate-300">
          <input type="checkbox" checked={checked} readOnly className="rounded border-slate-700 text-cyan-500 bg-slate-900" />
          <span>{parseInline(trimmed.slice(6))}</span>
        </div>
      );
    } else if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      elements.push(
        <li key={index} className="ml-4 my-1 text-xs sm:text-sm text-slate-300 list-disc">
          {parseInline(trimmed.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const numMatch = trimmed.match(/^(\d+)\.\s/);
      const textAfter = trimmed.slice(numMatch[0].length);
      elements.push(
        <li key={index} className="ml-4 my-1 text-xs sm:text-sm text-slate-300 list-decimal">
          {parseInline(textAfter)}
        </li>
      );
    } else if (trimmed.length > 0) {
      elements.push(
        <p key={index} className="my-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    } else {
      elements.push(<div key={index} className="h-2" />);
    }
  });

  if (inTable) flushTable('end');
  if (inCodeBlock) flushCodeBlock('end');

  return <div className="space-y-1">{elements}</div>;
};

export default MarkdownRenderer;
