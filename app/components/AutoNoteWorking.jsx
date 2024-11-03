import { Timeline } from '@/components/ui/timeline';
import { timeLineData } from '../utils/pageData';

export default function AutoNoteWorking() {
  return (
    <div className="h-dvh w-full mt-20 md:mt-52">
      <h2 className="md:text-5xl text-3xl lg:text-6xl font-bold text-center text-white">
        How it works?
      </h2>
      <Timeline data={timeLineData} />
    </div>
  );
}
