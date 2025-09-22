import {
  Brain,
  FileText,
  Zap,
  Smartphone,
  Bell,
  Download,
  Shield,
  Camera,
  Mic,
} from "lucide-react";

export const upcomingFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Research Assistant",
    description:
      "Ask questions about your notes and get intelligent answers sourced from your knowledge base.",
    timeline: "Q2 2025",
    status: "In Development",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Mic,
    title: "Voice-to-Text Transcription",
    description:
      "Record meetings and lectures with automatic transcription and speaker identification.",
    timeline: "Q2 2025",
    status: "In Development",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Camera,
    title: "Document OCR & Scanning",
    description:
      "Capture handwritten notes and documents with intelligent text recognition and formatting.",
    timeline: "Q4 2025",
    status: "Planned",
    color: "from-blue-500 to-cyan-500",
  },
];

export const features = [
  {
    icon: FileText,
    title: "Block-based Rich Text Editor",
    description:
      "Modern, fast, and precise editing: headings, lists, checkboxes, inline code, embeds, and drag-and-drop blocks.",
  },
  {
    icon: Zap,
    title: "Autonote Smart Summaries",
    description:
      "One-click summaries and action-item extraction to convert long notes into bite-sized tasks.",
  },
  {
    icon: Bell,
    title: "Email Notifications",
    description:
      "Stay in the loop: get notified when collaborators edit shared notes or when important items are due.",
  },
  {
    icon: Smartphone,
    title: "Installable as a Mobile App",
    description:
      "Fully operable on mobile with a Web App Manifest — installable to your home screen and feels like a native app.",
  },
  {
    icon: Download,
    title: "Export & Integrations",
    description:
      "Export to Markdown, PDF, or plain text. Connect with tools you use via simple integrations or webhooks.",
  },
  {
    icon: Shield,
    title: "Privacy & Control",
    description:
      "Local-first editing, explicit sharing controls, and exportable ownership of your data.",
  },
];

export const steps = [
  {
    number: "01",
    title: "Capture",
    description:
      "Create a note in seconds using the rich text Blocknote editor — type, paste, attach files, or record voice notes.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Auto-Structure",
    description:
      "Autonote scans your content and automatically organizes it into blocks: titles, summaries, action-items, code snippets, and highlights.",
    color: "from-violet-500 to-purple-500",
  },
  {
    number: "03",
    title: "Smart Tagging & Search",
    description:
      "Notes are auto-tagged and indexed so you can search by topic, people, date, or even code language — instant recall without the clutter.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    number: "04",
    title: "Refine & Share",
    description:
      "Edit with full rich-text controls, add collaborators, or export cleanly to PDF/Markdown. Email notifications let teammates know when notes are updated.",
    color: "from-orange-500 to-red-500",
  },
  {
    number: "05",
    title: "Repeat & Learn",
    description:
      "The more you use Autobook, the better Autonote becomes at recognizing your patterns and surfacing the content you need.",
    color: "from-pink-500 to-rose-500",
  },
];
