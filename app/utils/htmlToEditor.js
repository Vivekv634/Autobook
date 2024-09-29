function processList(node) {
  const listItems = [];
  node.querySelectorAll('li').forEach((li) => {
    const content = li.childNodes[0].nodeValue
      ? li.childNodes[0].nodeValue.trim()
      : '';

    const nestedList = li.querySelector('ul, ol');
    if (nestedList) {
      listItems.push({
        content: content,
        items: processList(nestedList),
      });
    } else {
      listItems.push({ content: content });
    }
  });

  return listItems;
}

function processLinks(node) {
  let text = '';

  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.nodeValue;
    } else if (child.tagName === 'A') {
      text += ` <a href="${child.href}">${child.innerText}</a> `;
    }
  });

  return text.trim();
}

export default function convertHtmlToEditorJs(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const blocks = [];

  doc.body.childNodes.forEach((node) => {
    if (node.tagName === 'P') {
      blocks.push({
        type: 'paragraph',
        data: { text: processLinks(node), alignment: node.style.textAlign },
      });
    } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(node.tagName)) {
      blocks.push({
        type: 'title',
        data: {
          text: node.innerText,
          titleType: node.tagName.toUpperCase(),
          color: node.style.color,
        },
      });
    } else if (
      node.tagName === 'DIV' &&
      node.querySelector('input[type="checkbox"]')
    ) {
      const checkbox = node.querySelector('input[type="checkbox"]');
      const text = processLinks(node);
      const checked = checkbox.checked;

      blocks.push({
        type: 'checklist',
        data: {
          items: [{ text, checked }],
        },
      });
    } else if (node.tagName === 'BLOCKQUOTE') {
      blocks.push({
        type: 'quote',
        data: {
          text: node.innerText,
          caption: '',
        },
      });
    } else if (node.tagName === 'UL' || node.tagName === 'OL') {
      const listItems = processList(node);

      blocks.push({
        type: 'list',
        data: {
          style: node.tagName === 'UL' ? 'unordered' : 'ordered',
          items: listItems,
        },
      });
    } else if (node.tagName === 'TABLE') {
      const tableRows = [];
      node.querySelectorAll('tbody tr').forEach((tr) => {
        const row = [];
        tr.querySelectorAll('td').forEach((td) => {
          row.push(td.innerText);
        });
        tableRows.push(row);
      });

      blocks.push({
        type: 'table',
        data: {
          content: tableRows,
        },
      });
    } else if (node.tagName === 'HR') {
      blocks.push({
        type: 'delimiter',
        data: {},
      });
    } else if (node.tagName === 'DIV' && node.style.border) {
      let type;
      switch (node.style.color) {
        case 'white':
          type = 'dark';
          break;
        case 'rgb(242, 69, 55)':
          type = 'danger';
          break;
        case 'rgb(255, 213, 80)':
          type = 'warning';
          break;
        case 'blue':
          type = 'primary';
          break;
        case 'black':
          type = 'light';
          break;
        case 'green':
          type = 'success';
          break;
      }
      blocks.push({
        type: 'alert',
        data: {
          align: node.style.textAlign,
          type,
          message: node.innerText,
        },
      });
    } else if (node.tagName === 'LABEL') {
      blocks.push({
        type: 'paragraph',
        data: { text: processLinks(node) },
      });
    }
  });

  return blocks;
}
