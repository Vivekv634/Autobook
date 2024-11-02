import { useToast } from '@/components/ui/use-toast';

export function useCustomToast() {
  const { toast } = useToast();

  return function showToast({ title, color, description, variant }) {
    let className = '';
    switch (color) {
      case 'dark':
      case 'gray':
        className = 'bg-neutral-700';
        break;
      case 'green':
        className = 'bg-green-700';
        break;

      case 'red':
        className = 'bg-red-600';
        break;

      case 'rose':
        className = 'bg-rose-600';
        break;

      case 'orange':
        className = 'bg-orange-600';
        break;

      case 'blue':
        className = 'bg-blue-600';
        break;

      case 'yellow':
        className = 'bg-yellow-600';
        break;
      case 'violet':
        className = 'bg-violet-700';
        break;

      default:
        break;
    }
    toast({
      title,
      description,
      variant,
      className,
    });
  };
}
