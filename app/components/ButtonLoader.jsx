import { Loader2 } from 'lucide-react';

export default function ButtonLoader({ loading, label }) {
  return loading ? (
    <div className="flex items-center">
      <Loader2 className="h-[18px] mr-1 my-auto animate-spin" /> Loading...
    </div>
  ) : (
    label
  );
}
