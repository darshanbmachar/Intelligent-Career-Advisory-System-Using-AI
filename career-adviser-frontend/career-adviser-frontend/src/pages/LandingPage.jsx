import { useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';

const FEATURES = [
  { icon: '📊', title: 'Mark Analysis', desc: 'Deep analysis of your 10th & 12th grades across all subjects' },
  { icon: '🎯', title: 'Career Match', desc: 'AI-powered compatibility score between your profile and dream career' },
  { icon: '🗺️', title: 'Educational Roadmap', desc: 'Personalised step-by-step pathway from school to career' },
  { icon: '📝', title: 'Competitive Exams', desc: 'Every exam you need — JEE, NEET, CLAT, UPSC & more' },
  { icon: '💼', title: 'Job Opportunities', desc: 'Real roles, salaries, and sectors waiting for you' },
  { icon: '🌟', title: 'Alternative Paths', desc: "Backup plans so you're never without direction" },
];

export default function LandingPage({ onStart }) {
  const orbs = useRef([]);

  useEffect(() => {
    const handleMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      orbs.current.forEach((orb, i) => {
        if (!orb) return;
        const factor = (i + 1) * 15;
        orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div className={styles.landing}>
      {/* Ambient orbs */}
      <div className={styles.orb} ref={el => orbs.current[0] = el} style={{ top: '10%', left: '15%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)' }} />
      <div className={styles.orb} ref={el => orbs.current[1] = el} style={{ top: '50%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(26,107,107,0.12) 0%, transparent 70%)' }} />
      <div className={styles.orb} ref={el => orbs.current[2] = el} style={{ bottom: '10%', left: '30%', width: 500, height: 300, background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />

      {/* Hero */}
      <header className={styles.header}>
        <div className={styles.badge}>🇮🇳 Made for Indian Students</div>

        <h1 className={styles.title}>
          <span className={styles.titleLine1}>Discover Your</span>
          <span className={styles.titleLine2}>Perfect Career</span>
          <span className={styles.titleLine3}>Path with AI</span>
        </h1>

        <p className={styles.subtitle}>
          Enter your 10th & 12th marks, share your dream career, and our AI will craft a
          personalised roadmap — from classroom to corner office.
        </p>

        <button className={styles.cta} onClick={onStart}>
          <span>Start My Career Journey</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>

        <div className={styles.trust}>
          <span>✓ Free to use</span>
          <span>✓ AI-powered by GPT-4</span>
          <span>✓ India-specific guidance</span>
        </div>
      </header>

      {/* Floating card preview */}
      <div className={styles.previewWrap}>
        <div className={styles.previewCard}>
          <div className={styles.previewHeader}>
            <div className={styles.previewDots}>
              <span style={{background:'#ff6b6b'}}/>
              <span style={{background:'#ffd93d'}}/>
              <span style={{background:'#6bcb77'}}/>
            </div>
            <span className={styles.previewTitle}>PathFinder AI — Career Report</span>
          </div>
          <div className={styles.previewBody}>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>Student</span>
              <span className={styles.previewValue}>Arjun Sharma</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>Career Goal</span>
              <span className={styles.previewValue}>Software Engineer</span>
            </div>
            <div className={styles.previewRow}>
              <span className={styles.previewLabel}>Match Score</span>
              <span className={styles.previewScore}>92%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{width:'92%'}} />
            </div>
            <div className={styles.previewTags}>
              <span>JEE Main</span><span>GATE</span><span>B.Tech CSE</span><span>IIT / NIT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section className={styles.features}>
        <h2 className={styles.featuresTitle}>Everything you need to choose <em>confidently</em></h2>
        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featureCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className={styles.bottomCta}>
        <h2>Ready to find your path?</h2>
        <p>Takes just 5 minutes. No sign-up required.</p>
        <button className={styles.cta} onClick={onStart}>
          <span>Get My Career Roadmap</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </section>
    </div>
  );
}
