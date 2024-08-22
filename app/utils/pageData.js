import { Hash, Star, Trash2, Clock4, StickyNote, Book } from 'lucide-react';
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
