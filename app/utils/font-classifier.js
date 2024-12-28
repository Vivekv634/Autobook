import {
  comicNeue,
  montserrat,
  nunito,
  openSans,
  play,
  poppins,
  quicksand,
  roboto,
  sansita,
  ubuntu,
} from '@/public/fonts';

export default function fontClassifier(userFont) {
  let FONT;
  switch (userFont) {
    case 'ubuntu':
      FONT = ubuntu.className;
      break;
    case 'comicNeue':
      FONT = comicNeue.className;
      break;
    case 'quicksand':
      FONT = quicksand.className;
      break;
    case 'montserrat':
      FONT = montserrat.className;
      break;
    case 'roboto':
      FONT = roboto.className;
      break;
    case 'openSans':
      FONT = openSans.className;
      break;
    case 'nunito':
      FONT = nunito.className;
      break;
    case 'play':
      FONT = play.className;
      break;
    case 'sansita':
      FONT = sansita.className;
      break;
    default:
      FONT = poppins.className;
      break;
  }
  return FONT;
}
