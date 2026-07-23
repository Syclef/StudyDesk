import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 1000, padding: 20,
};

const modal: React.CSSProperties = {
  background: "var(--card-bg)", border: "1px solid var(--card-border)",
  borderRadius: 18, boxShadow: "var(--shadow)",
  width: "100%", maxWidth: 440, maxHeight: "85vh", overflowY: "auto",
  padding: 28, color: "var(--text)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
};

export default function InfoModal({ title, children, onClose, actionLabel, onAction }: Props) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7 }}>
          {children}
        </div>
        {actionLabel && onAction && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button onClick={onAction}
              style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 9, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
