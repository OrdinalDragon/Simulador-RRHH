import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { LandingCV } from './components/LandingCV.jsx';
import { CvDiagnosticStep } from './components/CvDiagnosticStep.jsx';
import { GameBoard } from './components/GameBoard.jsx';
import { ResultReport } from './components/ResultReport.jsx';
import { startSession, submitAnswer, finishSession } from './services/api.js';

export default function App() {
  const [phase, setPhase] = useState('landing'); // 'landing' | 'diagnostic' | 'playing' | 'results'
  const [isLoadingStart, setIsLoadingStart] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState('');

  // Estado de la partida
  const [sessionId, setSessionId] = useState(null);
  const [mode, setMode] = useState('standard');
  const [candidateName, setCandidateName] = useState('');
  const [cvAnalysis, setCvAnalysis] = useState(null);
  const [totalScenarios, setTotalScenarios] = useState(10);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [competencies, setCompetencies] = useState({
    organizacionDetalle: 50,
    gestionDatos: 50,
    confidencialidadEtica: 50,
    comunicacionServicio: 50,
  });

  // Estado de la ronda actual
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [feedbackState, setFeedbackState] = useState(null);

  // Estado del reporte final
  const [finalResult, setFinalResult] = useState(null);

  const handleStart = async (payload) => {
    setError('');
    setIsLoadingStart(true);
    try {
      const data = await startSession(payload);
      setSessionId(data.sessionId);
      setMode(data.mode);
      setCandidateName(data.candidateName);
      setCvAnalysis(data.cvAnalysis);
      setTotalScenarios(data.totalScenarios);
      setCurrentRound(1);
      setCurrentScenario(data.currentScenario);
      setCompetencies(data.competencies);
      setSelectedOptionId(null);
      setFeedbackState(null);
      setFinalResult(null);
      setPhase(data.mode === 'cv' && data.cvAnalysis ? 'diagnostic' : 'playing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'No se pudo iniciar la simulación.');
    } finally {
      setIsLoadingStart(false);
    }
  };

  const handleContinueFromDiagnostic = () => {
    setPhase('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswer = async (optionId) => {
    if (!sessionId || !currentScenario || feedbackState || isSubmittingAnswer) return;
    setError('');
    setSelectedOptionId(optionId);
    setIsSubmittingAnswer(true);
    try {
      const data = await submitAnswer({
        sessionId,
        scenarioId: currentScenario.id,
        optionId,
      });
      setCompetencies(data.competencies);
      setFeedbackState({
        feedback: data.feedback,
        isOptimal: data.isOptimal,
        impact: data.impact,
        isFinished: data.isFinished,
        nextScenario: data.nextScenario,
      });
    } catch (err) {
      setSelectedOptionId(null);
      setError(err.message || 'Error al registrar tu decisión.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleNext = async () => {
    if (!feedbackState) return;

    if (feedbackState.isFinished) {
      setIsFinishing(true);
      setError('');
      try {
        const resultData = await finishSession({ sessionId });
        setFinalResult(resultData);
        setPhase('results');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        setError(err.message || 'No se pudo generar el reporte final.');
      } finally {
        setIsFinishing(false);
      }
      return;
    }

    setCurrentScenario(feedbackState.nextScenario);
    setCurrentRound((prev) => prev + 1);
    setSelectedOptionId(null);
    setFeedbackState(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setPhase('landing');
    setSessionId(null);
    setCvAnalysis(null);
    setCurrentScenario(null);
    setSelectedOptionId(null);
    setFeedbackState(null);
    setFinalResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header phase={phase} candidateName={candidateName} onReset={handleReset} />

      <main className="flex-1">
        {phase === 'landing' && (
          <LandingCV onStart={handleStart} isLoading={isLoadingStart} error={error} />
        )}

        {phase === 'diagnostic' && (
          <CvDiagnosticStep
            candidateName={candidateName}
            cvAnalysis={cvAnalysis}
            totalScenarios={totalScenarios}
            onContinue={handleContinueFromDiagnostic}
          />
        )}

        {phase === 'playing' && (
          <GameBoard
            mode={mode}
            cvAnalysis={cvAnalysis}
            scenario={currentScenario}
            currentRound={currentRound}
            totalScenarios={totalScenarios}
            competencies={competencies}
            feedbackState={feedbackState}
            selectedOptionId={selectedOptionId}
            isSubmitting={isSubmittingAnswer}
            isFinishing={isFinishing}
            error={error}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}

        {phase === 'results' && (
          <ResultReport result={finalResult} onRestart={handleReset} />
        )}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-5 text-center text-xs text-slate-500 no-print">
        <div className="mx-auto max-w-6xl px-4">
          IZET S.A. · Departamento de Recursos Humanos · Simulador interactivo de selección (CET / SAIE)
        </div>
      </footer>
    </div>
  );
}
