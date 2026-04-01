import { useState, useEffect, useRef } from "react";

const EPREUVES = [
  { id: "e1", code: "E1", nom: "Culture générale et expression", coef: 3, type: "Écrite", duree: "3h" },
  { id: "e21", code: "E2.1", nom: "Compréhension écrite & expression écrite (LVE)", coef: 1.5, type: "Écrite", duree: "2h" },
  { id: "e22", code: "E2.2", nom: "Compréhension orale & production orale (LVE)", coef: 1.5, type: "Orale", duree: "20 min" },
  { id: "e3", code: "E3", nom: "Culture économique, juridique et managériale", coef: 3, type: "Écrite", duree: "4h" },
  { id: "e41", code: "E4.1", nom: "Développement de la relation client et vente conseil", coef: 3, type: "Orale/CCF", duree: "30 min" },
  { id: "e42", code: "E4.2", nom: "Animation, dynamisation de l'offre commerciale", coef: 3, type: "Orale/CCF", duree: "30 min" },
  { id: "e5", code: "E5", nom: "Gestion opérationnelle", coef: 3, type: "Écrite", duree: "3h" },
  { id: "e6", code: "E6", nom: "Management de l'équipe commerciale", coef: 3, type: "CCF/Écrite", duree: "2h30" },
];

const FACULTATIVES = [
  { id: "ef1", code: "EF1", nom: "Langue vivante étrangère 2" },
  { id: "ef2", code: "EF2", nom: "Parcours de professionnalisation à l'étranger" },
  { id: "ef3", code: "EF3", nom: "Entrepreneuriat" },
];

const TOTAL_COEF = EPREUVES.reduce((s, e) => s + e.coef, 0); // 21

function getMention(moyenne) {
  if (moyenne >= 16) return { label: "Très Bien", color: "#10b981", emoji: "🏆" };
  if (moyenne >= 14) return { label: "Bien", color: "#3b82f6", emoji: "🎓" };
  if (moyenne >= 12) return { label: "Assez Bien", color: "#8b5cf6", emoji: "👏" };
  if (moyenne >= 10) return { label: "Admis", color: "#f59e0b", emoji: "✅" };
  if (moyenne >= 8) return { label: "Rattrapage possible", color: "#f97316", emoji: "⚠️" };
  return { label: "Ajourné", color: "#ef4444", emoji: "❌" };
}

function GaugeRing({ value, max, size = 180, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);
  const mention = getMention(value);

  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mention.color} />
          <stop offset="100%" stopColor={mention.color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="url(#gaugeGrad)" strokeWidth={strokeWidth}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1), stroke 0.5s" }}
      />
      <text x={size / 2} y={size / 2 - 12} textAnchor="middle" fill="white" fontSize="36" fontWeight="800" fontFamily="'Outfit', sans-serif">
        {value.toFixed(2)}
      </text>
      <text x={size / 2} y={size / 2 + 14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="'Outfit', sans-serif">
        / 20
      </text>
      <text x={size / 2} y={size / 2 + 38} textAnchor="middle" fill={mention.color} fontSize="13" fontWeight="600" fontFamily="'Outfit', sans-serif">
        {mention.emoji} {mention.label}
      </text>
    </svg>
  );
}

function NoteSlider({ value, onChange, label, code, coef, type, duree }) {
  const barRef = useRef(null);
  const pct = (value / 20) * 100;
  const color =
    value >= 16 ? "#10b981" :
    value >= 14 ? "#3b82f6" :
    value >= 12 ? "#8b5cf6" :
    value >= 10 ? "#f59e0b" :
    value >= 8 ? "#f97316" : "#ef4444";

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      borderRadius: 14,
      padding: "16px 20px",
      border: "1px solid rgba(255,255,255,0.06)",
      transition: "border-color 0.3s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace",
          }}>{code}</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginTop: 2, lineHeight: 1.3 }}>{label}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 6,
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>Coef {coef}</span>
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 6,
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{type}</span>
            <span style={{
              fontSize: 10, padding: "2px 7px", borderRadius: 6,
              background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)",
              fontFamily: "'JetBrains Mono', monospace",
            }}>{duree}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 60 }}>
          <input
            type="number" min="0" max="20" step="0.5"
            value={value}
            onChange={e => {
              let v = parseFloat(e.target.value);
              if (isNaN(v)) v = 0;
              onChange(Math.max(0, Math.min(20, v)));
            }}
            style={{
              width: 56, padding: "6px 4px", borderRadius: 8, border: `2px solid ${color}`,
              background: "rgba(0,0,0,0.3)", color: "white", fontSize: 18, fontWeight: 800,
              textAlign: "center", fontFamily: "'Outfit', sans-serif", outline: "none",
            }}
          />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
            {(value * coef).toFixed(1)} pts
          </div>
        </div>
      </div>
      <div ref={barRef} style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", marginTop: 8, cursor: "pointer" }}
        onClick={e => {
          const rect = barRef.current.getBoundingClientRect();
          const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          onChange(Math.round(x * 40) / 2);
        }}
      >
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: 3,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: "width 0.3s ease, background 0.3s",
        }} />
      </div>
    </div>
  );
}

function FacultativeInput({ ep, value, onChange, active, onToggle }) {
  return (
    <div style={{
      background: active ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
      borderRadius: 12, padding: "12px 16px",
      border: `1px solid ${active ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.04)"}`,
      opacity: active ? 1 : 0.5,
      transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onToggle} style={{
          width: 20, height: 20, borderRadius: 6, border: `2px solid ${active ? "#8b5cf6" : "rgba(255,255,255,0.2)"}`,
          background: active ? "#8b5cf6" : "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, color: "white", fontWeight: 700,
          transition: "all 0.2s",
        }}>{active ? "✓" : ""}</button>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>{ep.code}</span>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginTop: 1 }}>{ep.nom}</div>
        </div>
        {active && (
          <input
            type="number" min="0" max="20" step="0.5" value={value}
            onChange={e => {
              let v = parseFloat(e.target.value);
              if (isNaN(v)) v = 0;
              onChange(Math.max(0, Math.min(20, v)));
            }}
            style={{
              width: 50, padding: "4px", borderRadius: 6, border: "1px solid rgba(139,92,246,0.4)",
              background: "rgba(0,0,0,0.3)", color: "white", fontSize: 16, fontWeight: 700,
              textAlign: "center", fontFamily: "'Outfit', sans-serif", outline: "none",
            }}
          />
        )}
      </div>
      {active && value > 10 && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#8b5cf6", fontFamily: "'JetBrains Mono', monospace" }}>
          +{(value - 10).toFixed(1)} points bonus
        </div>
      )}
    </div>
  );
}

export default function BTSMCOCalculateur() {
  const [notes, setNotes] = useState({
    e1: 10, e21: 10, e22: 10, e3: 10, e41: 10, e42: 10, e5: 10, e6: 10,
  });
  const [facNotes, setFacNotes] = useState({ ef1: 10, ef2: 10, ef3: 10 });
  const [facActive, setFacActive] = useState({ ef1: false, ef2: false, ef3: false });

  const totalPoints = EPREUVES.reduce((s, ep) => s + notes[ep.id] * ep.coef, 0);
  const bonusPoints = FACULTATIVES.reduce((s, ep) => {
    if (facActive[ep.id] && facNotes[ep.id] > 10) return s + (facNotes[ep.id] - 10);
    return s;
  }, 0);
  const totalAvecBonus = totalPoints + bonusPoints;
  const moyenne = totalAvecBonus / TOTAL_COEF;
  const mention = getMention(moyenne);
  const pointsManquants = Math.max(0, 10 * TOTAL_COEF - totalAvecBonus);

  const handleReset = () => {
    setNotes({ e1: 10, e21: 10, e22: 10, e3: 10, e41: 10, e42: 10, e5: 10, e6: 10 });
    setFacNotes({ ef1: 10, ef2: 10, ef3: 10 });
    setFacActive({ ef1: false, ef2: false, ef3: false });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "white",
      fontFamily: "'Outfit', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Background effects */}
      <div style={{
        position: "fixed", top: -200, right: -200, width: 600, height: 600,
        background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -200, left: -200, width: 500, height: 500,
        background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 60px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 20,
            background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)",
            fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
            color: "#a78bfa", marginBottom: 16,
          }}>
            Session 2026
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, letterSpacing: -1.5,
            margin: 0, lineHeight: 1.1,
            background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Calculateur BTS MCO
          </h1>
          <p style={{
            fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 10,
            maxWidth: 480, margin: "10px auto 0", lineHeight: 1.5,
          }}>
            Simule ta moyenne et découvre si tu décroches ton diplôme.
            <br />Total des coefficients : <strong style={{ color: "rgba(255,255,255,0.6)" }}>{TOTAL_COEF}</strong> · 
            Points nécessaires : <strong style={{ color: "rgba(255,255,255,0.6)" }}>{TOTAL_COEF * 10}</strong>
          </p>
        </div>

        {/* Gauge */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "32px 20px 24px", marginBottom: 32, textAlign: "center",
        }}>
          <GaugeRing value={moyenne} max={20} size={200} />
          <div style={{
            display: "flex", justifyContent: "center", gap: 32, marginTop: 20,
            flexWrap: "wrap",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>Points obtenus</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 2 }}>{totalAvecBonus.toFixed(1)}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}> / {TOTAL_COEF * 20}</span></div>
            </div>
            {bonusPoints > 0 && (
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>Bonus facultatifs</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6", marginTop: 2 }}>+{bonusPoints.toFixed(1)}</div>
              </div>
            )}
            {moyenne < 10 && (
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: 1 }}>Points manquants</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", marginTop: 2 }}>{pointsManquants.toFixed(1)}</div>
              </div>
            )}
          </div>
        </div>

        {/* Barème mentions */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 8, marginBottom: 32,
        }}>
          {[
            { label: "Ajourné", min: "< 8", color: "#ef4444" },
            { label: "Rattrapage", min: "8 - 9.99", color: "#f97316" },
            { label: "Admis", min: "10+", color: "#f59e0b" },
            { label: "Assez Bien", min: "12+", color: "#8b5cf6" },
            { label: "Bien", min: "14+", color: "#3b82f6" },
            { label: "Très Bien", min: "16+", color: "#10b981" },
          ].map(m => (
            <div key={m.label} style={{
              padding: "10px 12px", borderRadius: 10,
              background: moyenne >= parseFloat(m.min) || (m.label === "Ajourné" && moyenne < 8) || (m.label === "Rattrapage" && moyenne >= 8 && moyenne < 10)
                ? `${m.color}15` : "rgba(255,255,255,0.02)",
              border: `1px solid ${mention.label === m.label ? m.color + "40" : "rgba(255,255,255,0.04)"}`,
              textAlign: "center",
              transition: "all 0.3s",
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: m.color, opacity: mention.label === m.label ? 1 : 0.4 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{m.min}</div>
            </div>
          ))}
        </div>

        {/* Épreuves obligatoires */}
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.85)" }}>
            Épreuves obligatoires
          </h2>
          <button onClick={handleReset} style={{
            padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)",
            fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "white"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            ↺ Réinitialiser
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {EPREUVES.map(ep => (
            <NoteSlider
              key={ep.id}
              value={notes[ep.id]}
              onChange={v => setNotes(prev => ({ ...prev, [ep.id]: v }))}
              label={ep.nom}
              code={ep.code}
              coef={ep.coef}
              type={ep.type}
              duree={ep.duree}
            />
          ))}
        </div>

        {/* Épreuves facultatives */}
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: "rgba(255,255,255,0.85)" }}>
          Épreuves facultatives
        </h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 14px", lineHeight: 1.5 }}>
          Seuls les points au-dessus de 10/20 sont comptabilisés en bonus.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          {FACULTATIVES.map(ep => (
            <FacultativeInput
              key={ep.id}
              ep={ep}
              value={facNotes[ep.id]}
              onChange={v => setFacNotes(prev => ({ ...prev, [ep.id]: v }))}
              active={facActive[ep.id]}
              onToggle={() => setFacActive(prev => ({ ...prev, [ep.id]: !prev[ep.id] }))}
            />
          ))}
        </div>

        {/* Récap */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.06)",
          padding: 24,
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>
            Récapitulatif détaillé
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {EPREUVES.map(ep => {
              const pts = notes[ep.id] * ep.coef;
              return (
                <div key={ep.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", marginRight: 8 }}>{ep.code}</span>
                    {ep.nom}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: notes[ep.id] >= 10 ? "#10b981" : "#ef4444" }}>
                    {notes[ep.id].toFixed(1)} × {ep.coef} = {pts.toFixed(1)}
                  </span>
                </div>
              );
            })}
            {FACULTATIVES.filter(ep => facActive[ep.id] && facNotes[ep.id] > 10).map(ep => (
              <div key={ep.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: 13, color: "#8b5cf6" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, marginRight: 8 }}>{ep.code}</span>
                  {ep.nom} (bonus)
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: "#8b5cf6" }}>
                  +{(facNotes[ep.id] - 10).toFixed(1)}
                </span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0", borderTop: "2px solid rgba(255,255,255,0.08)", marginTop: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>TOTAL</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: mention.color }}>
                {totalAvecBonus.toFixed(1)} / {TOTAL_COEF * 20}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
          Données basées sur le référentiel officiel du BTS MCO (JO du 10/07/2024).
          <br />Total coefficients : {TOTAL_COEF} · Seuil d'admission : {TOTAL_COEF * 10} points (10/20 de moyenne).
          <br />Épreuves facultatives : seuls les points au-dessus de 10 sont ajoutés au total.
        </div>
      </div>
    </div>
  );
}
