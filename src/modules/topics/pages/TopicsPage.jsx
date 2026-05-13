import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../shared/components/Sidebar';
import { getTopics, getTopicDetail } from '../topicsService';
import styles from '../topics.module.css';

// ─── Konstanta ────────────────────────────────────────────────────────────────

const SKILL_LABELS = { kosakata: 'Kosakata', grammar: 'Grammar', menyimak: 'Menyimak' };

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

const FILTERS = [
  { key: 'semua',        label: 'Semua' },
  { key: 'kampus',       label: '🎓 Kampus' },
  { key: 'pasar',        label: '🛒 Pasar' },
  { key: 'transportasi', label: '🚌 Transportasi' },
  { key: 'kerja',        label: '💼 Tempat Kerja' },
  { key: 'lainnya',      label: '📍 Lainnya' },
];

const mulaiLabel = (pct) =>
  pct === 0 ? 'Mulai Skenario' : pct === 100 ? 'Ulangi Skenario' : 'Lanjutkan';

// ─── Halaman Daftar Topik ─────────────────────────────────────────────────────

export default function TopicsPage() {
  const navigate = useNavigate();

  const [topics, setTopics]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [search, setSearch]               = useState('');
  const [category, setCategory]           = useState('semua');
  const [selectedId, setSelectedId]       = useState(null);
  const [detail, setDetail]               = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    getTopics()
      .then((res) => setTopics(res.data.topics))
      .catch(() => setError('Gagal memuat topik. Silakan coba lagi.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Client-side filter ─────────────────────────────────────────────────────
  const filtered = topics.filter((t) => {
    const matchCat    = category === 'semua' || t.category === category;
    const q           = search.toLowerCase();
    const matchSearch = !q
      || t.name.toLowerCase().includes(q)
      || t.location.toLowerCase().includes(q)
      || t.description.toLowerCase().includes(q);
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

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) return <div className={styles.loading}>Memuat topik...</div>;
  if (error)   return <div className={styles.errorBox}>{error}</div>;

  const completedCount = topics.filter((t) => t.user_progress.percent === 100).length;
  const isOpen = !!selectedId;

  return (
    <div className={styles.root}>
      <Sidebar />

      <div className={styles.content}>
        {/* ── List panel ── */}
        <div className={`${styles.listPanel} ${isOpen ? styles.listPanelShrink : ''}`}>
          <div className={styles.topbar}>
            <div>
              <h2>Daftar Topik</h2>
              <p>{topics.length} skenario nyata · {completedCount} sudah diselesaikan</p>
            </div>
          </div>

          <div className={styles.searchRow}>
            <input
              className={styles.search}
              type="text"
              placeholder="Cari skenario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${category === f.key ? styles.filterBtnActive : ''}`}
                onClick={() => setCategory(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>Tidak ada topik ditemukan.</div>
          ) : (
            <div className={`${styles.grid} ${isOpen ? styles.gridOneCol : ''}`}>
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className={`${styles.topikCard} ${selectedId === t.id ? styles.topikCardSelected : ''}`}
                  onClick={() => handleCardClick(t.id)}
                >
                  <div className={styles.topikTop}>
                    <div className={styles.topikIcon} style={{ background: ICON_BG[t.category] ?? '#f0f0f0' }}>
                      {t.icon}
                    </div>
                    <span className={`${styles.levelBadge} ${LEVEL_CLASS[t.cefr_level] ?? ''}`}>
                      {t.cefr_level}
                    </span>
                  </div>
                  <div className={styles.topikLokasi}>📍 {t.location}</div>
                  <div className={styles.topikName}>{t.name}</div>
                  <div className={styles.topikDesc}>{t.description}</div>
                  <div className={styles.skillTags}>
                    {t.skills.map((s) => (
                      <span key={s} className={styles.skillTag}>{SKILL_LABELS[s] ?? s}</span>
                    ))}
                  </div>
                  <div className={styles.topikMeta}>
                    <span className={styles.metaItem}>📝 {t.total_questions} soal</span>
                    <span className={styles.metaItem}>⏱ {t.estimated_minutes} menit</span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div className={styles.progressFill} style={{ width: `${t.user_progress.percent}%` }} />
                  </div>
                  <div className={styles.progressLabel}>
                    {t.user_progress.percent === 0
                      ? 'Belum dimulai'
                      : t.user_progress.percent === 100
                        ? 'Selesai'
                        : `${t.user_progress.percent}% selesai`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        <div className={`${styles.detailPanel} ${isOpen ? styles.detailPanelOpen : ''}`}>
          <div className={styles.detailInner}>
            {detailLoading && <div className={styles.detailLoading}>Memuat detail...</div>}

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
                    <div className={styles.detailStatKey}>Jumlah soal</div>
                  </div>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>{detail.estimated_minutes} mnt</div>
                    <div className={styles.detailStatKey}>Estimasi waktu</div>
                  </div>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>{detail.user_progress.percent}%</div>
                    <div className={styles.detailStatKey}>Progress</div>
                  </div>
                  <div className={styles.detailStat}>
                    <div className={styles.detailStatVal}>{detail.cefr_level}</div>
                    <div className={styles.detailStatKey}>Level CEFR</div>
                  </div>
                </div>

                <div className={styles.detailSection}>CONTOH PERCAKAPAN</div>
                <div className={styles.contohBox}>
                  <p>{detail.example_dialogue}</p>
                  <span>{detail.example_context}</span>
                </div>

                <div className={styles.detailSection}>YANG AKAN DIPELAJARI</div>
                <div className={styles.subtopikList}>
                  {detail.subtopics.map((s, i) => (
                    <div key={i} className={styles.subtopikItem}>
                      <div className={styles.subtopikDot} />
                      {s}
                    </div>
                  ))}
                </div>

                <div className={styles.detailSection}>SKILL YANG DILATIH</div>
                <div className={styles.skillRow}>
                  {detail.skills.map((s) => (
                    <span key={s} className={`${styles.skillChip} ${SKILL_CHIP_CLASS[s] ?? ''}`}>
                      {SKILL_LABELS[s] ?? s}
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
