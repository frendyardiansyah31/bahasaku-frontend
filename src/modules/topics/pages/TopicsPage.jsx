import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../../../shared/components/Sidebar';
import { getTopics, getTopicDetail } from '../topicsService';
import styles from '../topics.module.css';

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_I18N_KEY = {
  kosakata: 'dashboard.skillKosakata',
  grammar:  'dashboard.skillGrammar',
  menyimak: 'dashboard.skillMenyimak',
};

const SKILL_CHIP_CLASS = {
  kosakata: styles.chipKosakata,
  grammar:  styles.chipGrammar,
  menyimak: styles.chipMenyimak,
};

const LEVEL_CLASS = {
  A1: styles.levelA, A2: styles.levelA,
  B1: styles.levelB, B2: styles.levelB,
  C1: styles.levelC, C2: styles.levelC,
};

const ICON_BG = {
  kampus: '#eef4f7', pasar: '#eaf7f0',
  transportasi: '#fef3e8', kerja: '#f3eef7', lainnya: '#f7f0ee',
};

const FILTER_KEYS = [
  { key: 'semua',        i18nKey: 'topics.filterAll' },
  { key: 'kampus',       i18nKey: 'topics.filterKampus' },
  { key: 'pasar',        i18nKey: 'topics.filterPasar' },
  { key: 'transportasi', i18nKey: 'topics.filterTransportasi' },
  { key: 'kerja',        i18nKey: 'topics.filterKerja' },
  { key: 'lainnya',      i18nKey: 'topics.filterLainnya' },
];

// ─── Halaman Daftar Topik ─────────────────────────────────────────────────────

export default function TopicsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [topics, setTopics]               = useState([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [hasError, setHasError]           = useState(false);
  const [search, setSearch]               = useState('');
  const [category, setCategory]           = useState('semua');
  const [selectedId, setSelectedId]       = useState(null);
  const [detail, setDetail]               = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    getTopics()
      .then((res) => setTopics(res.data.topics))
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Client-side filter ─────────────────────────────────────────────────────
  const filtered = topics.filter((topic) => {
    const matchCat    = category === 'semua' || topic.category === category;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || topic.name.toLowerCase().includes(q)
      || topic.location.toLowerCase().includes(q)
      || topic.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // ── Detail panel ───────────────────────────────────────────────────────────
  const handleCardClick = (id) => {
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    getTopicDetail(id)
      .then((res) => setDetail(res.data))
      .catch(() => {})
      .finally(() => setDetailLoading(false));
  };

  const handleCloseDetail = () => {
    setSelectedId(null);
    setDetail(null);
  };

  const progressLabel = (pct) => {
    if (pct === 0)   return t('topics.progressNotStarted');
    if (pct === 100) return t('topics.progressDone');
    return t('topics.progressPct', { pct });
  };

  const mulaiLabel = (pct) => {
    if (pct === 0)   return t('topics.btnStart');
    if (pct === 100) return t('topics.btnRepeat');
    return t('topics.btnContinue');
  };

  // ── Render states ──────────────────────────────────────────────────────────
  if (isLoading) return <div className={styles.loading}>{t('topics.loading')}</div>;
  if (hasError)  return <div className={styles.errorBox}>{t('topics.errorLoad')}</div>;

  const completedCount = topics.filter((topic) => topic.user_progress.percent === 100).length;
  const isOpen = !!selectedId;

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.content}>
        {/* ── List panel ── */}
        <div className={`${styles.listPanel} ${isOpen ? styles.listPanelShrink : ''}`}>
          <div className={styles.topbar}>
            <div>
              <h2>{t('topics.pageTitle')}</h2>
              <p>{t('topics.subtitle', { total: topics.length, completed: completedCount })}</p>
            </div>
          </div>

          <div className={styles.searchRow}>
            <input
              className={styles.search}
              type="text"
              placeholder={t('topics.searchPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {FILTER_KEYS.map((f) => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${category === f.key ? styles.filterBtnActive : ''}`}
                onClick={() => setCategory(f.key)}
              >
                {t(f.i18nKey)}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>{t('topics.emptyState')}</div>
          ) : (
            <div className={`${styles.grid} ${isOpen ? styles.gridOneCol : ''}`}>
              {filtered.map((topic) => (
                <div
                  key={topic.id}
                  className={`${styles.topikCard} ${selectedId === topic.id ? styles.topikCardSelected : ''}`}
                  onClick={() => handleCardClick(topic.id)}
                >
                  <div className={styles.topikTop}>
                    <div className={styles.topikIcon} style={{ background: ICON_BG[topic.category] ?? '#f0f0f0' }}>
                      {topic.icon}
                    </div>
                    <span className={`${styles.levelBadge} ${LEVEL_CLASS[topic.cefr_level] ?? ''}`}>
                      {topic.cefr_level}
                    </span>
                  </div>
                  <div className={styles.topikLokasi}>📍 {topic.location}</div>
                  <div className={styles.topikName}>{topic.name}</div>
                  <div className={styles.topikDesc}>{topic.description}</div>
                  <div className={styles.skillTags}>
                    {topic.skills.map((s) => (
                      <span key={s} className={styles.skillTag}>
                        {t(SKILL_I18N_KEY[s] ?? s, s)}
                      </span>
                    ))}
                  </div>
                  <div className={styles.topikMeta}>
                    <span className={styles.metaItem}>{t('topics.cardQuestions', { n: topic.total_questions })}</span>
                    <span className={styles.metaItem}>{t('topics.cardMinutes', { n: topic.estimated_minutes })}</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${topic.user_progress.percent}%` }} />
                  </div>
                  <div className={styles.progressLabel}>
                    {progressLabel(topic.user_progress.percent)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className={`${styles.detailPanel} ${isOpen ? styles.detailPanelOpen : ''}`}>
          <div className={styles.detailInner}>
            {detailLoading && (
              <div className={styles.detailLoading}>{t('topics.detailLoading')}</div>
            )}

            {!detailLoading && detail && (
              <>
                <div className={styles.detailClose}>
                  <button className={styles.closeBtn} onClick={handleCloseDetail}>✕</button>
                </div>

                <div
                  className={styles.detailIconBig}
                  style={{ background: ICON_BG[detail.category] ?? '#f0f0f0' }}
                >
                  {detail.icon}
                </div>
                <div className={styles.detailLokasi}>📍 {detail.location}</div>
                <div className={styles.detailName}>{detail.name}</div>
                <div className={styles.detailDesc}>{detail.description}</div>

                <div className={styles.detailStats}>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>{detail.total_questions}</div>
                    <div className={styles.detailStatKey}>{t('topics.detailStatQuestions')}</div>
                  </div>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>
                      {t('topics.detailStatMinutes', { n: detail.estimated_minutes })}
                    </div>
                    <div className={styles.detailStatKey}>{t('topics.detailStatTime')}</div>
                  </div>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>{detail.user_progress.percent}%</div>
                    <div className={styles.detailStatKey}>{t('topics.detailStatProgress')}</div>
                  </div>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>{detail.cefr_level}</div>
                    <div className={styles.detailStatKey}>{t('topics.detailStatLevel')}</div>
                  </div>
                </div>

                <div className={styles.detailSection}>{t('topics.sectionDialogue')}</div>
                <div className={styles.contohBox}>
                  <p>{detail.example_dialogue}</p>
                  <span>{detail.example_context}</span>
                </div>

                <div className={styles.detailSection}>{t('topics.sectionLearn')}</div>
                <div className={styles.subtopikList}>
                  {detail.subtopics.map((s, i) => (
                    <div key={i} className={styles.subtopikItem}>
                      <div className={styles.subtopikDot} />
                      {s}
                    </div>
                  ))}
                </div>

                <div className={styles.detailSection}>{t('topics.sectionSkills')}</div>
                <div className={styles.skillRow}>
                  {detail.skills.map((s) => (
                    <span key={s} className={`${styles.skillChip} ${SKILL_CHIP_CLASS[s] ?? ''}`}>
                      {t(SKILL_I18N_KEY[s] ?? s, s)}
                    </span>
                  ))}
                </div>

                <button
                  className={styles.mulaiBtn}
                  onClick={() => navigate(`/quiz/${detail.id}`)}
                >
                  {mulaiLabel(detail.user_progress.percent)} →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
