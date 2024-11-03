import { FocusCards } from '@/components/ui/focus-cards';
import { whyChooseUsCards } from '../utils/pageData';

export default function WhyChooseAutoBook() {
  return (
    <div className="h-dvh w-full mt-20 md:pt-52 lg:mt-20">
      <h2 className="md:text-5xl text-3xl lg:text-6xl font-bold text-center text-white">
        Why choose us?
      </h2>
      <FocusCards cards={whyChooseUsCards} />
    </div>
  );
}
