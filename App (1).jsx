import { useState } from "react";

var EPREUVES = [
  { id: "e1", code: "E1", nom: "Culture générale et expression", coef: 3, type: "Écrite", duree: "3h" },
  { id: "e21", code: "E2.1", nom: "Compréhension écrite et expression écrite (LVE)", coef: 1.5, type: "Écrite", duree: "2h" },
  { id: "e22", code: "E2.2", nom: "Compréhension orale et production orale (LVE)", coef: 1.5, type: "Orale", duree: "20 min" },
  { id: "e3", code: "E3", nom: "Culture économique, juridique et managériale", coef: 3, type: "Écrite", duree: "4h" },
  { id: "e41", code: "E4.1", nom: "Développement de la relation client et vente conseil", coef: 3, type: "Orale/CCF", duree: "30 min" },
  { id: "e42", code: "E4.2", nom: "Animation, dynamisation de l offre commerciale", coef: 3, type: "Orale/CCF", duree: "30 min" },
  { id: "e5", code: "E5", nom: "Gestion opérationnelle", coef: 3, type: "Écrite", duree: "3h" },
  { id: "e6", code: "E6", nom: "Management de l équipe commerciale", coef: 3, type: "CCF/Écrite", duree: "2h30" },
];

var FACULTATIVES = [
  { id: "ef1", code: "EF1", nom: "Langue vivante étrangère 2" },
  { id: "ef2", code: "EF2", nom: "Parcours de professionnalisation à l étranger" },
  { id: "ef3", code: "EF3", nom: "Entrepreneuriat" },
];

var TOTAL_COEF = 21;

function getMention(moyenne) {
  if (moyenne >= 16) return { label: "Très Bien", color: "#10b981", emoji: "\u{1F3C6}" };
  if (moyenne >= 14) return { label: "Bien", color: "#3b82f6", emoji: "\u{1F393}" };
  if (moyenne >= 12) return { label: "Assez Bien", color: "#8b5cf6", emoji: "\u{1F44F}" };
  if (moyenne >= 10) return { label: "Admis", color: "#f59e0b", emoji: "\u2705" };
  if (moyenne >= 8) return { label: "Rattrapage", color: "#f97316", emoji: "\u26A0\uFE0F" };
  return { label: "Ajourné", color: "#ef4444", emoji: "\u274C" };
}

function getColor(value) {
  if (value >= 16) return "#10b981";
  if (value >= 14) return "#3b82f6";
  if (value >= 12) return "#8b5cf6";
  if (value >= 10) return "#f59e0b";
  if (value >= 8) return "#f97316";
  return "#ef4444";
}

function GaugeRing(props) {
  var value = props.value;
  var size = 200;
  var sw = 14;
  var radius = (size - sw) / 2;
  var circ = 2 * Math.PI * radius;
  var progress = Math.min(value / 20, 1);
  var offset = circ * (1 - progress);
  var mention = getMention(value);
  var rot = "rotate(-90 " + (size / 2) + " " + (size / 2) + ")";

  return (
    <svg width={size} height={size} style={{ display: "block", margin: "0 auto" }}>
      <defs>
        <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={mention.color} />
          <stop offset="100%" stopColor={mention.color} stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="url(#gg)" strokeWidth={sw}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform={rot}
        style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.5s" }} />
      <text x={size/2} y={size/2 - 12} textAnchor="middle" fill="white" fontSize="36" fontWeight="800" fontFamily="Outfit, sans-serif">{value.toFixed(2)}</text>
      <text x={size/2} y={size/2 + 14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="12" fontFamily="Outfit, sans-serif">/ 20</text>
      <text x={size/2} y={size/2 + 38} textAnchor="middle" fill={mention.color} fontSize="13" fontWeight="600" fontFamily="Outfit, sans-serif">{mention.emoji + " " + mention.label}</text>
    </svg>
  );
}

function NoteSlider(props) {
  var value = props.value;
  var onChange = props.onChange;
  var pct = (value / 20) * 100;
  var color = getColor(value);

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{props.code}</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.9)", marginTop: 2, lineHeight: 1.3 }}>{props.label}</div>
          <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>Coef {props.coef}</span>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{props.type}</span>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{props.duree}</span>
          </div>
        </div>
        <div style={{ textAlign: "right", minWidth: 60, marginLeft: 12 }}>
          <input type="number" min="0" max="20" step="0.5" value={value}
            onChange={function(e) { var v = parseFloat(e.target.value); if (isNaN(v)) v = 0; onChange(Math.max(0, Math.min(20, v))); }}
            style={{ width: 56, padding: "6px 4px", borderRadius: 8, border: "2px solid " + color, background: "rgba(0,0,0,0.3)", color: "white", fontSize: 18, fontWeight: 800, textAlign: "center", fontFamily: "Outfit, sans-serif", outline: "none" }}
          />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2, fontFamily: "monospace" }}>{(value * props.coef).toFixed(1)} pts</div>
        </div>
      </div>
      <div onClick={function(e) { var rect = e.currentTarget.getBoundingClientRect(); var x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)); onChange(Math.round(x * 40) / 2); }}
        style={{ position: "relative", height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", marginTop: 8, cursor: "pointer" }}>
        <div style={{ width: pct + "%", height: "100%", borderRadius: 3, background: "linear-gradient(90deg, " + color + "88, " + color + ")", transition: "width 0.3s ease" }} />
      </div>
    </div>
  );
}

function FacInput(props) {
  var ep = props.ep;
  var active = props.active;
  return (
    <div style={{ background: active ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 16px", border: "1px solid " + (active ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.04)"), opacity: active ? 1 : 0.5, transition: "all 0.3s" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={props.onToggle} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (active ? "#8b5cf6" : "rgba(255,255,255,0.2)"), background: active ? "#8b5cf6" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white", fontWeight: 700 }}>{active ? "\u2713" : ""}</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "rgba(255,255,255,0.35)", fontFamily: "monospace" }}>{ep.code}</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.8)", marginTop: 1 }}>{ep.nom}</div>
        </div>
        {active && (
          <input type="number" min="0" max="20" step="0.5" value={props.value}
            onChange={function(e) { var v = parseFloat(e.target.value); if (isNaN(v)) v = 0; props.onChange(Math.max(0, Math.min(20, v))); }}
            style={{ width: 50, padding: "4px", borderRadius: 6, border: "1px solid rgba(139,92,246,0.4)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: 16, fontWeight: 700, textAlign: "center", fontFamily: "Outfit, sans-serif", outline: "none" }}
          />
        )}
      </div>
      {active && props.value > 10 && (
        <div style={{ marginTop: 6, fontSize: 11, color: "#8b5cf6", fontFamily: "monospace" }}>+{(props.value - 10).toFixed(1)} points bonus</div>
      )}
    </div>
  );
}

function App() {
  var s1 = useState({ e1: 10, e21: 10, e22: 10, e3: 10, e41: 10, e42: 10, e5: 10, e6: 10 });
  var notes = s1[0]; var setNotes = s1[1];
  var s2 = useState({ ef1: 10, ef2: 10, ef3: 10 });
  var facNotes = s2[0]; var setFacNotes = s2[1];
  var s3 = useState({ ef1: false, ef2: false, ef3: false });
  var facActive = s3[0]; var setFacActive = s3[1];

  var totalPoints = 0;
  for (var i = 0; i < EPREUVES.length; i++) {
    totalPoints += notes[EPREUVES[i].id] * EPREUVES[i].coef;
  }
  var bonusPoints = 0;
  for (var j = 0; j < FACULTATIVES.length; j++) {
    var fid = FACULTATIVES[j].id;
    if (facActive[fid] && facNotes[fid] > 10) bonusPoints += facNotes[fid] - 10;
  }
  var totalAvecBonus = totalPoints + bonusPoints;
  var moyenne = totalAvecBonus / TOTAL_COEF;
  var mention = getMention(moyenne);
  var pointsManquants = Math.max(0, 10 * TOTAL_COEF - totalAvecBonus);

  function handleReset() {
    setNotes({ e1: 10, e21: 10, e22: 10, e3: 10, e41: 10, e42: 10, e5: 10, e6: 10 });
    setFacNotes({ ef1: 10, ef2: 10, ef3: 10 });
    setFacActive({ ef1: false, ef2: false, ef3: false });
  }

  function updateNote(id, v) {
    setNotes(function(prev) { var n = {}; for (var k in prev) n[k] = prev[k]; n[id] = v; return n; });
  }
  function updateFac(id, v) {
    setFacNotes(function(prev) { var n = {}; for (var k in prev) n[k] = prev[k]; n[id] = v; return n; });
  }
  function toggleFac(id) {
    setFacActive(function(prev) { var n = {}; for (var k in prev) n[k] = prev[k]; n[id] = !prev[id]; return n; });
  }

  var mentionsList = [
    { label: "Ajourné", min: 0, max: 8, color: "#ef4444" },
    { label: "Rattrapage", min: 8, max: 10, color: "#f97316" },
    { label: "Admis", min: 10, max: 12, color: "#f59e0b" },
    { label: "Assez Bien", min: 12, max: 14, color: "#8b5cf6" },
    { label: "Bien", min: 14, max: 16, color: "#3b82f6" },
    { label: "Très Bien", min: 16, max: 20, color: "#10b981" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "white", fontFamily: "Outfit, sans-serif", position: "relative", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ position: "fixed", top: -200, right: -200, width: 600, height: 600, background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -200, left: -200, width: 500, height: 500, background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px 60px", position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", padding: "4px 14px", borderRadius: 20, background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)", fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: "#a78bfa", marginBottom: 16 }}>Session 2026</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, letterSpacing: -1.5, margin: 0, lineHeight: 1.1, color: "white" }}>Calculateur BTS MCO</h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 10, maxWidth: 480, margin: "10px auto 0", lineHeight: 1.5 }}>
            Simule ta moyenne et découvre si tu décroches ton diplôme.
          </p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.06)", padding: "32px 20px 24px", marginBottom: 32, textAlign: "center" }}>
          <GaugeRing value={moyenne} />
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 20, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Points obtenus</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "white", marginTop: 2 }}>{totalAvecBonus.toFixed(1)} <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>/ {TOTAL_COEF * 20}</span></div>
            </div>
            {bonusPoints > 0 && <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Bonus</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#8b5cf6", marginTop: 2 }}>+{bonusPoints.toFixed(1)}</div>
            </div>}
            {moyenne < 10 && <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 1 }}>Il te manque</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#ef4444", marginTop: 2 }}>{pointsManquants.toFixed(1)} pts</div>
            </div>}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 32 }}>
          {mentionsList.map(function(m) {
            var isActive = moyenne >= m.min && moyenne < m.max;
            return <div key={m.label} style={{ padding: "10px 12px", borderRadius: 10, background: isActive ? m.color + "20" : "rgba(255,255,255,0.02)", border: "1px solid " + (isActive ? m.color + "40" : "rgba(255,255,255,0.04)"), textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: m.color, opacity: isActive ? 1 : 0.4 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginTop: 2 }}>{m.min}+ → {m.max}</div>
            </div>;
          })}
        </div>

        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: "rgba(255,255,255,0.85)" }}>Épreuves obligatoires</h2>
          <button onClick={handleReset} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Réinitialiser</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
          {EPREUVES.map(function(ep) {
            return <NoteSlider key={ep.id} value={notes[ep.id]} onChange={function(v) { updateNote(ep.id, v); }} label={ep.nom} code={ep.code} coef={ep.coef} type={ep.type} duree={ep.duree} />;
          })}
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 6px", color: "rgba(255,255,255,0.85)" }}>Épreuves facultatives</h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 14px", lineHeight: 1.5 }}>Seuls les points au-dessus de 10/20 sont comptabilisés en bonus.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
          {FACULTATIVES.map(function(ep) {
            return <FacInput key={ep.id} ep={ep} value={facNotes[ep.id]} onChange={function(v) { updateFac(ep.id, v); }} active={facActive[ep.id]} onToggle={function() { toggleFac(ep.id); }} />;
          })}
        </div>

        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Récapitulatif</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {EPREUVES.map(function(ep) {
              var pts = notes[ep.id] * ep.coef;
              return <div key={ep.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(255,255,255,0.3)", marginRight: 8 }}>{ep.code}</span>{ep.nom}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: notes[ep.id] >= 10 ? "#10b981" : "#ef4444", whiteSpace: "nowrap", marginLeft: 8 }}>
                  {notes[ep.id].toFixed(1)} x {ep.coef} = {pts.toFixed(1)}
                </span>
              </div>;
            })}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0 0", borderTop: "2px solid rgba(255,255,255,0.08)", marginTop: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>TOTAL</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: mention.color }}>{totalAvecBonus.toFixed(1)} / {TOTAL_COEF * 20}</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 11, color: "rgba(255,255,255,0.2)", lineHeight: 1.6 }}>
          Référentiel officiel BTS MCO (JO 10/07/2024) · Coef total : {TOTAL_COEF} · Admission : {TOTAL_COEF * 10} pts (10/20)
        </div>
      </div>
    </div>
  );
}

export default App;
