import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useAuthStore from "../../auth/authStore";
import { getDashboard } from "../dashboardService";
import styles from "../dashboard.module.css";

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_LABELS = {
  kosakata: "Kosakata",
  grammar: "Grammar",
  menyimak: "Menyimak",
};

const SKILL_COLOR = {
  kosakata: styles.skillKosakata,
  grammar: styles.skillGrammar,
  menyimak: styles.skillMenyimak,
};

const TOPIC_BG = {
  kosakata: styles.topicBgKosakata,
  grammar: styles.topicBgGrammar,
  menyimak: styles.topicBgMenyimak,
};

const TOPIC_ICON = { kosakata: "📖", grammar: "✍️", menyimak: "🎧" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

const skillSubText = (s) =>
  s.delta_this_week !== 0
    ? `${s.delta_this_week > 0 ? "+" : ""}${s.delta_this_week} minggu ini`
    : s.status;

// ─── Nav item definition ──────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor" />
        <rect
          x="9"
          y="1"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.5"
        />
        <rect
          x="1"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.5"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          rx="1.5"
          fill="currentColor"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    to: "/topics",
    label: "Daftar Topik",
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 3h12M2 8h8M2 13h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/history",
    label: "Riwayat Sesi",
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 5v3.5l2 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/progress",
    label: "Progress",
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <path
          d="M2 12V4l5 5 3-4 4 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Profil",
    icon: (
      <svg className={styles.navIcon} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 14c0-3 2.7-5 6-5s6 2 6 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

// ─── Halaman Dashboard ────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const logoutUser = useAuthStore((s) => s.logoutUser);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setError("Gagal memuat dashboard. Silakan coba lagi."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className={styles.loading}>Memuat...</div>;
  if (error) return <div className={styles.errorBox}>{error}</div>;

  const {
    greeting,
    level,
    streak,
    skills,
    recommended_topics,
    activity_summary,
  } = data;
  const xpPct = Math.min(
    100,
    Math.round((level.total_xp / level.next_level_xp) * 100),
  );
  const today = new Date().toISOString().slice(0, 10);

  const dotClass = (day) => {
    if (!day.is_active) return styles.sdayEmpty;
    return day.date === today
      ? `${styles.sdayDot} ${styles.sdayToday}`
      : `${styles.sdayDot} ${styles.sdayDone}`;
  };

  return (
    <div className={styles.root}>
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <div className={styles.logo}>B</div>
          <span className={styles.brandName}>BahasaKu</span>
        </div>

        <nav>
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem}${isActive ? ` ${styles.navActive}` : ""}`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userRow}>
            <div className={styles.avatar}>{getInitials(user?.name)}</div>
            <div>
              <div className={styles.userName}>{user?.name}</div>
              <div className={styles.userLevel}>
                Level {level.cefr} · {level.label}
              </div>
            </div>
          </div>
          <button className={styles.logoutBtn} onClick={() => logoutUser()}>
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className={styles.main}>
        {/* Topbar */}
        <div className={styles.topbar}>
          <div className={styles.greeting}>
            <h1>
              {getGreeting()}, {greeting.name}! 👋
            </h1>
            <p>
              {greeting.date} · Kamu punya {greeting.new_topics_count} topik
              baru hari ini
            </p>
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
            <div className={styles.xpLevel}>
              Level {level.cefr} — {level.label}
            </div>
            <div className={styles.xpSub}>
              {level.xp_remaining} XP menuju level berikutnya
            </div>
            <div className={styles.xpBarWrap}>
              <div
                className={styles.xpBarFill}
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className={styles.xpBarLabel}>
              <span>{level.total_xp.toLocaleString("id-ID")} XP</span>
              <span>{level.next_level_xp.toLocaleString("id-ID")} XP</span>
            </div>
          </div>
          <div className={styles.xpRight}>
            <div className={styles.xpCircle}>
              <div className={styles.xpNum}>
                {level.total_xp.toLocaleString("id-ID")}
              </div>
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
                <div
                  className={`${styles.statBar} ${SKILL_COLOR[s.skill]}`}
                  style={{ width: `${s.score}%` }}
                />
              </div>
              <div className={styles.statSub}>{skillSubText(s)}</div>
            </div>
          ))}
        </div>

        {/* Streak Card */}
        <div className={styles.streakCard}>
          <div className={styles.streakCardHeader}>
            <span className={styles.streakCardTitle}>🔥 Streak Harian</span>
            <span className={styles.streakCardSub}>
              {streak.count} hari berturut-turut
            </span>
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
          {/* Recommended Topics */}
          <div className={styles.rekomCard}>
            <div className={styles.rekomTitle}>
              📚 Rekomendasi Topik Hari Ini
            </div>
            {recommended_topics.map((topic) => (
              <div key={topic.id} className={styles.rekomItem}>
                <div className={`${styles.rekomIcon} ${TOPIC_BG[topic.skill]}`}>
                  {TOPIC_ICON[topic.skill]}
                </div>
                <div className={styles.rekomInfo}>
                  <div className={styles.rekomName}>{topic.name}</div>
                  <div className={styles.rekomMeta}>
                    {SKILL_LABELS[topic.skill]} · {topic.total_questions} soal ·
                    ~{topic.estimated_minutes} menit
                  </div>
                </div>
                <span className={styles.rekomArrow}>›</span>
              </div>
            ))}
          </div>

          {/* Activity Summary */}
          <div className={styles.quickCard}>
            <div className={styles.quickTitle}>📊 Ringkasan Aktivitas</div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Sesi selesai minggu ini</span>
              <span className={styles.quickVal}>
                {activity_summary.sessions_this_week} sesi
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Total soal dikerjakan</span>
              <span className={styles.quickVal}>
                {activity_summary.total_questions_answered} soal
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>Rata-rata skor</span>
              <span className={styles.quickVal}>
                {activity_summary.average_score}%
              </span>
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
                {SKILL_LABELS[activity_summary.strongest_skill] ??
                  activity_summary.strongest_skill}
              </span>
            </div>
            <div className={styles.quickItem}>
              <span className={styles.quickKey}>XP hari ini</span>
              <span className={styles.quickVal}>
                +{activity_summary.xp_today} XP
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
