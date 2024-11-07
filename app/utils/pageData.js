import { Hash, Star, Trash2, Clock4, StickyNote, Book } from 'lucide-react';
import {
  IconBrandGithub,
  IconHome,
  IconTool,
  IconUsers,
  IconWand,
} from '@tabler/icons-react';
export const pages = [
  {
    label: 'Notes',
    id: 'notes',
    address: '/dashboard/notes',
    icon: <StickyNote className="h-5 my-auto mx-1" />,
  },
  {
    label: 'Notebooks',
    id: 'notebooks',
    address: '/dashboard/notebooks',
    icon: <Book className="h-5 my-auto mx-1" />,
  },
  {
    label: 'Favorites',
    id: 'favorites',
    address: '/dashboard/favorites',
    icon: <Star className="h-5 my-auto mx-1" />,
  },
  {
    label: 'Tags',
    id: 'tags',
    address: '/dashboard/tags',
    icon: <Hash className="h-5 my-auto mx-1" />,
  },
  {
    label: 'Auto Note',
    id: 'auto-note',
    address: '/dashboard/auto-note',
    icon: <Clock4 className="h-5 my-auto mx-1" />,
  },
  {
    label: 'Trash',
    id: 'trash',
    address: '/dashboard/trash',
    icon: <Trash2 className="h-5 my-auto mx-1" />,
  },
];
export const themes = {
  dark: {
    background: '20 14.3% 4.1%',
    foreground: '60 9.1% 77.8%',
    card: '20 14.3% 4.1%',
    'card-foreground': '60 9.1% 77.8%',
    popover: '20 14.3% 4.1%',
    'popover-foreground': '60 9.1% 77.8%',
    primary: '60 9.1% 77.8%',
    'primary-foreground': '24 9.8% 10%',
    secondary: '12 6.5% 15.1%',
    'secondary-foreground': '60 9.1% 97.8%',
    muted: '12 6.5% 15.1%',
    'muted-foreground': '24 5.4% 63.9%',
    accent: '12 6.5% 15.1%',
    'accent-foreground': '60 9.1% 97.8%',
    destructive: '0 62.8% 30.6%',
    radius: '0.5rem',
    'destructive-foreground': '60 9.1% 97.8%',
    border: '12 6.5% 15.1%',
    input: '12 6.5% 15.1%',
    ring: '24 5.7% 82.9%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  green: {
    radius: '0.5rem',
    background: '20 14.3% 4.1%',
    foreground: '0 0% 95%',
    card: '24 9.8% 10%',
    'card-foreground': '0 0% 95%',
    popover: '0 0% 9%',
    'popover-foreground': '0 0% 95%',
    primary: '142.1 70.6% 45.3%',
    'primary-foreground': '144.9 80.4% 10%',
    secondary: '240 3.7% 15.9%',
    'secondary-foreground': '0 0% 98%',
    muted: '0 0% 15%',
    'muted-foreground': '240 5% 64.9%',
    accent: '12 6.5% 15.1%',
    'accent-foreground': '0 0% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '0 85.7% 97.3%',
    border: '240 3.7% 15.9%',
    input: '240 3.7% 15.9%',
    ring: '142.4 71.8% 29.2%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  gray: {
    background: '224 71.4% 4.1%',
    foreground: '210 20% 98%',
    card: '224 71.4% 4.1%',
    'card-foreground': '210 20% 98%',
    popover: '224 71.4% 4.1%',
    'popover-foreground': '210 20% 98%',
    primary: '210 20% 98%',
    'primary-foreground': '220.9 39.3% 11%',
    secondary: '215 27.9% 16.9%',
    'secondary-foreground': '210 20% 98%',
    muted: '215 27.9% 16.9%',
    'muted-foreground': '217.9 10.6% 64.9%',
    accent: '215 27.9% 16.9%',
    'accent-foreground': '210 20% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '210 20% 98%',
    border: '215 27.9% 16.9%',
    input: '215 27.9% 16.9%',
    ring: '216 12.2% 83.9%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  red: {
    background: '0 0% 3.9%',
    foreground: '0 0% 98%',
    card: '0 0% 3.9%',
    'card-foreground': '0 0% 98%',
    popover: '0 0% 3.9%',
    'popover-foreground': '0 0% 98%',
    primary: '0 72.2% 50.6%',
    'primary-foreground': '0 85.7% 97.3%',
    secondary: '0 0% 14.9%',
    'secondary-foreground': '0 0% 98%',
    muted: '0 0% 14.9%',
    'muted-foreground': '0 0% 63.9%',
    accent: '0 0% 14.9%',
    'accent-foreground': '0 0% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '0 0% 98%',
    border: '0 0% 14.9%',
    input: '0 0% 14.9%',
    ring: '0 72.2% 50.6%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  rose: {
    background: '20 14.3% 4.1%',
    foreground: '0 0% 95%',
    card: '24 9.8% 10%',
    'card-foreground': '0 0% 95%',
    popover: '0 0% 9%',
    'popover-foreground': '0 0% 95%',
    primary: '346.8 77.2% 49.8%',
    'primary-foreground': '355.7 100% 97.3%',
    secondary: '240 3.7% 15.9%',
    'secondary-foreground': '0 0% 98%',
    muted: '0 0% 15%',
    'muted-foreground': '240 5% 64.9%',
    accent: '12 6.5% 15.1%',
    'accent-foreground': '0 0% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '0 85.7% 97.3%',
    border: '240 3.7% 15.9%',
    input: '240 3.7% 15.9%',
    ring: '346.8 77.2% 49.8%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  orange: {
    background: '20 14.3% 4.1%',
    foreground: '60 9.1% 97.8%',
    card: '20 14.3% 4.1%',
    'card-foreground': '60 9.1% 97.8%',
    popover: '20 14.3% 4.1%',
    'popover-foreground': '60 9.1% 97.8%',
    primary: '20.5 90.2% 48.2%',
    'primary-foreground': '60 9.1% 97.8%',
    secondary: '12 6.5% 15.1%',
    'secondary-foreground': '60 9.1% 97.8%',
    muted: '12 6.5% 15.1%',
    'muted-foreground': '24 5.4% 63.9%',
    accent: '12 6.5% 15.1%',
    'accent-foreground': '60 9.1% 97.8%',
    destructive: '0 72.2% 50.6%',
    'destructive-foreground': '60 9.1% 97.8%',
    border: '12 6.5% 15.1%',
    input: '12 6.5% 15.1%',
    ring: '20.5 90.2% 48.2%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  blue: {
    background: '222.2 84% 4.9%',
    foreground: '210 40% 98%',
    card: '222.2 84% 4.9%',
    'card-foreground': '210 40% 98%',
    popover: '222.2 84% 4.9%',
    'popover-foreground': '210 40% 98%',
    primary: '217.2 91.2% 59.8%',
    'primary-foreground': '222.2 47.4% 11.2%',
    secondary: '217.2 32.6% 17.5%',
    'secondary-foreground': '210 40% 98%',
    muted: '217.2 32.6% 17.5%',
    'muted-foreground': '215 20.2% 65.1%',
    accent: '217.2 32.6% 17.5%',
    'accent-foreground': '210 40% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '210 40% 98%',
    border: '217.2 32.6% 17.5%',
    input: '217.2 32.6% 17.5%',
    ring: '224.3 76.3% 48%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  yellow: {
    background: '20 14.3% 4.1%',
    foreground: '60 9.1% 97.8%',
    card: '20 14.3% 4.1%',
    'card-foreground': '60 9.1% 97.8%',
    popover: '20 14.3% 4.1%',
    'popover-foreground': '60 9.1% 97.8%',
    primary: '47.9 95.8% 53.1%',
    'primary-foreground': '26 83.3% 14.1%',
    secondary: '12 6.5% 15.1%',
    'secondary-foreground': '60 9.1% 97.8%',
    muted: '12 6.5% 15.1%',
    'muted-foreground': '24 5.4% 63.9%',
    accent: '12 6.5% 15.1%',
    'accent-foreground': '60 9.1% 97.8%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '60 9.1% 97.8%',
    border: '12 6.5% 15.1%',
    input: '12 6.5% 15.1%',
    ring: '35.5 91.7% 32.9%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
  violet: {
    background: '224 71.4% 4.1%',
    foreground: '210 20% 98%',
    card: '224 71.4% 4.1%',
    'card-foreground': '210 20% 98%',
    popover: '224 71.4% 4.1%',
    'popover-foreground': '210 20% 98%',
    primary: '263.4 70% 50.4%',
    'primary-foreground': '210 20% 98%',
    secondary: '215 27.9% 16.9%',
    'secondary-foreground': '210 20% 98%',
    muted: '215 27.9% 16.9%',
    'muted-foreground': '217.9 10.6% 64.9%',
    accent: '215 27.9% 16.9%',
    'accent-foreground': '210 20% 98%',
    destructive: '0 62.8% 30.6%',
    'destructive-foreground': '210 20% 98%',
    border: '215 27.9% 16.9%',
    input: '215 27.9% 16.9%',
    ring: '263.4 70% 50.4%',
    'chart-1': '220 70% 50%',
    'chart-2': '160 60% 45%',
    'chart-3': '30 80% 55%',
    'chart-4': '280 65% 60%',
    'chart-5': '340 75% 55%',
  },
};

export const themeColors = {
  dark: 'bg-neutral-800',
  red: 'bg-red-500',
  green: 'bg-green-500',
  rose: 'bg-rose-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  violet: 'bg-violet-500',
  gray: 'bg-gray-500',
  blue: 'bg-blue-500',
};

export const bgThemeColors = {
  dark: 'bg-[#0C0A09]',
  red: 'bg-[#0A0A0A]',
  green: 'bg-[#0C0A09]',
  rose: 'bg-[#0C0A09]',
  orange: 'bg-[#0C0A09]',
  yellow: 'bg-[#0C0A09]',
  violet: 'bg-[#030712]',
  gray: 'bg-[#030712]',
  blue: 'bg-[#020817]',
};

export const floatingDockLinks = [
  {
    title: 'Home',
    icon: (
      <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: '#home',
  },

  {
    title: 'Features',
    icon: (
      <IconWand className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: '#features',
  },
  {
    title: 'How it works?',
    icon: (
      <IconTool className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: '#autoNoteWorking',
  },
  {
    title: 'Why choose us?',
    icon: (
      <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: '#whyChooseAutoBook',
  },
  {
    title: 'GitHub',
    icon: (
      <IconBrandGithub className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: '#githubInfo',
  },
];

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Cross-Platform Accessibility
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        AutoBook is designed as a PWA, making it accessible across devices with
        a responsive, user-friendly interface.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        AutoNote Scheduling
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Automate your note creation based on time intervals to save time and
        streamline your workflow.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Instant Notifications
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Receive emails and push notifications every time a new note is
        generated.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Intelligent Templates
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Use and customize templates tailored to your needs to standardize
        information capture.
      </p>
    </div>
  );
};

export const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: 'md:col-span-2',
    thumbnail:
      'https://www.shutterstock.com/image-vector/crossplatform-development-abstract-concept-vector-600nw-2376330895.jpg',
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: 'col-span-1',
    thumbnail:
      'https://www.shutterstock.com/image-vector/planning-important-appointments-scheduling-activities-600nw-2434197807.jpg',
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: 'col-span-1',
    thumbnail:
      'https://images.unsplash.com/photo-1643845892686-30c241c3938c?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: 'md:col-span-2',
    thumbnail:
      'https://images.unsplash.com/photo-1716363340859-e2a0ab1396a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];
export const timeLineData = [
  {
    title: 'Step 1',
    content: (
      <div>
        <h2 className="text-neutral-800 dark:text-neutral-200 text-lg md:text-xl lg:text-2xl font-normal mb-8">
          Choose or Customize Your Template: Select from a range of note
          templates designed for various use cases, or create your own.
        </h2>
      </div>
    ),
  },
  {
    title: 'Step 2',
    content: (
      <div>
        <h2 className="text-neutral-800 dark:text-neutral-200 text-lg md:text-xl lg:text-2xl font-normal mb-8">
          Set Your Schedule: Choose a frequency—hourly, daily, or weekly—and let
          AutoBook handle the rest.
        </h2>
      </div>
    ),
  },
  {
    title: 'Step 3',
    content: (
      <div>
        <h2 className="text-neutral-800 dark:text-neutral-200 text-lg md:text-xl lg:text-2xl font-normal mb-4">
          Get Notified and Access Your Notes: Receive instant notifications and
          view your organized notes anytime.
        </h2>
      </div>
    ),
  },
];
export const whyChooseUsCards = [
  {
    title:
      'Efficiency: Reduce time spent on repetitive note-taking tasks with automated scheduling.',
    src: 'https://images.unsplash.com/photo-1544819667-9bfc1de23d4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title:
      'Reliability: AutoBook’s notifications ensure you’re always in the loop with real-time updates.',
    src: 'https://plus.unsplash.com/premium_photo-1682309526815-efe5d6225117?q=80&w=2112&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title:
      'Customization: Tailor templates and notifications to fit your unique needs.',
    src: 'https://plus.unsplash.com/premium_photo-1719933739393-6086c1bfa4cc?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    title:
      'Fast and Lightweight: Optimized as a PWA for quick loading and offline access.',
    src: 'https://plus.unsplash.com/premium_photo-1673460448921-9126847f12b8?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];
