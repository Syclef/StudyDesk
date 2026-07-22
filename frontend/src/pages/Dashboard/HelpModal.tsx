import React from "react";

interface Props {
  onClose: () => void;
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 20,
};

const modal: React.CSSProperties = {
  background: "var(--card-bg)", border: "1px solid var(--card-border)",
  borderRadius: 16, boxShadow: "var(--shadow)",
  width: "100%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto",
  padding: 24, color: "var(--text)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 13, fontWeight: 700, color: "var(--text)", marginTop: 16, marginBottom: 4,
};

const sectionBody: React.CSSProperties = {
  fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6,
};

export default function HelpModal({ onClose }: Props) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>How CISA Prep Works</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>

        <div style={sectionTitle}>Study</div>
        <div style={sectionBody}>
          Review questions by category, one at a time, with the explanation shown right after you answer. Best for
          learning material you haven't seen before — no time pressure, no scoring pressure.
        </div>

        <div style={sectionTitle}>Practice</div>
        <div style={sectionBody}>
          Five sets of 150 questions, weighted across all five CISA domains. No timer, and you see whether you got
          each question right immediately. Good for reinforcing material once you've studied it.
        </div>

        <div style={sectionTitle}>Exam</div>
        <div style={sectionBody}>
          Five full mock exams — 150 questions, 4-hour timer, no answers shown until you submit. This is the closest
          simulation of the real CISA exam conditions available here.
        </div>

        <div style={sectionTitle}>Flashcards</div>
        <div style={sectionBody}>
          Quick-reference cards for terms and concepts, useful for short review sessions between longer study blocks.
        </div>

        <div style={sectionTitle}>Daily Quiz</div>
        <div style={sectionBody}>
          A quick 10-question warm-up each day, focused on a rotating domain. This is separate from your main
          progress tracking — it's meant as a light daily habit, not a substitute for Study/Practice/Exam.
        </div>

        <div style={sectionTitle}>Dashboard numbers</div>
        <div style={sectionBody}>
          "Overall Progress" and "Domain Breakdown" count each question once, based on the most recent time you
          answered it — repeating a Practice set won't inflate your coverage number. "Focus Areas" highlights your
          two lowest-accuracy domains across everything you've done so far.
        </div>
      </div>
    </div>
  );
}
