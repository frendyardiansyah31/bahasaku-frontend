import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../../shared/components/Sidebar';
import { getDashboard } from '../dashboardService';
import styles from '../dashboard.module.css';

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_I18N_KEY = {
  kosakata: 'skillKosakata',
  grammar:  'skillGrammar',
  menyimak: 'skillMenyimak',
};

const SKILL_COLOR = {
  kosakata: styles.skillKosakata,
  grammar:  styles.skillGrammar,
  menyimak: styles.skillMenyimak,
};

const TOPIC_BG = {
  kosakata: styles.topicBgKosakata,
  grammar:  styles.topicBgGrammar,
  menyimak: styles.topicBgMenyimak,
};

const TOPIC_ICON = { kosakata: '📖', grammar: '✍️', menyimak: '🎧' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = (t) => {
  const h = new Date().getHours();
  if (h < 12) return t('dashboard.greetingMorning');
  if (h < 15) return t('dashboard.greetingAfternoon');
  if (h < 18) return t('dashboard.greetingEvening');
  return t('dashboard.greetingNight');
};

const skillSubText = (s, t) =>
  s.delta_this_week !== 0
    ? `${s.delta_this_week > 0 ? '+' : ''}${s.delta_this_week} ${t('dashboard.skillThisWeek')}`
    : s.status;

// ─── Halaman Dashboard ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className={styles.loading}>{t('dashboard.loading')}</div>;
  if (hasError)  return <div className={styles.errorBox}>{t('dashboard.errorLoad')}</div>;

  const { greeting, level, streak, skills, recommended_topics, activity_summary } = data;
  const xpPct  = Math.min(100, Math.round((level.total_xp / level.next_level_xp) * 100));
  const today  = new Date().toISOString().slice(0, 10);
  const numLocale = i18n.language === 'en' ? 'en-US' : 'id-ID';

  const dotClass = (day) => {
    if (!day.is_active) return styles.sdayEmpty;
    return day.date === today
      ? `${styles.sdayDot} ${styles.sdayToday}`
      : `${styles.sdayDot} ${styles.sdayDone}`;
  };

  return (
    <div className={styles.root}>
      <Sidebar levelText={`${level.cefr} · ${level.label}`} />

      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div className={styles.greeting}>
            <h1>{getGreeting(t)}, {greeting.name}! 👋</h1>
            <p>{t('dashboard.greetingNewTopics', { date: greeting.date, count: greeting.new_topics_count })}</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.streakPill}>
              <span className={styles.streakFire}>🔥</span>
              <span>{t('dashboard.streakPill', { count: streak.count })}</span>
            </div>
          </div>
        </div>

        {/* XP Card */}
        <div className={styles.xpCard}>
          <div className={styles.xpLeft}>
            <div className={styles.xpLabel}>{t('dashboard.xpLabel')}</div>
            <div className={styles.xpLevel}>
              {t('dashboard.xpLevel', { cefr: level.cefr, label: level.label })}
            </div>
            <div className={styles.xpSub}>
              {t('dashboard.xpRemaining', { xp: level.xp_remaining.toLocaleString(numLocale) })}
            </div>
            <div className={styles.xpBarWrap}>
              <div className={styles.xpBarFill} style={{ width: `${xpPct}%` }} />
            </div>
            <div className={styles.xpBarLabel}>
              <span>{level.total_xp.toLocaleString(numLocale)} XP</span>
              <span>{level.next_level_xp.toLocaleString(numLocale)} XP</span>
            </div>
          </div>
          <div className={styles.xpRight}>
            <div className={styles.xpCircle}>
              <div className={styles.xpNum}>{level.total_xp.toLocaleString(numLocale)}</div>
              <div className={styles.xpXp}>{t('dashboard.xpTotalLabel')}</div>
            </div>
          </div>
        </div>

        {/* Skill Cards */}
        <div className={styles.statsGrid}>
          {skills.map((s) => (
            <div key={s.skill} className={styles.statCard}>
              <div className={styles.statCardLabel}>
                <span className={`${styles.statDot} ${SKILL_COLOR[s.skill]}`} />
                {t(`dashboard.${SKILL_I18N_KEY[s.skill]}`, s.skill)}
              </div>
              <div className={styles.statScore}>{s.score}</div>
              <div className={styles.statBarWrap}>
                <div className={`${styles.statBar} ${SKILL_COLOR[s.skill]}`} style={{ width: `${s.score}%` }} />
              </div>
              <div className={styles.statSub}>{skillSubText(s, t)}</div>
            </div>
          ))}
        </div>

        {/* Streak Card */}
        <div className={styles.streakCard}>
          <div className={styles.streakCardHeader}>
            <span className={styles.streakCardTitle}>{t('dashboard.streakTitle')}</span>
            <span className={styles.streakCardSub}>
              {t('dashboard.streakSub', { count: streak.count })}
            </span>
          </div>
          <div className={styles.streakRow}>
            {streak.days.map((day) => (
              <div key={day.date} className={styles.sday}>
                <div className={styles.sdayLabel}>
                  {new Date(day.date).toLocaleDateString(numLocale, { weekday: 'short' })}
                </div>
                <div className={dotClass(day)}>
                  {day.is_active && <span className={styles.check}>✓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 2-col */}
        <div className={styles.bottomGrid}>
          <div className={styles.rekomCard}>
            <div className={styles.rekomTitle}>{t('dashboard.rekomTitle')}</div>
            {recommended_topics.map((topic) => (
              <div key={topic.id} className={styles.rekomItem}>
                <div className={`${styles.rekomIcon} ${TOPIC_BG[topic.skill]}`}>
                  {TOPIC_ICON[topic.skill]}
                </div>
                <div className={styles.rekomInfo}>
                  <div className={styles.rekomName}>{topic.name}</div>
                  <div className={styles.rekomMeta}>
                    {t('dashboard.rekomMeta', {
                      skill: t(`dashboard.${SKILL_I18N_KEY[topic.skill]}`, topic.skill),
                      questions: topic.total_questions,
                      minutes: topic.estimated_minutes,
                    })}
                  </div>
                </div>
                <span className={styles.rekomArrow}>›</span>
              </div>
            ))}
          </div>

          <div className={styles.quickCard}>
            <div className={styles.quickTitle}>{t('dashboard.activityTitle')}</div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>{t('dashboard.activitySessionsKey')}</span>
              <span className={styles.quickVal}>
                {t('dashboard.activitySessionsVal', { count: activity_summary.sessions_this_week })}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>{t('dashboard.activityQuestionsKey')}</span>
              <span className={styles.quickVal}>
                {t('dashboard.activityQuestionsVal', { count: activity_summary.total_questions_answered })}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>{t('dashboard.activityAvgScore')}</span>
              <span className={styles.quickVal}>{activity_summary.average_score}%</span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>{t('dashboard.activityCefrKey')}</span>
              <span className={`${styles.badge} ${styles.badgeBlue}`}>
                {activity_summary.cefr_level} {activity_summary.cefr_label}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>{t('dashboard.activityStrongestKey')}</span>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>
                {t(`dashboard.${SKILL_I18N_KEY[activity_summary.strongest_skill]}`, activity_summary.strongest_skill)}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>{t('dashboard.activityXpKey')}</span>
              <span className={styles.quickVal}>
                {t('dashboard.activityXpVal', { xp: activity_summary.xp_today })}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
