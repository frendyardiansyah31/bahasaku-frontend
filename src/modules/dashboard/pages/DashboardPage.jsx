import { useState, useEffect } from 'react';
import Sidebar from '../../../shared/components/Sidebar';
import { getDashboard } from '../dashboardService';
import styles from '../dashboard.module.css';

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_LABELS = { kosakata: 'Kosakata', grammar: 'Grammar', menyimak: 'Menyimak' };

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

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
};

const skillSubText = (s) =>
  s.delta_this_week !== 0
    ? `${s.delta_this_week > 0 ? '+' : ''}${s.delta_this_week} minggu ini`
    : s.status;

// ─── Halaman Dashboard ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError('Gagal memuat dashboard. Silakan coba lagi.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className={styles.loading}>Memuat...</div>;
  if (error)     return <div className={styles.errorBox}>{error}</div>;

  const { greeting, level, streak, skills, recommended_topics, activity_summary } = data;
  const xpPct  = Math.min(100, Math.round((level.total_xp / level.next_level_xp) * 100));
  const today  = new Date().toISOString().slice(0, 10);

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
            <h1>{getGreeting()}, {greeting.name}! 👋</h1>
            <p>{greeting.date} · Kamu punya {greeting.new_topics_count} topik baru hari ini</p>
          </div>
          <div className={styles.topbarRight}>
            <div className={styles.streakPill}>
              <span className={styles.streakFire}>🔥</span>
              <span>{streak.count} Hari Streak</span>
            </div>
          </div>
        </div>

        {/* XP Card */}
        <div className={styles.xpCard}>
          <div className={styles.xpLeft}>
            <div className={styles.xpLabel}>LEVEL & XP</div>
            <div className={styles.xpLevel}>Level {level.cefr} — {level.label}</div>
            <div className={styles.xpSub}>{level.xp_remaining} XP menuju level berikutnya</div>
            <div className={styles.xpBarWrap}>
              <div className={styles.xpBarFill} style={{ width: `${xpPct}%` }} />
            </div>
            <div className={styles.xpBarLabel}>
              <span>{level.total_xp.toLocaleString('id-ID')} XP</span>
              <span>{level.next_level_xp.toLocaleString('id-ID')} XP</span>
            </div>
          </div>
          <div className={styles.xpRight}>
            <div className={styles.xpCircle}>
              <div className={styles.xpNum}>{level.total_xp.toLocaleString('id-ID')}</div>
              <div className={styles.xpXp}>total XP</div>
            </div>
          </div>
        </div>

        {/* Skill Cards */}
        <div className={styles.statsGrid}>
          {skills.map((s) => (
            <div key={s.skill} className={styles.statCard}>
              <div className={styles.statCardLabel}>
                <span className={`${styles.statDot} ${SKILL_COLOR[s.skill]}`} />
                {SKILL_LABELS[s.skill]}
              </div>
              <div className={styles.statScore}>{s.score}</div>
              <div className={styles.statBarWrap}>
                <div className={`${styles.statBar} ${SKILL_COLOR[s.skill]}`} style={{ width: `${s.score}%` }} />
              </div>
              <div className={styles.statSub}>{skillSubText(s)}</div>
            </div>
          ))}
        </div>

        {/* Streak Card */}
        <div className={styles.streakCard}>
          <div className={styles.streakCardHeader}>
            <span className={styles.streakCardTitle}>🔥 Streak Harian</span>
            <span className={styles.streakCardSub}>{streak.count} hari berturut-turut</span>
          </div>
          <div className={styles.streakRow}>
            {streak.days.map((day) => (
              <div key={day.date} className={styles.sday}>
                <div className={styles.sdayLabel}>{day.day}</div>
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
            <div className={styles.rekomTitle}>📚 Rekomendasi Topik Hari Ini</div>
            {recommended_topics.map((topic) => (
              <div key={topic.id} className={styles.rekomItem}>
                <div className={`${styles.rekomIcon} ${TOPIC_BG[topic.skill]}`}>
                  {TOPIC_ICON[topic.skill]}
                </div>
                <div className={styles.rekomInfo}>
                  <div className={styles.rekomName}>{topic.name}</div>
                  <div className={styles.rekomMeta}>
                    {SKILL_LABELS[topic.skill]} · {topic.total_questions} soal · ~{topic.estimated_minutes} menit
                  </div>
                </div>
                <span className={styles.rekomArrow}>›</span>
              </div>
            ))}
          </div>

          <div className={styles.quickCard}>
            <div className={styles.quickTitle}>📊 Ringkasan Aktivitas</div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Sesi selesai minggu ini</span>
              <span className={styles.quickVal}>{activity_summary.sessions_this_week} sesi</span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Total soal dikerjakan</span>
              <span className={styles.quickVal}>{activity_summary.total_questions_answered} soal</span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Rata-rata skor</span>
              <span className={styles.quickVal}>{activity_summary.average_score}%</span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Level CEFR saat ini</span>
              <span className={`${styles.badge} ${styles.badgeBlue}`}>
                {activity_summary.cefr_level} {activity_summary.cefr_label}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Skill terkuat</span>
              <span className={`${styles.badge} ${styles.badgeGreen}`}>
                {SKILL_LABELS[activity_summary.strongest_skill] ?? activity_summary.strongest_skill}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>XP hari ini</span>
              <span className={styles.quickVal}>+{activity_summary.xp_today} XP</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
