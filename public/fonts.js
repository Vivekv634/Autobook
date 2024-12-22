import {
  Comic_Neue,
  Montserrat,
  Open_Sans,
  Poppins,
  Quicksand,
  Roboto,
  Ubuntu,
} from "next/font/google";
export const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
});
