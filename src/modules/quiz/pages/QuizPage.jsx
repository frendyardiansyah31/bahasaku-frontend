import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../../../shared/components/Sidebar";
import { startSession, submitAnswer, finishSession } from "../quizService";
import styles from "../quiz.module.css";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_I18N_KEY = {
  kosakata: "dashboard.skillKosakata",
  grammar:  "dashboard.skillGrammar",
  menyimak: "dashboard.skillMenyimak",
};

// ─── Halaman Quiz ─────────────────────────────────────────────────────────────

export default function QuizPage() {
  const { t } = useTranslation();
  const { topicId } = useParams();
  const navigate = useNavigate();

  // ── Session state ──────────────────────────────────────────────────────────
  const [phase, setPhase] = useState("loading"); // loading|quiz|finishing|done|error
  const [session, setSession] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerResult, setAnswerResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // ── Per-question answer input state ───────────────────────────────────────
  const [selectedKey, setSelectedKey] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [arranged, setArranged] = useState([]);
  const [available, setAvailable] = useState([]);

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
    return <div className={styles.loading}>{t("quiz.loading")}</div>;

  if (phase === "error")
    return <div className={styles.errorBox}>{t("quiz.errorLoad")}</div>;

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
                {t(SKILL_I18N_KEY[session.topic.skill] ?? session.topic.skill, session.topic.skill)}
              </h2>
              <p>{session.topic.level}</p>
            </div>
          </div>

          <div className={styles.progressWrap}>
            <div className={styles.progressMeta}>
              <span className={styles.progressLabel}>{t("quiz.doneProgressLabel")}</span>
              <span className={styles.progressCount}>
                {t("quiz.doneCorrectCount", { count: result.correct_count })}
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
              {t("quiz.doneScoreLabel", {
                correct: result.correct_count,
                total: result.total_questions,
              })}
            </div>
            <h2>{t("quiz.doneTitle")}</h2>
            <p>
              {t("quiz.doneSubtitle", { topic: result.topic_name })}
              {result.xp_gained > 0 && ` ${t("quiz.doneXp", { xp: result.xp_gained })}`}
            </p>
            <button
              className={styles.doneBtn}
              onClick={() => navigate("/dashboard")}
            >
              {t("quiz.btnBackDashboard")}
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
              {t(SKILL_I18N_KEY[session.topic.skill] ?? session.topic.skill, session.topic.skill)}
            </h2>
            <p>{t("quiz.sessionSubtitle", { level: session.topic.level })}</p>
          </div>
          <button
            className={styles.exitBtn}
            onClick={() => navigate("/dashboard")}
          >
            {t("quiz.btnExit")}
          </button>
        </div>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span className={styles.progressLabel}>
              {t("quiz.progressLabel", { current: currentIdx + 1, total: session.total_questions })}
            </span>
            <span className={styles.progressCount}>
              {t("quiz.progressCorrect", { count: correctCount })}
            </span>
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
          <div className={styles.soalTag}>{t("quiz.questionTag", { n: currentIdx + 1 })}</div>
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
                    key={label}
                    className={optionClass(optionValue)}
                    onClick={() => handleChoiceClick(optionValue)}
                  >
                    <span className={`${styles.optKey} ${optKeyClass(optionValue)}`}>
                      {label}
                    </span>
                    <span className={`${styles.optText} ${optTextClass(optionValue)}`}>
                      {optionValue}
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
                    ? answerResult.is_correct ? styles.fillCorrect : styles.fillWrong
                    : ""
                }`}
                type="text"
                placeholder={t("quiz.fillPlaceholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnswered || submitting}
                autoFocus
              />
              {isAnswered && !answerResult.is_correct && (
                <div className={styles.correctAnswerHint}>
                  {t("quiz.correctAnswerHint")}<strong>{answerResult.correct_answer}</strong>
                </div>
              )}
              {!isAnswered && (
                <button
                  className={styles.submitBtn}
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? t("quiz.btnSubmitting") : t("quiz.btnSubmit")}
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
                    {t("quiz.dragPlaceholder")}
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
                  {t("quiz.correctAnswerHint")}
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
                  {submitting ? t("quiz.btnSubmitting") : t("quiz.btnSubmit")}
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
                {answerResult.is_correct ? t("quiz.feedbackCorrect") : t("quiz.feedbackWrong")}
              </strong>
              {answerResult.is_correct
                ? answerResult.feedback_correct
                : answerResult.feedback_wrong}
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <div className={styles.bottomNav}>
          {isAnswered && answerResult.is_correct && answerResult.xp_gained > 0 ? (
            <div className={styles.xpEarned}>
              <span>{t("quiz.xpEarned", { xp: answerResult.xp_gained })}</span>
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
                ? t("quiz.btnSaving")
                : isLast
                  ? t("quiz.btnFinish")
                  : t("quiz.btnNext")}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
