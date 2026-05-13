import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../shared/components/Sidebar";
import { startSession, submitAnswer, finishSession } from "../quizService";
import styles from "../quiz.module.css";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_LABELS = {
  kosakata: "Kosakata",
  grammar: "Grammar",
  menyimak: "Menyimak",
};

// ─── Halaman Quiz ─────────────────────────────────────────────────────────────

export default function QuizPage() {
  const { topicId } = useParams();
  const navigate = useNavigate();

  // ── Session state ──────────────────────────────────────────────────────────
  const [phase, setPhase] = useState("loading"); // loading|quiz|finishing|done|error
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerResult, setAnswerResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // FinishSessionResponse

  // ── Per-question answer input state ───────────────────────────────────────
  const [selectedKey, setSelectedKey] = useState(null); // multiple_choice
  const [inputValue, setInputValue] = useState(""); // fill_blank
  const [arranged, setArranged] = useState([]); // drag_drop (placed words)
  const [available, setAvailable] = useState([]); // drag_drop (word pool)

  // ── Fetch session on mount ─────────────────────────────────────────────────
  useEffect(() => {
    startSession(topicId)
      .then((res) => {
        const data = res.data;
        setSession(data);
        resetInputFor(data.questions[0]);
        setPhase("quiz");
      })
      .catch(() => setPhase("error"));
  }, [topicId]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const resetInputFor = (q) => {
    setAnswerResult(null);
    setSelectedKey(null);
    setInputValue("");
    setArranged([]);
    setAvailable(q?.type === "drag_drop" ? [...(q.words ?? [])] : []);
  };

  const currentQ = session?.questions[currentIdx];
  const isLast = session && currentIdx >= session.total_questions - 1;
  const progressPct = session
    ? Math.round((currentIdx / session.total_questions) * 100)
    : 0;

  // ── Submit answer to API ───────────────────────────────────────────────────

  const handleSubmit = async (answer) => {
    if (submitting || answerResult) return;
    setSubmitting(true);
    try {
      const res = await submitAnswer(topicId, {
        session_id: session.session_id,
        question_id: currentQ.id,
        answer,
      });
      const ar = res.data;
      setAnswerResult(ar);
      if (ar.is_correct) setCorrectCount((c) => c + 1);
    } catch {
      // allow retry on network error
    } finally {
      setSubmitting(false);
    }
  };

  // ── Answer handlers per question type ─────────────────────────────────────

  const handleChoiceClick = (key) => {
    if (submitting || answerResult) return;
    setSelectedKey(key);
    handleSubmit(key);
  };

  const handleFillSubmit = (e) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val || submitting || answerResult) return;
    handleSubmit(val);
  };

  const handleDragSubmit = () => {
    if (arranged.length === 0 || submitting || answerResult) return;
    handleSubmit(arranged);
  };

  const moveToArranged = (word, idx) => {
    setAvailable((prev) => prev.filter((_, i) => i !== idx));
    setArranged((prev) => [...prev, word]);
  };

  const moveToAvailable = (word, idx) => {
    setArranged((prev) => prev.filter((_, i) => i !== idx));
    setAvailable((prev) => [...prev, word]);
  };

  // ── Next question / finish ─────────────────────────────────────────────────

  const handleNext = async () => {
    if (isLast) {
      setPhase("finishing");
      try {
        const res = await finishSession(topicId, session.session_id);
        setResult(res.data);
        setPhase("done");
      } catch {
        navigate("/dashboard");
      }
    } else {
      const next = currentIdx + 1;
      setCurrentIdx(next);
      resetInputFor(session.questions[next]);
    }
  };

  // ── Render states ──────────────────────────────────────────────────────────

  if (phase === "loading")
    return <div className={styles.loading}>Memuat soal...</div>;
  if (phase === "error")
    return (
      <div className={styles.errorBox}>
        Gagal memuat sesi. Silakan coba lagi.
      </div>
    );

  // Done screen
  if (phase === "done" && result) {
    return (
      <div className={styles.root}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.sessionHeader}>
            <div className={styles.sessionInfo}>
              <h2>
                {result.topic_name} —{" "}
                {SKILL_LABELS[session.topic.skill] ?? session.topic.skill}
              </h2>
              <p>{session.topic.level}</p>
            </div>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressMeta}>
              <span className={styles.progressLabel}>Selesai!</span>
              <span className={styles.progressCount}>
                {result.correct_count} benar
              </span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: "100%" }} />
            </div>
          </div>

          <div className={styles.done}>
            <div className={styles.doneIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M6 17L12 23L26 9"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.scoreBig}>{result.score_percent}%</div>
            <div className={styles.scoreLabel}>
              {result.correct_count} benar dari {result.total_questions} soal
            </div>
            <h2>Sesi Selesai!</h2>
            <p>
              Kamu berhasil menyelesaikan latihan {result.topic_name} hari ini.
              {result.xp_gained > 0 && ` +${result.xp_gained} XP didapat.`}
            </p>
            <button
              className={styles.doneBtn}
              onClick={() => navigate("/dashboard")}
            >
              Kembali ke Dashboard →
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Quiz screen (answering or showing feedback)
  const isAnswered = !!answerResult;

  const optionClass = (key) => {
    const isSelected = selectedKey === key;
    const isCorrectAns = isAnswered && answerResult.correct_answer === key;
    const isWrong = isSelected && isAnswered && !answerResult.is_correct;

    let cls = styles.option;
    if (isSelected && answerResult?.is_correct)
      cls += ` ${styles.selectedCorrect}`;
    else if (isWrong) cls += ` ${styles.selectedWrong}`;
    else if (isCorrectAns) cls += ` ${styles.showCorrect}`;
    if (isAnswered) cls += ` ${styles.disabled}`;
    return cls;
  };

  const optKeyClass = (key) => {
    const isSelected = selectedKey === key;
    const isCorrectAns = isAnswered && answerResult.correct_answer === key;
    if ((isSelected && answerResult?.is_correct) || isCorrectAns)
      return styles.optKeyCorrect;
    if (isSelected && isAnswered && !answerResult.is_correct)
      return styles.optKeyWrong;
    return "";
  };

  const optTextClass = (key) => {
    const isSelected = selectedKey === key;
    const isCorrectAns = isAnswered && answerResult.correct_answer === key;
    if ((isSelected && answerResult?.is_correct) || isCorrectAns)
      return styles.optTextCorrect;
    if (isSelected && isAnswered && !answerResult.is_correct)
      return styles.optTextWrong;
    return "";
  };

  return (
    <div className={styles.root}>
      <Sidebar />

      <main className={styles.main}>
        {/* Session header */}
        <div className={styles.sessionHeader}>
          <div className={styles.sessionInfo}>
            <h2>
              {session.topic.name} —{" "}
              {SKILL_LABELS[session.topic.skill] ?? session.topic.skill}
            </h2>
            <p>Pilihan Ganda · {session.topic.level}</p>
          </div>
          <button
            className={styles.exitBtn}
            onClick={() => navigate("/dashboard")}
          >
            ✕ Keluar Sesi
          </button>
        </div>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span className={styles.progressLabel}>
              Soal {currentIdx + 1} dari {session.total_questions}
            </span>
            <span className={styles.progressCount}>{correctCount} benar</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <div className={styles.soalCard}>
          <div className={styles.soalTag}>SOAL {currentIdx + 1}</div>
          <div className={styles.soalText}>{currentQ.text}</div>
          {currentQ.context && (
            <div className={styles.soalContext}>{currentQ.context}</div>
          )}

          {/* Multiple choice */}
          {currentQ.type === "multiple_choice" && currentQ.options && (
            <div className={styles.options}>
              {currentQ.options.map((optionValue, idx) => {
                const label = String.fromCharCode(65 + idx);

                return (
                  <button
                    key={label} // Sekarang key-nya unik (A, B, C, D)
                    className={optionClass(optionValue)} // Gunakan nilainya langsung sebagai identifier
                    onClick={() => handleChoiceClick(optionValue)}
                  >
                    <span
                      className={`${styles.optKey} ${optKeyClass(optionValue)}`}
                    >
                      {label}
                    </span>
                    <span
                      className={`${styles.optText} ${optTextClass(optionValue)}`}
                    >
                      {optionValue}{" "}
                      {/* Tampilkan string "Kantin", "Perpustakaan", dll */}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill blank */}
          {currentQ.type === "fill_blank" && (
            <form className={styles.fillForm} onSubmit={handleFillSubmit}>
              <input
                className={`${styles.fillInput} ${
                  isAnswered
                    ? answerResult.is_correct
                      ? styles.fillCorrect
                      : styles.fillWrong
                    : ""
                }`}
                type="text"
                placeholder="Ketik jawabanmu..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnswered || submitting}
                autoFocus
              />
              {isAnswered && !answerResult.is_correct && (
                <div className={styles.correctAnswerHint}>
                  Jawaban benar: <strong>{answerResult.correct_answer}</strong>
                </div>
              )}
              {!isAnswered && (
                <button
                  className={styles.submitBtn}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? "Memeriksa..." : "Jawab"}
                </button>
              )}
            </form>
          )}

          {/* Drag-drop (click to arrange) */}
          {currentQ.type === "drag_drop" && (
            <div className={styles.dragWrap}>
              <div className={styles.dragArranged}>
                {arranged.length === 0 ? (
                  <span className={styles.dragPlaceholder}>
                    Klik kata di bawah untuk menyusun kalimat
                  </span>
                ) : (
                  arranged.map((w, i) => (
                    <button
                      key={`a-${w}-${i}`}
                      className={styles.wordChipArranged}
                      onClick={() => !isAnswered && moveToAvailable(w, i)}
                    >
                      {w}
                    </button>
                  ))
                )}
              </div>
              <div className={styles.dragAvailable}>
                {available.map((w, i) => (
                  <button
                    key={`v-${w}-${i}`}
                    className={styles.wordChip}
                    onClick={() => moveToArranged(w, i)}
                    disabled={isAnswered || submitting}
                  >
                    {w}
                  </button>
                ))}
              </div>
              {isAnswered && !answerResult.is_correct && (
                <div className={styles.correctAnswerHint}>
                  Jawaban benar:{" "}
                  <strong>
                    {Array.isArray(answerResult.correct_answer)
                      ? answerResult.correct_answer.join(" ")
                      : answerResult.correct_answer}
                  </strong>
                </div>
              )}
              {!isAnswered && (
                <button
                  className={styles.submitBtn}
                  onClick={handleDragSubmit}
                  disabled={arranged.length === 0 || submitting}
                >
                  {submitting ? "Memeriksa..." : "Jawab"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div
            className={`${styles.feedback} ${answerResult.is_correct ? styles.feedbackCorrect : styles.feedbackWrong}`}
          >
            <span className={styles.feedbackIcon}>
              {answerResult.is_correct ? "✓" : "✕"}
            </span>
            <div className={styles.feedbackText}>
              <strong>
                {answerResult.is_correct ? "Jawaban Benar!" : "Kurang Tepat"}
              </strong>
              {answerResult.is_correct
                ? answerResult.feedback_correct
                : answerResult.feedback_wrong}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className={styles.bottomNav}>
          {isAnswered &&
          answerResult.is_correct &&
          answerResult.xp_gained > 0 ? (
            <div className={styles.xpEarned}>
              <span>+{answerResult.xp_gained} XP didapat</span>
              <span className={styles.xpBadge}>
                +{answerResult.xp_gained} XP
              </span>
            </div>
          ) : (
            <div />
          )}

          {isAnswered && (
            <button
              className={styles.nextBtn}
              onClick={handleNext}
              disabled={phase === "finishing"}
            >
              {phase === "finishing"
                ? "Menyimpan..."
                : isLast
                  ? "Selesai →"
                  : "Soal Berikutnya →"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
