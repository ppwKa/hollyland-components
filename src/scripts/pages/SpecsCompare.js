/**
 * Hollyland Specs Compare — 过滤、导出、复制、紧凑/冻结列、单元格复制
 */

let specsToastTimer;

function rowValuesDiffer(row) {
  const cells = row.querySelectorAll("td");
  if (cells.length < 2) return true;
  const first = cells[0].textContent.trim();
  for (let i = 1; i < cells.length; i++) {
    if (cells[i].textContent.trim() !== first) return true;
  }
  return false;
}

function updateHint(hintEl, onlyDiff, hiddenCount, totalRows) {
  if (!hintEl) return;
  if (!onlyDiff) {
    hintEl.textContent = "";
    return;
  }
  if (hiddenCount > 0) {
    hintEl.textContent = `已隐藏 ${hiddenCount} 项相同参数（共 ${totalRows} 项）`;
  } else {
    hintEl.textContent =
      "当前各列参数均有差异，没有可合并项。可取消勾选查看全部。";
  }
}

function applyDiffFilter(root, onlyDiff) {
  const rows = root.querySelectorAll("tbody .specs-compare-row");
  let hiddenCount = 0;
  rows.forEach((row) => {
    const hide = onlyDiff && !rowValuesDiffer(row);
    row.classList.toggle("is-hidden", hide);
    if (hide) hiddenCount += 1;
  });
  const hint = root.querySelector("[data-specs-diff-hint]");
  updateHint(hint, onlyDiff, hiddenCount, rows.length);
}

function tableToMatrix(root) {
  const table = root.querySelector(".specs-compare-table");
  if (!table) return [];
  const rows = [];
  table.querySelectorAll("tr").forEach((tr) => {
    const cells = Array.from(tr.querySelectorAll("th, td")).map((c) =>
      c.textContent.trim().replace(/\s+/g, " ")
    );
    rows.push(cells);
  });
  return rows;
}

function downloadCsv(root) {
  const matrix = tableToMatrix(root);
  const lines = matrix.map((r) =>
    r.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
  );
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "specs-compare.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(root, "已导出 CSV 文件");
}

function copyTsv(root) {
  const matrix = tableToMatrix(root);
  const tsv = matrix.map((r) => r.join("\t")).join("\n");
  const fallback = () => {
    prompt("复制以下内容：", tsv);
    showToast(root, "请手动复制");
  };
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(tsv).then(() => showToast(root, "表格已复制到剪贴板")).catch(fallback);
  } else {
    fallback();
  }
}

function showToast(root, msg) {
  const toast = root.querySelector("[data-specs-toast]");
  if (!toast) return;
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(specsToastTimer);
  specsToastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 2200);
}

function init(root) {
  root.addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;
    if (t.matches("[data-specs-diff-toggle]")) {
      applyDiffFilter(root, t.checked);
    }
    if (t.matches("[data-specs-sticky-col]")) {
      root.classList.toggle("is-sticky-enhanced", t.checked);
    }
  });

  root.addEventListener("click", (e) => {
    const exportBtn = e.target.closest("[data-specs-export-csv]");
    if (exportBtn && root.contains(exportBtn)) {
      e.preventDefault();
      downloadCsv(root);
      return;
    }
    const copyBtn = e.target.closest("[data-specs-copy-tsv]");
    if (copyBtn && root.contains(copyBtn)) {
      e.preventDefault();
      copyTsv(root);
      return;
    }
    const compactBtn = e.target.closest("[data-specs-toggle-compact]");
    if (compactBtn && root.contains(compactBtn)) {
      e.preventDefault();
      root.classList.toggle("is-compact");
      const on = root.classList.contains("is-compact");
      compactBtn.setAttribute("aria-pressed", on ? "true" : "false");
      compactBtn.textContent = on ? "常规间距" : "紧凑视图";
      showToast(root, on ? "已切换为紧凑视图" : "已恢复常规间距");
      return;
    }

    const td = e.target.closest("tbody td.specs-compare-td");
    if (td && root.contains(td)) {
      const text = td.textContent.trim();
      const go = () => showToast(root, `已复制：${text}`);
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(go).catch(go);
      } else {
        go();
      }
    }
  });

  root.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const td = e.target.closest("tbody td.specs-compare-td");
    if (!td || !root.contains(td)) return;
    e.preventDefault();
    td.click();
  });
}

function initPage() {
  const root = document.querySelector("[data-specs-compare-root]");
  if (!root) return;
  init(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPage);
} else {
  initPage();
}
