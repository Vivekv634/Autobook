export default function editorJsToHtml(data) {
  function renderList(items, style) {
    const listTag = style === 'unordered' ? 'ul' : 'ol';
    return `
      <${listTag}>
        ${items
          .map((item) => {
            if (typeof item === 'string') {
              return `<li>${item.content}</li>`;
            } else {
              return `<li>${item.content}${renderList(item.items, style)}</li>`;
            }
          })
          .join('')}
      </${listTag}>
    `;
  }
  return data
    .map((block) => {
      switch (block.type) {
        case 'header':
          return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case 'paragraph':
          return `<p>${block.data.text}</p>`;
        case 'list': {
          return renderList(block.data.items, block.data.style);
        }
        case 'image':
          return `<img src="${block.data.file.url}" alt="${block.data.caption}" />`;
        case 'quote':
          return `<blockquote>${block.data.text}</blockquote><cite>${block.data.caption}</cite>`;
        case 'code':
          return `<pre><code>${block.data.code}</code></pre>`;
        case 'embed':
          return `<iframe src="${block.data.embed}" width="${block.data.width}" height="${block.data.height}" frameborder="0" allowfullscreen></iframe>`;
        case 'delimiter':
          return `<hr />`;
        default:
          return '';
      }
    })
    .join('');
}
