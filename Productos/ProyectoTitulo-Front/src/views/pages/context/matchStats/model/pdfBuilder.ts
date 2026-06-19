import jsPDF from 'jspdf';
import type { MatchStatsData, MatchDetail } from './matchStatsModel';

const SURFACE_LABELS: Record<string, string> = { Clay: 'Arcilla', Hard: 'Dura', Grass: 'Césped' };
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });

type RGB = [number, number, number];

const C = {
  bg:     [19, 19, 19]   as RGB,
  card:   [30, 30, 30]   as RGB,
  card2:  [38, 38, 38]   as RGB,
  accent: [245, 158, 11] as RGB,
  text:   [226, 226, 226] as RGB,
  sub:    [216, 195, 173] as RGB,
  muted:  [120, 110, 100] as RGB,
  green:  [74, 222, 128]  as RGB,
  red:    [248, 113, 113] as RGB,
  dark:   [14, 14, 14]    as RGB,
};

const fill = (pdf: jsPDF, c: RGB) => pdf.setFillColor(c[0], c[1], c[2]);
const ink  = (pdf: jsPDF, c: RGB) => pdf.setTextColor(c[0], c[1], c[2]);

const rr = (pdf: jsPDF, x: number, y: number, w: number, h: number, r = 2) =>
  pdf.roundedRect(x, y, w, h, r, r, 'F');

const progressBar = (
  pdf: jsPDF, x: number, y: number, w: number, h: number,
  pct: number, color: RGB,
) => {
  fill(pdf, [40, 40, 40]); rr(pdf, x, y, w, h, h / 2);
  if (pct > 0) { fill(pdf, color); rr(pdf, x, y, Math.max(w * (pct / 100), h), h, h / 2); }
};

// ── Canvas helpers ────────────────────────────────────────────────────────────

const donutCanvas = (pct: number): string => {
  const S = 200;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  const cx = S / 2, r = 74, lw = 16;

  ctx.beginPath();
  ctx.arc(cx, cx, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = lw; ctx.stroke();

  const start = -Math.PI / 2;
  const end   = start + (pct / 100) * Math.PI * 2;
  ctx.beginPath(); ctx.arc(cx, cx, r, start, end);
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = lw;
  ctx.lineCap = 'round'; ctx.stroke();

  return c.toDataURL('image/png');
};

const trendCanvas = (trend: { minute: number; pointsWon: number }[]): string => {
  const W = 600, H = 200;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#1e1e1e'; ctx.fillRect(0, 0, W, H);

  if (trend.length < 2) return c.toDataURL();

  const pad = { t: 16, r: 16, b: 28, l: 32 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;
  const maxX = trend[trend.length - 1].minute || 1;
  const maxY = Math.max(...trend.map(d => d.pointsWon), 1);

  const px = (m: number) => pad.l + (m / maxX) * cw;
  const py = (v: number) => pad.t + ch - (v / maxY) * ch;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const gy = pad.t + (i / 4) * ch;
    ctx.beginPath(); ctx.moveTo(pad.l, gy); ctx.lineTo(pad.l + cw, gy); ctx.stroke();
  }

  // Fill
  ctx.beginPath();
  ctx.moveTo(px(trend[0].minute), py(trend[0].pointsWon));
  trend.forEach(d => ctx.lineTo(px(d.minute), py(d.pointsWon)));
  ctx.lineTo(px(trend[trend.length - 1].minute), pad.t + ch);
  ctx.lineTo(px(trend[0].minute), pad.t + ch);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch);
  grad.addColorStop(0, 'rgba(245,158,11,0.35)');
  grad.addColorStop(1, 'rgba(245,158,11,0)');
  ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(px(trend[0].minute), py(trend[0].pointsWon));
  trend.forEach(d => ctx.lineTo(px(d.minute), py(d.pointsWon)));
  ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke();

  // Dots
  trend.forEach(d => {
    ctx.beginPath();
    ctx.arc(px(d.minute), py(d.pointsWon), 4, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.strokeStyle = '#131313'; ctx.lineWidth = 2; ctx.stroke();
  });

  // X labels
  ctx.fillStyle = '#888'; ctx.font = '16px monospace'; ctx.textAlign = 'center';
  const step = Math.max(1, Math.floor(trend.length / 7));
  trend.filter((_, i) => i % step === 0).forEach(d =>
    ctx.fillText(`${d.minute}'`, px(d.minute), H - 6)
  );

  return c.toDataURL('image/png');
};

// ── Builder ───────────────────────────────────────────────────────────────────

export const buildMatchStatsPdf = (data: MatchStatsData, detail: MatchDetail | null): void => {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const PW = 210, PH = 297, M = 14, CW = PW - M * 2;

  // Full background
  fill(pdf, C.bg); pdf.rect(0, 0, PW, PH, 'F');

  // Accent top bar
  fill(pdf, C.accent); pdf.rect(0, 0, PW, 1.5, 'F');

  // ── Brand ──────────────────────────────────────────────────────────────────
  ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(9);
  pdf.text('DOUBLE FAULT', M, 11);

  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6);
  pdf.text('ELITE TENNIS PERFORMANCE ANALYSIS', M, 15.5);

  ink(pdf, C.muted); pdf.setFontSize(6.5);
  pdf.text(new Date().toLocaleDateString('es-CL'), PW - M, 11, { align: 'right' });

  // ── Title ──────────────────────────────────────────────────────────────────
  ink(pdf, C.text); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(20);
  pdf.text('ANÁLISIS DE PARTIDO', PW / 2, 26, { align: 'center' });

  // ── Player card ────────────────────────────────────────────────────────────
  const hasSets = detail && detail.sets.length > 0;
  const cardH = hasSets ? 26 : 22;
  let y = 30;
  fill(pdf, C.card); rr(pdf, M, y, CW, cardH, 3);

  // P1
  const p1Won = detail?.winnerId != null && detail.winnerId === data.player1.id;
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
  pdf.text('LOCAL', M + 6, y + 7);
  ink(pdf, C.text); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  pdf.text(data.player1.name.toUpperCase(), M + 6, y + 15);
  if (p1Won) {
    ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6);
    pdf.text('★ GANADOR', M + 6, y + 19);
  }

  // VS badge + sets
  fill(pdf, C.accent); rr(pdf, PW / 2 - 6, y + 3, 12, 10, 2);
  ink(pdf, C.dark); pdf.setFontSize(7); pdf.setFont('helvetica', 'bold');
  pdf.text('VS', PW / 2, y + 10, { align: 'center' });

  if (hasSets) {
    const setStr = detail!.sets.map(s => `${s.p1}-${s.p2}`).join('  ');
    ink(pdf, C.sub); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7.5);
    pdf.text(setStr, PW / 2, y + 20, { align: 'center' });
  }

  // P2
  const p2Won = detail?.winnerId != null && detail.winnerId === data.player2.id;
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
  pdf.text('OPONENTE', PW - M - 6, y + 7, { align: 'right' });
  ink(pdf, C.text); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  pdf.text(data.player2.name.toUpperCase(), PW - M - 6, y + 15, { align: 'right' });
  if (p2Won) {
    ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(6);
    pdf.text('★ GANADOR', PW - M - 6, y + 19, { align: 'right' });
  }

  y += cardH + 4;

  // ── Match metadata row ─────────────────────────────────────────────────────
  if (detail) {
    const chips: string[] = [];
    if (detail.location) chips.push(`📍 ${detail.location}`);
    chips.push(`🎾 ${SURFACE_LABELS[detail.surface] ?? detail.surface}`);
    chips.push(`Bo${detail.bestOf}`);
    if (detail.scheduledAt) chips.push(formatDate(detail.scheduledAt));

    fill(pdf, C.card2); rr(pdf, M, y, CW, 8, 2);
    ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
    const chipStr = chips.join('   ·   ');
    pdf.text(chipStr, PW / 2, y + 5, { align: 'center' });
    y += 11;
  } else {
    y += 4;
  }

  // ── Physical metrics ───────────────────────────────────────────────────────
  const hw = (CW - 4) / 2;

  fill(pdf, C.card); rr(pdf, M, y, hw, 22, 3);
  fill(pdf, C.accent); rr(pdf, M, y, 3, 22, 1.5);
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
  pdf.text('DURACIÓN TOTAL', M + 7, y + 8);
  ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13);
  pdf.text(data.matchDuration, M + 7, y + 17);

  const dx = M + hw + 4;
  fill(pdf, C.card); rr(pdf, dx, y, hw, 22, 3);
  fill(pdf, C.green); rr(pdf, dx, y, 3, 22, 1.5);
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
  pdf.text('DISTANCIA RECORRIDA', dx + 7, y + 8);
  ink(pdf, C.green); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13);
  pdf.text(`${data.distanceKm.toFixed(2)} KM`, dx + 7, y + 17);

  y += 24;

  // ── Point performance ──────────────────────────────────────────────────────
  ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7);
  pdf.text('● RENDIMIENTO DE PUNTOS', M, y + 4);
  y += 8;

  // Donut
  const DS = 38;
  const donutImg = donutCanvas(data.effectivenessPct);
  pdf.addImage(donutImg, 'PNG', M, y, DS, DS);
  ink(pdf, C.accent); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.effectivenessPct}%`, M + DS / 2, y + DS / 2 + 2, { align: 'center' });
  ink(pdf, C.muted); pdf.setFontSize(5.5); pdf.setFont('helvetica', 'normal');
  pdf.text('Efectividad', M + DS / 2, y + DS / 2 + 7, { align: 'center' });

  // Won / Lost cards
  const sx = M + DS + 5;
  const sw = 32;
  fill(pdf, C.card); rr(pdf, sx, y, sw, 17, 2);
  ink(pdf, C.muted); pdf.setFontSize(6); pdf.setFont('helvetica', 'normal');
  pdf.text('PUNTOS GANADOS', sx + 4, y + 6);
  ink(pdf, C.green); pdf.setFontSize(12); pdf.setFont('helvetica', 'bold');
  pdf.text(String(data.pointsWon), sx + 4, y + 14);

  fill(pdf, C.card); rr(pdf, sx, y + 20, sw, 17, 2);
  ink(pdf, C.muted); pdf.setFontSize(6); pdf.setFont('helvetica', 'normal');
  pdf.text('PUNTOS PERDIDOS', sx + 4, y + 26);
  ink(pdf, C.red); pdf.setFontSize(12); pdf.setFont('helvetica', 'bold');
  pdf.text(String(data.pointsLost), sx + 4, y + 34);

  // Break points
  const bx = sx + sw + 5;
  const bw = CW - (bx - M);
  const favPct = data.breakPointsFavorable.total > 0
    ? Math.round((data.breakPointsFavorable.won / data.breakPointsFavorable.total) * 100) : 0;
  const agPct = data.breakPointsAgainst.total > 0
    ? Math.round((data.breakPointsAgainst.won / data.breakPointsAgainst.total) * 100) : 0;

  // Favorable
  fill(pdf, C.card); rr(pdf, bx, y, bw, 17, 2);
  ink(pdf, C.muted); pdf.setFontSize(6); pdf.setFont('helvetica', 'normal');
  pdf.text('QUIEBRES FAVORABLES', bx + 4, y + 6);
  ink(pdf, C.green); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.breakPointsFavorable.won}/${data.breakPointsFavorable.total}`, bx + 4, y + 12.5);
  ink(pdf, C.muted); pdf.setFontSize(7);
  pdf.text(`${favPct}%`, bx + bw - 5, y + 12.5, { align: 'right' });
  progressBar(pdf, bx + 4, y + 14.5, bw - 8, 1.5, favPct, C.green);

  // Against
  fill(pdf, C.card); rr(pdf, bx, y + 20, bw, 17, 2);
  ink(pdf, C.muted); pdf.setFontSize(6); pdf.setFont('helvetica', 'normal');
  pdf.text('QUIEBRES EN CONTRA', bx + 4, y + 26);
  ink(pdf, C.red); pdf.setFontSize(10); pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.breakPointsAgainst.won}/${data.breakPointsAgainst.total}`, bx + 4, y + 32.5);
  ink(pdf, C.muted); pdf.setFontSize(7);
  pdf.text(`${agPct}%`, bx + bw - 5, y + 32.5, { align: 'right' });
  progressBar(pdf, bx + 4, y + 34.5, bw - 8, 1.5, agPct, C.red);

  y += 44;

  // ── Trend chart ────────────────────────────────────────────────────────────
  ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7);
  pdf.text('● TENDENCIA DEL PARTIDO', M, y + 4);
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6);
  pdf.text('(Promedio de puntos ganados en intervalos de 5 minutos)', M, y + 9);
  y += 10;

  const trendH = 42;
  fill(pdf, C.card); rr(pdf, M, y, CW, trendH, 3);
  const trendImg = trendCanvas(data.trend);
  pdf.addImage(trendImg, 'PNG', M + 2, y + 2, CW - 4, trendH - 4);

  y += trendH + 7;

  // ── Point duration ─────────────────────────────────────────────────────────
  const QUARTILE_COLORS: RGB[] = [
    [34, 197, 94],   // green  — Cortos
    [234, 179, 8],   // yellow — Medios
    [249, 115, 22],  // orange — Largos
    [239, 68, 68],   // red    — Extremos
  ];
  const QUARTILE_LABELS = ['Cortos', 'Medios', 'Largos', 'Extremos'];

  ink(pdf, C.accent); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7);
  pdf.text('● ANÁLISIS DE DURACIÓN DE PUNTOS', M, y + 4);
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6);
  pdf.text('(Intervalos de tiempo donde se distribuyen los puntos ganados por el jugador)', M, y + 9);
  y += 11;

  const qw = (CW - 9) / 4;

  data.pointDuration.quartiles.forEach((q, i) => {
    const qx = M + i * (qw + 3);
    const color = QUARTILE_COLORS[i];

    fill(pdf, C.card); rr(pdf, qx, y, qw, 28, 3);
    fill(pdf, color); rr(pdf, qx, y, qw, 3, 1.5);

    ink(pdf, color); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(13);
    pdf.text(`${q.pct.toFixed(1)}%`, qx + qw / 2, y + 12, { align: 'center' });

    ink(pdf, C.text); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(7);
    pdf.text(QUARTILE_LABELS[i], qx + qw / 2, y + 19, { align: 'center' });

    ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6);
    pdf.text(`${q.minSec}–${q.maxSec} seg`, qx + qw / 2, y + 25, { align: 'center' });
  });

  y += 34;

  // Timer cards
  const tw = (CW - 4) / 2;

  fill(pdf, C.card); rr(pdf, M, y, tw, 16, 3);
  fill(pdf, C.green); rr(pdf, M, y, 3, 16, 1.5);
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
  pdf.text('MEDIA PUNTO GANADO', M + 7, y + 7);
  ink(pdf, C.green); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  pdf.text(`${data.pointDuration.avgWonSeconds.toFixed(1)}s`, M + 7, y + 13.5);

  const tx = M + tw + 4;
  fill(pdf, C.card); rr(pdf, tx, y, tw, 16, 3);
  fill(pdf, C.red); rr(pdf, tx, y, 3, 16, 1.5);
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(6.5);
  pdf.text('MEDIA PUNTO PERDIDO', tx + 7, y + 7);
  ink(pdf, C.red); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(11);
  pdf.text(`${data.pointDuration.avgLostSeconds.toFixed(1)}s`, tx + 7, y + 13.5);

  y += 20;

  // ── Footer ─────────────────────────────────────────────────────────────────
  fill(pdf, C.dark); pdf.rect(0, PH - 16, PW, 16, 'F');
  fill(pdf, C.accent); pdf.rect(0, PH - 16, PW, 0.5, 'F');
  ink(pdf, [55, 45, 35]); pdf.setFont('helvetica', 'bold'); pdf.setFontSize(8);
  pdf.text('DOUBLE FAULT', PW / 2, PH - 9, { align: 'center' });
  ink(pdf, C.muted); pdf.setFont('helvetica', 'normal'); pdf.setFontSize(5.5);
  pdf.text('ELITE TENNIS PERFORMANCE ANALYSIS', PW / 2, PH - 4.5, { align: 'center' });

  pdf.save(`match-stats-${data.matchId}.pdf`);
};
