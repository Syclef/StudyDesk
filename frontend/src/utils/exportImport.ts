export function exportScores() {
  const data = Object.entries(localStorage)
    .filter(([k]) => k.startsWith("auditstudydesk"))
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "audit-study-desk-scores.json";
  a.click();
}

export function importScores(file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    const data = JSON.parse(reader.result as string);
    Object.entries(data).forEach(([k, v]) =>
      localStorage.setItem(k, String(v))
    );
    window.location.reload();
  };
  reader.readAsText(file);
}
