export default function editorJsToHtml(jsonData) {
  const blockToHTML = (block) => {
    switch (block.type) {
      case 'header':
        return `<h${block.data.level} style="color: #343434; font-weight: bold; margin: 1rem 0;">
                  ${block.data.text}
                </h${block.data.level}>`;

      case 'paragraph':
        return `<p style="font-size: 1rem; line-height: 1.6; color: #333; margin-bottom: 1rem;">
                  ${block.data.text}
                </p>`;

      case 'quote':
        return `<blockquote style="font-style: italic; color: #555; border-left: 4px solid #4a90e2; padding-left: 1rem; margin: 1rem 0;">
                  ${block.data.text}
                  <footer style="font-size: 0.9rem; color: #888; margin-top: 0.5rem;">— ${block.data.caption}</footer>
                </blockquote>`;
      case 'list': {
        const renderListItems = (items, style) =>
          items
            .map((item) => {
              const nestedList =
                item.items && item.items.length
                  ? renderListItems(item.items, style)
                  : '';
              if (style === 'checklist') {
                return `
                  <div style="margin: 0.5rem 0;">
                    <input type="checkbox" ${item.meta?.checked ? 'checked' : ''} disabled style="margin-right: 0.5rem; cursor: not-allowed;">
                    <label style="font-size: 1rem; color: #333;">${item.content}</label>
                    ${nestedList}
                  </div>`;
              } else {
                return `
                  <li style="margin: 0.5rem 0;">
                    ${item.content}
                    ${nestedList ? `<ul>${nestedList}</ul>` : ''}
                  </li>`;
              }
            })
            .join('');

        const listTag =
          block.data.style === 'unordered'
            ? 'ul'
            : block.data.style === 'ordered'
              ? 'ol'
              : 'div';
        const metaAttrs =
          block.data.style === 'ordered' && block.data.meta?.start
            ? ` start="${block.data.meta.start}" type="${listCounterType(block?.data?.meta?.counterType) || '1'}"`
            : '';
        return block.data.style === 'checklist'
          ? `<div>${renderListItems(block.data.items, 'checklist')}</div>`
          : `<${listTag}${metaAttrs} style="margin-left: 1.5rem; padding: 0;">
              ${renderListItems(block.data.items, block.data.style)}
            </${listTag}>`;
      }
      case 'table': {
        const rows = block.data.content.map(
          (row) =>
            `<tr style="border-bottom: 1px solid #ddd;">
              ${row.map((cell) => `<td style="padding: 0.5rem; border-right: 1px solid #ddd;">${cell || ''}</td>`).join('')}
            </tr>`,
        );
        return `<table style="border-collapse: collapse; width: 100%; margin: 1rem 0; font-size: 1rem; text-align: left;">
                  ${rows.join('')}
                </table>`;
      }
      case 'delimiter':
        return `<hr style="border: none; height: 1px; background-color: #ddd; margin: 2rem 0;" />`;

      case 'warning':
        return `<div style="background-color: #fff3cd; color: #856404; padding: 1rem; border: 1px solid #ffeeba; border-radius: 4px; margin: 1rem 0;">
                  <strong>${block.data.title}</strong>
                  <p style="margin: 0.5rem 0;">${block.data.message}</p>
                </div>`;

      case 'raw':
        return `<div style="font-family: monospace; background: #f7f7f7; padding: 1rem; border-radius: 4px; margin: 1rem 0;">
                  ${block.data.html}
                </div>`;

      case 'image':
        return `<figure style="text-align: center; margin: 1rem 0;">
                  <img src="${block.data.file.url}" alt="${block.data.caption}" style="max-width: 100%; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);" />
                  <figcaption style="color: #666; font-size: 0.9rem; margin-top: 0.5rem;">${block.data.caption}</figcaption>
                </figure>`;

      default:
        return '';
    }
  };

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 1rem; color: #444;">
      ${jsonData?.blocks?.map(blockToHTML).join('')}
    </div>`;
}

function listCounterType(type) {
  switch (type) {
    case 'upper-alpha':
      return 'A';
    case 'lower-alpha':
      return 'a';
    case 'upper-roman':
      return 'I';
    case 'lower-roman':
      return 'i';
    default:
      return '1';
  }
}
