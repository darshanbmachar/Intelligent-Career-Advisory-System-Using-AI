import { useState } from 'react';
import { careerAPI, STREAM_SUBJECTS, POPULAR_CAREERS } from '../services/api.js';
import styles from './FormPage.module.css';

const TENTH_SUBJECTS = ['Mathematics', 'Science', 'Social Science', 'English', 'Second Language', 'Third Language'];

const STEPS = ['Personal Info', '10th Marks', '12th Marks', 'Career Goal', 'Review'];

export default function FormPage({ onBack, onResult }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    studentName: '',
    location: '',
    careerGoal: '',
    customCareer: '',
    has12th: 'no',
    tenthMarks: { Mathematics: '', Science: '', 'Social Science': '', English: '', 'Second Language': '', 'Third Language': '' },
    twelfthStream: 'Science-PCM',
    twelfthMarks: {},
  });

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const set10th = (subj, val) => setForm(f => ({ ...f, tenthMarks: { ...f.tenthMarks, [subj]: val } }));
  const set12th = (subj, val) => setForm(f => ({ ...f, twelfthMarks: { ...f.twelfthMarks, [subj]: val } }));

  const calc10thPct = () => {
    const vals = Object.values(form.tenthMarks).map(v => parseFloat(v)).filter(v => !isNaN(v));
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  };

  const calc12thPct = () => {
    const vals = Object.values(form.twelfthMarks).map(v => parseFloat(v)).filter(v => !isNaN(v));
    return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : null;
  };

  const streamSubjects = STREAM_SUBJECTS[form.twelfthStream] || [];

  const validate = () => {
    if (step === 0 && !form.studentName.trim()) return 'Please enter your name.';
    if (step === 3 && !form.careerGoal) return 'Please select a career goal.';
    if (step === 3 && form.careerGoal === 'Other (type below)' && !form.customCareer.trim()) return 'Please type your career goal.';
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    // skip step 2 if no 12th
    if (step === 1 && form.has12th === 'no') { setStep(3); return; }
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };

  const prev = () => {
    setError('');
    if (step === 3 && form.has12th === 'no') { setStep(1); return; }
    setStep(s => Math.max(s - 1, 0));
  };

  const buildPayload = () => {
    const tenth = {};
    TENTH_SUBJECTS.forEach(s => {
      const key = s === 'Social Science' ? 'socialScience' : s === 'Second Language' ? 'secondLanguage' : s === 'Third Language' ? 'thirdLanguage' : s.toLowerCase();
      const v = parseFloat(form.tenthMarks[s]);
      if (!isNaN(v)) tenth[key] = v;
    });
    tenth.totalPercentage = parseFloat(calc10thPct());

    let twelfth = null;
    if (form.has12th === 'yes') {
      twelfth = { stream: form.twelfthStream };
      streamSubjects.forEach(s => {
        const v = parseFloat(form.twelfthMarks[s]);
        if (!isNaN(v)) {
          const key = s.replace(/ ([a-z])/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase());
          twelfth[key] = v;
        }
      });
      twelfth.totalPercentage = parseFloat(calc12thPct());
    }

    return {
      studentName: form.studentName,
      location: form.location,
      careerGoal: form.careerGoal === 'Other (type below)' ? form.customCareer : form.careerGoal,
      tenthMarks: tenth,
      twelfthMarks: twelfth,
    };
  };

  const submit = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = buildPayload();
      const result = await careerAPI.getAdvice(payload);
      onResult(result);
    } catch (e) {
      if (e.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again in a moment.');
      } else {
        setError(e.response?.data?.message || 'Could not connect to the server. Make sure the backend is running on port 8080.');
      }
    } finally {
      setLoading(false);
    }
  };

  const pct10 = calc10thPct();
  const pct12 = calc12thPct();

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <span className={styles.appName}>PathFinder AI</span>
        <span />
      </div>

      {/* Progress */}
      <div className={styles.progressWrap}>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }} />
        </div>
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={i} className={`${styles.stepDot} ${i <= step ? styles.active : ''} ${i < step ? styles.done : ''}`}>
              <div className={styles.dot}>
                {i < step ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> : i + 1}
              </div>
              <span>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className={styles.card}>
        {/* Step 0: Personal */}
        {step === 0 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEmoji}>👤</span>
              <h2>Tell us about yourself</h2>
              <p>We'll personalise every recommendation just for you.</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>Full Name <span className={styles.req}>*</span></label>
              <input className={styles.input} placeholder="e.g. Priya Sharma" value={form.studentName} onChange={e => setField('studentName', e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label>City / State</label>
              <input className={styles.input} placeholder="e.g. Chennai, Tamil Nadu" value={form.location} onChange={e => setField('location', e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label>Have you completed 12th Standard?</label>
              <div className={styles.toggleGroup}>
                {['yes', 'no'].map(v => (
                  <button key={v} className={`${styles.toggleBtn} ${form.has12th === v ? styles.toggleActive : ''}`} onClick={() => setField('has12th', v)}>
                    {v === 'yes' ? '✅ Yes, I have' : '📚 No, just 10th'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1: 10th Marks */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEmoji}>📘</span>
              <h2>10th Standard Marks</h2>
              <p>Enter your marks out of 100. Leave blank if not applicable.</p>
            </div>
            <div className={styles.marksGrid}>
              {TENTH_SUBJECTS.map(subj => (
                <div key={subj} className={styles.markField}>
                  <label>{subj}</label>
                  <div className={styles.markInputWrap}>
                    <input
                      className={styles.markInput}
                      type="number" min="0" max="100" placeholder="—"
                      value={form.tenthMarks[subj]}
                      onChange={e => set10th(subj, e.target.value)}
                    />
                    <span className={styles.outOf}>/100</span>
                  </div>
                  {form.tenthMarks[subj] && (
                    <div className={styles.miniBar}>
                      <div style={{ width: `${Math.min(100, parseFloat(form.tenthMarks[subj]) || 0)}%`, background: parseFloat(form.tenthMarks[subj]) >= 75 ? 'var(--teal)' : parseFloat(form.tenthMarks[subj]) >= 50 ? 'var(--gold)' : 'var(--rose)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {pct10 && (
              <div className={styles.avgBadge}>
                <span>📊 Average</span>
                <strong style={{ color: parseFloat(pct10) >= 75 ? 'var(--teal)' : parseFloat(pct10) >= 50 ? '#a07c1a' : 'var(--rose)' }}>{pct10}%</strong>
              </div>
            )}
          </div>
        )}

        {/* Step 2: 12th Marks */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEmoji}>📗</span>
              <h2>12th Standard Marks</h2>
              <p>Select your stream and enter your subject marks.</p>
            </div>
            <div className={styles.fieldGroup}>
              <label>Stream / Combination</label>
              <select className={styles.select} value={form.twelfthStream} onChange={e => { setField('twelfthStream', e.target.value); setForm(f => ({ ...f, twelfthMarks: {} })); }}>
                {Object.keys(STREAM_SUBJECTS).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className={styles.marksGrid}>
              {streamSubjects.map(subj => (
                <div key={subj} className={styles.markField}>
                  <label>{subj}</label>
                  <div className={styles.markInputWrap}>
                    <input
                      className={styles.markInput}
                      type="number" min="0" max="100" placeholder="—"
                      value={form.twelfthMarks[subj] || ''}
                      onChange={e => set12th(subj, e.target.value)}
                    />
                    <span className={styles.outOf}>/100</span>
                  </div>
                  {form.twelfthMarks[subj] && (
                    <div className={styles.miniBar}>
                      <div style={{ width: `${Math.min(100, parseFloat(form.twelfthMarks[subj]) || 0)}%`, background: parseFloat(form.twelfthMarks[subj]) >= 75 ? 'var(--teal)' : parseFloat(form.twelfthMarks[subj]) >= 50 ? 'var(--gold)' : 'var(--rose)' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {pct12 && (
              <div className={styles.avgBadge}>
                <span>📊 Average</span>
                <strong style={{ color: parseFloat(pct12) >= 75 ? 'var(--teal)' : parseFloat(pct12) >= 50 ? '#a07c1a' : 'var(--rose)' }}>{pct12}%</strong>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Career Goal */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEmoji}>🎯</span>
              <h2>What's your career dream?</h2>
              <p>Choose from popular options or type your own.</p>
            </div>
            <div className={styles.careerGrid}>
              {POPULAR_CAREERS.map(c => (
                <button key={c} className={`${styles.careerChip} ${form.careerGoal === c ? styles.careerChipActive : ''}`} onClick={() => setField('careerGoal', c)}>
                  {c}
                </button>
              ))}
            </div>
            {form.careerGoal === 'Other (type below)' && (
              <div className={styles.fieldGroup} style={{ marginTop: 20 }}>
                <label>Describe your career goal</label>
                <input className={styles.input} placeholder="e.g. Marine Biologist" value={form.customCareer} onChange={e => setField('customCareer', e.target.value)} />
              </div>
            )}
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <div className={styles.stepHeader}>
              <span className={styles.stepEmoji}>✅</span>
              <h2>Review & Submit</h2>
              <p>Everything looks good? Let AI analyse your profile.</p>
            </div>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewCard}>
                <span className={styles.reviewIcon}>👤</span>
                <div>
                  <div className={styles.reviewLabel}>Student</div>
                  <div className={styles.reviewValue}>{form.studentName}</div>
                  {form.location && <div className={styles.reviewSub}>{form.location}</div>}
                </div>
              </div>
              <div className={styles.reviewCard}>
                <span className={styles.reviewIcon}>🎯</span>
                <div>
                  <div className={styles.reviewLabel}>Career Goal</div>
                  <div className={styles.reviewValue}>{form.careerGoal === 'Other (type below)' ? form.customCareer : form.careerGoal}</div>
                </div>
              </div>
              <div className={styles.reviewCard}>
                <span className={styles.reviewIcon}>📘</span>
                <div>
                  <div className={styles.reviewLabel}>10th Average</div>
                  <div className={styles.reviewValue} style={{ color: 'var(--teal)' }}>{pct10 ? pct10 + '%' : 'Not entered'}</div>
                </div>
              </div>
              {form.has12th === 'yes' && (
                <div className={styles.reviewCard}>
                  <span className={styles.reviewIcon}>📗</span>
                  <div>
                    <div className={styles.reviewLabel}>12th Average ({form.twelfthStream})</div>
                    <div className={styles.reviewValue} style={{ color: 'var(--teal)' }}>{pct12 ? pct12 + '%' : 'Not entered'}</div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.submitNote}>
              🤖 Our AI will analyse your complete academic profile and generate a personalised career roadmap, competitive exam guide, and job forecast.
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

        {/* Nav buttons */}
        <div className={styles.navBtns}>
          {step > 0 && (
            <button className={styles.navSecondary} onClick={prev} disabled={loading}>
              ← Previous
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < STEPS.length - 1 ? (
            <button className={styles.navPrimary} onClick={next}>
              {step === 1 && form.has12th === 'no' ? 'Skip to Career →' : 'Next →'}
            </button>
          ) : (
            <button className={styles.submitBtn} onClick={submit} disabled={loading}>
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  Analysing your profile…
                </>
              ) : '🚀 Generate My Career Report'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
