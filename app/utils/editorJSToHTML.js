export default function editorJsToHtml(data) {
  function renderList(items, style) {
    const listTag = style === 'unordered' ? 'ul' : 'ol';
    return `
      <${listTag}>
        ${items
          .map((item) => {
            const hasSubItems = item.items && item.items.length > 0;
            return `
              <li>
                ${item.content} 
                ${hasSubItems ? renderList(item.items, style) : ''} 
              </li>
            `;
          })
          .join('')}
      </${listTag}>
    `;
  }
  function alertStyle(type) {
    switch (type) {
      case 'primary':
        return 'border:1px solid blue;background-color:lightblue;color:blue;';
      case 'dark':
        return 'border:1px solid black;background-color:gray;color:white;';
      case 'light':
        return 'border:1px solid black;background-color:white;color:black;';
      case 'success':
        return 'border:1px solid green;background-color:lightgreen;color:green;';
      case 'secondary':
        return 'border:1px solid black;background-color:white;color:black;';
      case 'danger':
        return 'border:1px solid #F24537;background-color:#F2BEBB;color:#F24537;';
      case 'warning':
        return 'border:1px solid #FFD550;background-color:#FDF1CD;color:#FFD550;';
      default:
        return 'border:1px solid blue;background-color:lightblue;color:blue;';
    }
  }
  function createTable(table) {
    if (
      !table ||
      !table.data ||
      !table.data.content ||
      !Array.isArray(table.data.content)
    ) {
      return;
    }
    const { withHeadings, content } = table.data;
    let html = '<table border="1" cellspacing="0" cellpadding="5">';

    if (content.length === 0) {
      return;
    }

    if (withHeadings) {
      const headers = content[0];
      html += '<thead><tr>';
      headers.forEach((header) => {
        html += `<th>${header}</th>`;
      });
      html += '</tr></thead>';
    }

    html += '<tbody>';
    const startIndex = withHeadings ? 1 : 0;

    for (let i = startIndex; i < content.length; i++) {
      const row = content[i];

      if (!Array.isArray(row) || row.length !== content[0].length) {
        html += `<tr><td colspan="${content[0].length}">Invalid row data</td></tr>`;
        continue;
      }

      html += '<tr>';
      row.forEach((cell) => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    }

    html += '</tbody></table>';
    return html;
  }

  return data
    ?.map((block) => {
      switch (block.type) {
        case 'title':
          return `<${block.data.titleType.toLowerCase()} style="text-align:${block.data.alignText.split('-')[2].toLowerCase()};${block.data.color ? `color:${block.data.color.toLowerCase()}` : ''}">${block.data.text}</${block.data.titleType.toLowerCase()}>`;

        case 'paragraph':
          return `<p style="text-align:${block.data.alignment.toLowerCase()};">${block.data.text}</p>`;

        case 'list':
          return renderList(block.data.items, block.data.style);

        case 'checklist':
          return `
              ${block.data.items
                .map(
                  (item) =>
                    `<div><input type="checkbox" ${item.checked ? 'checked' : ''}/> ${item.text}</div>`,
                )
                .join('')}
          `;

        case 'quote':
          return `<p>${block.data.caption}</p><blockquote>${block.data.text}</blockquote>`;

        case 'code':
          return `<pre><code>${block.data.code}</code></pre>`;

        case 'embed':
          return `<iframe src="${block.data.embed}" width="${block.data.width}" height="${block.data.height}" frameborder="0" allowfullscreen></iframe>`;

        case 'delimiter':
          return `<hr class='dotted' />`;

        case 'table':
          return createTable(block);

        case 'warning':
          return `<div class="warning"><strong>${block.data.title}</strong><blockquote>${block.data.message}</blockquote></div>`;

        case 'raw':
          return `<textarea>${block.data.html}</textarea>`;

        case 'alert':
          return `<div style="${alertStyle(block.data.type)}text-align:${block.data.align};padding:10px;margin:10px 0;">${block.data.message}</div>`;

        default:
          return '';
      }
    })
    .join('');
}
