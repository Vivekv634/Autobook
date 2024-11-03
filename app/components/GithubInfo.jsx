import { Button } from '@/components/ui/button';
import { GithubIcon, Mail } from 'lucide-react';
import Link from 'next/link';

export default function GithubInfo() {
  return (
    <div className="h-dvh w-full pt-[26rem] md:pt-80 md:h-[40rem]">
      <h2 className="md:text-4xl text-3xl font-bold text-center text-white">
        Have Ideas? <br className="hidden md:block" /> Help Shape AutoBook’s
        Future!
      </h2>
      <p className="py-3 text-center text-lg max-w-2xl mx-auto">
        We value your feedback and contributions. Join us on GitHub to improve
        AutoBook, suggest new features, or report bugs.
      </p>
      <div className="flex justify-center gap-2">
        <Button asChild>
          <Link
            href="https://www.github.com/Vivekv634/Autobook"
            target="_blank"
          >
            <GithubIcon />
            Github
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="mailto:vaishvivek634@gmail.com" target="_blank">
            <Mail />
            Email me
          </Link>
        </Button>
      </div>
    </div>
  );
}
