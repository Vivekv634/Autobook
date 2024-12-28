import {
  Comic_Neue,
  Montserrat,
  Nunito,
  Open_Sans,
  Play,
  Poppins,
  Quicksand,
  Roboto,
  Sansita,
  Ubuntu,
} from 'next/font/google';

export const openSans = Open_Sans({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const poppins = Poppins({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const comicNeue = Comic_Neue({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['300', '400', '700'],
});

export const ubuntu = Ubuntu({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['300', '400', '500', '700'],
});

export const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const roboto = Roboto({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

export const nunito = Nunito({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
});

export const play = Play({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const sansita = Sansita({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
});
