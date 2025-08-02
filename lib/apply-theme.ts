export const THEMES: { [key: string]: string } = {
  default: "/themes/default.css",
  "ocean-breeze": "/themes/ocean-breeze.css",
  "amber-minimal": "/themes/amber-minimal.css",
  claude: "/themes/claude.css",
  mono: "/themes/mono.css",
  claymorphism: "/themes/claymorphism.css",
  "modern-minimal": "/themes/modern-minimal.css",
  notebook: "/themes/notebook.css",
  supabase: "/themes/supabase.css",
  twitter: "/themes/twitter.css",
};

export function previewTheme(theme: string) {
  const existing = document.getElementById(
    "theme-style"
  ) as HTMLLinkElement | null;
  const href = THEMES[theme as keyof typeof THEMES];

  if (existing) {
    existing.href = href;
  } else {
    const link = document.createElement("link");
    link.id = "theme-style";
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }
}
