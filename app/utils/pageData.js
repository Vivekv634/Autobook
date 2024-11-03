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
export const globeConfig = {
  pointSize: 4,
  globeColor: '#062056',
  showAtmosphere: true,
  atmosphereColor: '#FFFFFF',
  atmosphereAltitude: 0.1,
  emissive: '#062056',
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: 'rgba(255,255,255,0.7)',
  ambientLight: '#38bdf8',
  directionalLeftLight: '#ffffff',
  directionalTopLight: '#ffffff',
  pointLight: '#ffffff',
  arcTime: 800,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.3,
};
export const colors = ['#06b6d4', '#3b82f6', '#6366f1'];
export const sampleArcs = [
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 1,
    startLat: 28.6139,
    startLng: 77.209,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 1,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -1.303396,
    endLng: 36.852443,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 3.139,
    endLng: 101.6869,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 2,
    startLat: -15.785493,
    startLng: -47.909029,
    endLat: 36.162809,
    endLng: -115.119411,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: -33.8688,
    startLng: 151.2093,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: 21.3099,
    startLng: -157.8581,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 3,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: -34.6037,
    startLng: -58.3816,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 4,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 14.5995,
    startLng: 120.9842,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -33.8688,
    endLng: 151.2093,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 5,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: -2.3522,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: -15.432563,
    startLng: 28.315853,
    endLat: 1.094136,
    endLng: -63.34546,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: 37.5665,
    startLng: 126.978,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 6,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 51.5072,
    endLng: -0.1276,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: -19.885592,
    startLng: -43.951191,
    endLat: -15.595412,
    endLng: -56.05918,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: 48.8566,
    startLng: -2.3522,
    endLat: 52.52,
    endLng: 13.405,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 7,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: -8.833221,
    startLng: 13.264837,
    endLat: -33.936138,
    endLng: 18.436529,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: 49.2827,
    startLng: -123.1207,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 8,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: 40.7128,
    endLng: -74.006,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: 51.5072,
    startLng: -0.1276,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: -22.9068,
    endLng: -43.1729,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 9,
    startLat: 1.3521,
    startLng: 103.8198,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.5,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: 28.6139,
    endLng: 77.209,
    arcAlt: 0.7,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 10,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 52.3676,
    endLng: 4.9041,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: 41.9028,
    startLng: 12.4964,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: -6.2088,
    startLng: 106.8456,
    endLat: 31.2304,
    endLng: 121.4737,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 11,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 1.3521,
    endLng: 103.8198,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 37.7749,
    endLng: -122.4194,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: 35.6762,
    startLng: 139.6503,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.2,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 12,
    startLat: 22.3193,
    startLng: 114.1694,
    endLat: 34.0522,
    endLng: -118.2437,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: 52.52,
    startLng: 13.405,
    endLat: 22.3193,
    endLng: 114.1694,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: 11.986597,
    startLng: 8.571831,
    endLat: 35.6762,
    endLng: 139.6503,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 13,
    startLat: -22.9068,
    startLng: -43.1729,
    endLat: -34.6037,
    endLng: -58.3816,
    arcAlt: 0.1,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
  {
    order: 14,
    startLat: -33.936138,
    startLng: 18.436529,
    endLat: 21.395643,
    endLng: 39.883798,
    arcAlt: 0.3,
    color: colors[Math.floor(Math.random() * (colors.length - 1))],
  },
];

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
