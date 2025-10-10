export function headingClassName(heading: number) {
  switch (heading) {
    case 1:
      return "text-4xl font-bold";
    case 2:
      return "text-3xl font-bold";
    case 3:
      return "text-2xl font-bold";
    default:
      return "";
  }
}

export function detectLanguage(code: string): string {
  if (!code.trim()) return "text";
  if (/function\s+\w+|const\s+\w+|let\s+\w+|var\s+\w+|console\.log/.test(code))
    return "javascript";
  if (/def\s+\w+|import\s+\w+|print\(/.test(code)) return "python";
  if (/public\s+class|System\.out/.test(code)) return "java";
  if (/{\s*[^}]*}/.test(code) && /color|font|margin/.test(code)) return "css";
  if (/<[^>]*>/.test(code)) return "html";
  if (/SELECT|FROM|WHERE/i.test(code)) return "sql";
  return "text";
}
