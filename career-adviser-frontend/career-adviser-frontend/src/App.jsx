import { useState } from 'react';
import LandingPage from './pages/LandingPage.jsx';
import FormPage from './pages/FormPage.jsx';
import ResultPage from './pages/ResultPage.jsx';

export default function App() {
  const [page, setPage] = useState('landing'); // landing | form | result
  const [result, setResult] = useState(null);

  const handleStart = () => setPage('form');
  const handleBack = () => setPage('landing');
  const handleResult = (data) => {
    setResult(data);
    setPage('result');
  };
  const handleRestart = () => {
    setResult(null);
    setPage('landing');
  };

  return (
    <>
      {page === 'landing' && <LandingPage onStart={handleStart} />}
      {page === 'form' && <FormPage onBack={handleBack} onResult={handleResult} />}
      {page === 'result' && <ResultPage result={result} onRestart={handleRestart} />}
    </>
  );
}
