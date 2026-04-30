import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './ResultPage.module.css';

const SECTION_ICONS = {
  'career match': '🎯',
  'academic strength': '💪',
  'areas for improvement': '📈',
  'improvement': '📈',
  'educational roadmap': '🗺️',
  'roadmap': '🗺️',
  'competitive exam': '📝',
  'career & job': '💼',
  'job opportunit': '💼',
  'alternative career': '🔀',
  'action plan': '⚡',
  'motivational': '🌟',
};

function getSectionIcon(heading) {
  const lower = heading.toLowerCase();
  for (const [key, icon] of Object.entries(SECTION_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '📌';
}

function ScoreRing({ score }) {
  const radius = 54;
  const circ = 2 * Math.PI * radius;
  const [animScore, setAnimScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimScore(score), 400);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circ - (animScore / 100) * circ;
  const color = animScore >= 80 ? '#1a6b6b' : animScore >= 60 ? '#c9a84c' : '#c45c5c';

  return (
    <div className={styles.ringWrap}>
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="#f0ebe0" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1), stroke 0.5s' }}
        />
      </svg>
      <div className={styles.ringCenter}>
        <span className={styles.ringScore} style={{ color }}>{Math.round(animScore)}%</span>
        <span className={styles.ringLabel}>Match</span>
      </div>
    </div>
  );
}

function parseSection(markdown, heading) {
  const lines = markdown.split('\n');
  const pattern = new RegExp(`##\\s*\\d*\\.?\\s*${heading}`, 'i');
  let start = -1, end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && pattern.test(lines[i])) { start = i; continue; }
    if (start !== -1 && /^##\s/.test(lines[i])) { end = i; break; }
  }
  if (start === -1) return null;
  return lines.slice(start, end).join('\n');
}

function parseSections(markdown) {
  if (!markdown) return [];
  const lines = markdown.split('\n');
  const sections = [];
  let current = null;

  for (const line of lines) {
    if (/^##\s/.test(line)) {
      if (current) sections.push(current);
      current = { heading: line.replace(/^##\s*\d*\.?\s*/, '').trim(), content: [] };
    } else if (current) {
      current.content.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

export default function ResultPage({ result, onRestart }) {
  const [activeTab, setActiveTab] = useState(0);
  const printRef = useRef();

  if (!result || !result.success) {
    return (
      <div className={styles.errorPage}>
        <div className={styles.errorCard}>
          <span style={{ fontSize: '3rem' }}>😕</span>
          <h2>Something went wrong</h2>
          <p>{result?.errorMessage || 'Could not generate career advice. Please try again.'}</p>
          <button className={styles.restartBtn} onClick={onRestart}>← Try Again</button>
        </div>
      </div>
    );
  }

  const sections = parseSections(result.fullAdvice || '');
  const score = result.careerMatchPercentage || 75;

  const handlePrint = () => window.print();

  return (
    <div className={styles.page} ref={printRef}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.headerLeft}>
            <div className={styles.headerBadge}>✨ Career Analysis Complete</div>
            <h1 className={styles.headerName}>{result.studentName}</h1>
            <p className={styles.headerGoal}>
              <span className={styles.goalLabel}>Dream Career:</span>
              <span className={styles.goalValue}>{result.careerGoal}</span>
            </p>
          </div>
          <ScoreRing score={score} />
        </div>

        <div className={styles.actionBtns}>
          <button className={styles.printBtn} onClick={handlePrint}>
            🖨️ Print / Save PDF
          </button>
          <button className={styles.restartBtn} onClick={onRestart}>
            🔄 New Analysis
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      {sections.length > 0 && (
        <div className={styles.tabs}>
          <div className={styles.tabList}>
            <button
              className={`${styles.tab} ${activeTab === -1 ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(-1)}
            >
              📄 Full Report
            </button>
            {sections.map((sec, i) => (
              <button
                key={i}
                className={`${styles.tab} ${activeTab === i ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {getSectionIcon(sec.heading)} {sec.heading.replace(/^\d+\.\s*/, '')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        {activeTab === -1 ? (
          /* Full report */
          <div className={styles.fullReport}>
            {sections.map((sec, i) => (
              <div key={i} className={styles.section} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>{getSectionIcon(sec.heading)}</span>
                  <h2 className={styles.sectionTitle}>{sec.heading.replace(/^\d+\.\s*/, '')}</h2>
                </div>
                <div className={styles.sectionBody}>
                  <ReactMarkdown>{sec.content.join('\n')}</ReactMarkdown>
                </div>
              </div>
            ))}
            {!sections.length && (
              <div className={styles.section}>
                <div className={styles.sectionBody}>
                  <ReactMarkdown>{result.fullAdvice}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Single section */
          sections[activeTab] && (
            <div className={styles.singleSection}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionIcon}>{getSectionIcon(sections[activeTab].heading)}</span>
                <h2 className={styles.sectionTitle}>{sections[activeTab].heading.replace(/^\d+\.\s*/, '')}</h2>
              </div>
              <div className={styles.sectionBody}>
                <ReactMarkdown>{sections[activeTab].content.join('\n')}</ReactMarkdown>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
