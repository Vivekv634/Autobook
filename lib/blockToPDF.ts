import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InlineNode = {
  type?: string;
  text?: string;
  href?: string;
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    color?: string;
    background?: string;
  };
  language?: string;
  content?: InlineNode[];
};

type Block = {
  id: string;
  type: string;
  props?: {
    level?: number;
    color?: string;
    background?: string;
    bg?: string;
    checked?: boolean;
    src?: string;
    url?: string;
    alt?: string;
    rounded?: boolean;
    crossOrigin?: string;
    caption?: string;
    poster?: string;
    thumbnail?: string;
    title?: string;
    code?: string;
    table?: {
      columns?: (string | { title?: string })[];
      rows?: (string | { text?: string })[][];
    };
    columns?: (string | { title?: string })[];
    rows?: (string | { text?: string })[][];
    data?: (string | { text?: string })[][];
    html?: string;
    [key: string]: unknown;
  };
  content?: InlineNode[];
  children?: Block[];
};

type ExportOptions = {
  filename?: string;
  pageSize?: "a4" | { width: number; height: number };
  margin?: number;
  dpi?: number;
  backgroundColor?: string;
};

export async function exportBlockNoteToPDF(
  blocks: Block[],
  opts: ExportOptions = {}
) {
  const { margin = 24, dpi = 2, backgroundColor = "#ffffff" } = opts;

  if (!document) return;
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "794px"; // approx A4 @ 96dpi -> 8.27in*96 ~= 794px
  container.style.boxSizing = "border-box";
  container.style.padding = `${margin}px`;
  container.style.background = backgroundColor;
  container.style.color = "black";
  container.style.fontFamily = "Inter, Roboto, Arial, sans-serif";
  container.style.lineHeight = "1.45";
  container.style.fontSize = "14px";

  const renderInline = (nodes?: InlineNode[]) => {
    if (!nodes || nodes.length === 0) return document.createTextNode("");
    const frag = document.createDocumentFragment();
    nodes.forEach((n) => {
      if (n.type === "link" || n.href) {
        const a = document.createElement("a");
        a.href =
          n.href || (n.content && n.content[0] && n.content[0].text) || "#";
        a.textContent =
          n.text ?? (n.content && n.content.map((c) => c.text).join("")) ?? "";
        a.style.color = n.styles?.color || "#1a73e8";
        a.style.textDecoration = "underline";
        a.setAttribute("target", "_blank");
        if (n.styles?.bold) a.style.fontWeight = "600";
        if (n.styles?.italic) a.style.fontStyle = "italic";
        if (n.styles?.underline) a.style.textDecoration = "underline";
        frag.appendChild(a);
        return;
      }

      const span = document.createElement("span");
      span.textContent =
        n.text ?? (n.content && n.content.map((c) => c.text).join("")) ?? "";
      if (n.styles) {
        if (n.styles.bold) span.style.fontWeight = "600";
        if (n.styles.italic) span.style.fontStyle = "italic";
        if (n.styles.underline) span.style.textDecoration = "underline";
        if (n.styles.strike)
          span.style.textDecoration = span.style.textDecoration
            ? span.style.textDecoration + " line-through"
            : "line-through";
        if (n.styles.color) span.style.color = n.styles.color;
        if (n.styles.background) span.style.background = n.styles.background;
      }
      if (n.type === "codeInline") {
        span.style.fontFamily =
          "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace";
        span.style.background = "rgba(0,0,0,0.06)";
        span.style.padding = "2px 6px";
        span.style.borderRadius = "4px";
        span.style.fontSize = "0.92em";
      }
      frag.appendChild(span);
    });
    return frag;
  };

  const renderBlock = (block: Block, parent?: HTMLElement) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "10px";
    if (block.props?.background || block.props?.bg) {
      wrapper.style.background = block.props.background || block.props.bg || "";
      wrapper.style.padding = "8px 12px";
      wrapper.style.borderRadius = "6px";
    }

    switch (block.type) {
      case "heading":
      case "heading-1":
      case "heading-2":
      case "heading-3": {
        const level =
          block.props?.level ??
          (block.type === "heading-1" ? 1 : block.type === "heading-2" ? 2 : 3);
        const h = document.createElement(`h${Math.min(3, level)}`);
        h.style.margin = "0 0 6px 0";
        h.style.fontWeight = "700";
        h.style.fontFamily = "Inter, Roboto, Arial, sans-serif";
        h.style.color = block.props?.color || "#111827";
        h.appendChild(renderInline(block.content) as Node);
        wrapper.appendChild(h);
        break;
      }

      case "paragraph":
      default: {
        const p = document.createElement("p");
        p.style.margin = "0 0 6px 0";
        p.appendChild(renderInline(block.content) as Node);
        wrapper.appendChild(p);
      }
    }

    // Lists
    if (
      block.type === "bulletList" ||
      block.type === "bulletListItem" ||
      block.type === "unordered-list"
    ) {
      const ul = document.createElement("ul");
      ul.style.margin = "6px 0";
      ul.style.paddingLeft = "20px";
      const addListItems = (b: Block, parentUl: HTMLUListElement) => {
        const li = document.createElement("li");
        li.style.marginBottom = "6px";
        li.appendChild(renderInline(b.content) as Node);
        parentUl.appendChild(li);
        if (b.children) {
          const nested = document.createElement("ul");
          nested.style.paddingLeft = "16px";
          b.children.forEach((c) => addListItems(c, nested));
          li.appendChild(nested);
        }
      };
      if (block.type === "bulletListItem") {
        addListItems(block, ul);
      } else if (block.children && block.children.length) {
        block.children.forEach((c) => addListItems(c, ul));
      }
      wrapper.appendChild(ul);
    }

    // Numbered list
    if (
      block.type === "numberedList" ||
      block.type === "numberedListItem" ||
      block.type === "ordered-list"
    ) {
      const ol = document.createElement("ol");
      ol.style.margin = "6px 0";
      ol.style.paddingLeft = "20px";
      const addListItems = (b: Block, parentOl: HTMLOListElement) => {
        const li = document.createElement("li");
        li.style.marginBottom = "6px";
        li.appendChild(renderInline(b.content) as Node);
        parentOl.appendChild(li);
        if (b.children) {
          const nested = document.createElement("ol");
          nested.style.paddingLeft = "16px";
          b.children.forEach((c) => addListItems(c, nested));
          li.appendChild(nested);
        }
      };
      if (block.type === "numberedListItem") {
        addListItems(block, ol);
      } else if (block.children && block.children.length) {
        block.children.forEach((c) => addListItems(c, ol));
      }
      wrapper.appendChild(ol);
    }

    // Checklist
    if (block.type === "checklist" || block.type === "checklistItem") {
      const list = document.createElement("div");
      list.style.margin = "6px 0";
      const addCheck = (b: Block) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.gap = "8px";
        row.style.marginBottom = "6px";
        const box = document.createElement("input");
        box.type = "checkbox";
        box.checked = !!b.props?.checked;
        box.disabled = true;
        row.appendChild(box);
        const label = document.createElement("div");
        label.appendChild(renderInline(b.content) as Node);
        row.appendChild(label);
        list.appendChild(row);
        if (b.children) b.children.forEach(addCheck);
      };
      if (block.type === "checklistItem") addCheck(block);
      else if (block.children) block.children.forEach(addCheck);
      wrapper.appendChild(list);
    }

    // Code block
    if (block.type === "codeBlock") {
      const pre = document.createElement("pre");
      pre.style.background = block.props?.background || "#0f172a"; // dark background by default
      pre.style.color = block.props?.color || "#e6eef8";
      pre.style.padding = "12px";
      pre.style.borderRadius = "8px";
      pre.style.overflowX = "auto";
      pre.style.fontFamily =
        "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace";
      pre.style.fontSize = "12px";
      pre.style.margin = "8px 0";
      pre.textContent =
        block.props?.code ??
        (block.content ? block.content.map((c) => c.text).join("") : "");
      wrapper.appendChild(pre);
    }

    // Quote
    if (block.type === "quote") {
      const q = document.createElement("blockquote");
      q.style.borderLeft = "4px solid rgba(0,0,0,0.12)";
      q.style.margin = "8px 0";
      q.style.paddingLeft = "12px";
      q.style.color = "rgba(0,0,0,0.8)";
      q.appendChild(renderInline(block.content) as Node);
      wrapper.appendChild(q);
    }

    // Divider
    if (block.type === "divider" || block.type === "hr") {
      const hr = document.createElement("hr");
      hr.style.border = "none";
      hr.style.height = "1px";
      hr.style.background = "rgba(0,0,0,0.12)";
      hr.style.margin = "12px 0";
      wrapper.appendChild(hr);
    }

    // Image
    if (block.type === "image") {
      const img = document.createElement("img");
      img.src = block.props?.src || block.props?.url || "";
      img.alt = block.props?.alt || "image";
      img.style.maxWidth = "100%";
      img.style.borderRadius = block.props?.rounded ? "8px" : "4px";
      img.style.margin = "8px 0";
      // allow crossOrigin if available (may improve canvas rendering)
      if (block.props?.crossOrigin) img.crossOrigin = block.props.crossOrigin;
      wrapper.appendChild(img);
      if (block.props?.caption) {
        const cap = document.createElement("div");
        cap.style.fontSize = "12px";
        cap.style.color = "rgba(0,0,0,0.6)";
        cap.style.marginTop = "6px";
        cap.textContent = block.props.caption;
        wrapper.appendChild(cap);
      }
    }

    // Video (render as poster if provided, else link)
    if (block.type === "video") {
      const poster = block.props?.poster || block.props?.thumbnail;
      if (poster) {
        const img = document.createElement("img");
        img.src = poster;
        img.alt = block.props?.title || "video poster";
        img.style.maxWidth = "100%";
        img.style.borderRadius = "8px";
        img.style.margin = "8px 0";
        wrapper.appendChild(img);
      }
      const link = document.createElement("a");
      link.href = block.props?.src || block.props?.url || "#";
      link.textContent = block.props?.title
        ? `Watch: ${block.props.title}`
        : "Open video";
      link.style.display = "inline-block";
      link.style.marginTop = "6px";
      link.style.textDecoration = "underline";
      link.setAttribute("target", "_blank");
      wrapper.appendChild(link);
    }

    // Table - expect props.table = { columns: [...], rows: [[...], ...] } OR block.props.tableColumns etc.
    if (block.type === "table" || block.props?.table) {
      const tableSpec = block.props?.table || {
        columns: block.props?.columns || [],
        rows: block.props?.rows || block.props?.data || [],
      };
      const tbl = document.createElement("table");
      tbl.style.borderCollapse = "collapse";
      tbl.style.width = "100%";
      tbl.style.margin = "8px 0";
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      (tableSpec.columns || []).forEach((col: string | { title?: string }) => {
        const th = document.createElement("th");
        th.textContent =
          typeof col === "object" && col !== null && "title" in col
            ? col.title ?? ""
            : (col as string) ?? "";
        th.style.border = "1px solid rgba(0,0,0,0.08)";
        th.style.padding = "6px 8px";
        th.style.textAlign = "left";
        th.style.background = "rgba(0,0,0,0.03)";
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      tbl.appendChild(thead);

      const tbody = document.createElement("tbody");
      (tableSpec.rows || []).forEach((row: (string | { text?: string })[]) => {
        const tr = document.createElement("tr");
        row.forEach((cell) => {
          const td = document.createElement("td");
          td.style.border = "1px solid rgba(0,0,0,0.06)";
          td.style.padding = "6px 8px";
          td.style.verticalAlign = "top";
          td.textContent =
            typeof cell === "object" && cell !== null && "text" in cell
              ? cell.text ?? ""
              : typeof cell === "string"
              ? cell
              : "";
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      wrapper.appendChild(tbl);
    }

    // Attach children (generic)
    if (block.children && block.children.length) {
      block.children.forEach((c) => {
        const childEl = renderBlock(c, wrapper);
        if (childEl) wrapper.appendChild(childEl);
      });
    }

    // If block had explicit raw HTML content
    if (block.type === "rawHtml" && block.props?.html) {
      const holder = document.createElement("div");
      holder.innerHTML = block.props.html;
      wrapper.appendChild(holder);
    }

    // Append to parent or return
    if (parent) {
      parent.appendChild(wrapper);
      return wrapper;
    } else {
      return wrapper;
    }
  };

  // Build document content
  const header = document.createElement("div");
  header.style.marginBottom = "14px";
  // Optionally a title if present as first heading block
  const first = blocks[0];
  if (
    first &&
    (first.type === "heading" || first.type?.startsWith("heading"))
  ) {
    // don't duplicate if heading will render below; we can skip header.
  }

  container.appendChild(header);

  blocks.forEach((b) => {
    const el = renderBlock(b, container);
    if (el) container.appendChild(el);
  });

  document.body.appendChild(container);

  // Wait a tick for images/fonts to load (best-effort)
  await new Promise((res) => setTimeout(res, 120));

  // Ensure all images loaded (try to wait extra if images exist)
  const imgs = Array.from(container.querySelectorAll("img"));
  if (imgs.length) {
    await Promise.all(
      imgs.map(
        (img: HTMLImageElement) =>
          new Promise<void>((resolve) => {
            if (img.complete) return resolve();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            // timeout fallback
            setTimeout(resolve, 3000);
          })
      )
    );
  }

  // Render container to canvas
  const scale = dpi;
  const canvas = await html2canvas(container, {
    scale,
    useCORS: true,
    backgroundColor: null,
    logging: false,
    scrollX: 0,
    scrollY: 0,
    windowWidth: container.scrollWidth,
    windowHeight: container.scrollHeight,
  });

  // Remove the offscreen container regardless of success
  container.remove();

  // Setup jsPDF
  const pdf = new jsPDF({
    unit: "pt", // points
    format: "a4",
    compress: true,
  });

  // A4 pts size
  const pageWidthPt = pdf.internal.pageSize.getWidth();
  const pageHeightPt = pdf.internal.pageSize.getHeight();

  // Convert canvas to image
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const imgData = canvas.toDataURL("image/png", 1.0);

  // Calculate dimensions to fit width, maintain aspect ratio
  const pxPerPt = canvasWidth / pageWidthPt; // px per point
  const imgHeightPts = canvasHeight / pxPerPt;

  // If content fits on a single page
  if (imgHeightPts <= pageHeightPt) {
    pdf.addImage(imgData, "PNG", 0, 0, pageWidthPt, imgHeightPts);
  } else {
    // Paginate: draw per-page slices from canvas
    let remainingHeightPx = canvasHeight;
    let pageOffsetPx = 0;
    const pageHeightPx = Math.round(pxPerPt * pageHeightPt);

    while (remainingHeightPx > 0) {
      // create temporary canvas slice
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvasWidth;
      sliceCanvas.height = Math.min(pageHeightPx, remainingHeightPx);
      const ctx = sliceCanvas.getContext("2d")!;
      // draw from main canvas
      ctx.drawImage(
        canvas,
        0,
        pageOffsetPx,
        canvasWidth,
        sliceCanvas.height,
        0,
        0,
        canvasWidth,
        sliceCanvas.height
      );
      const sliceData = sliceCanvas.toDataURL("image/png", 1.0);
      const sliceHeightPts = sliceCanvas.height / pxPerPt;
      pdf.addImage(sliceData, "PNG", 0, 0, pageWidthPt, sliceHeightPts);
      remainingHeightPx -= sliceCanvas.height;
      pageOffsetPx += sliceCanvas.height;
      if (remainingHeightPx > 0) pdf.addPage();
    }
  }

  // Save the pdf
  return pdf;
}
