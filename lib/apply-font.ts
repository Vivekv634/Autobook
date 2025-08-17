import { ThemeTypes } from "@/types/Theme.types";
import {
  architects_daughter,
  dm_sans,
  geist_mono,
  inter,
  open_sans,
  outfit,
  plus_jakarta_sans,
} from "@/public/fonts";

export default function applyFont(theme: ThemeTypes) {
  let font: string = "";
  switch (theme) {
    case "notebook":
      font = architects_daughter.className;
      break;
    case "claymorphism":
      font = plus_jakarta_sans.className;
      break;
    case "mono":
      font = geist_mono.className;
      break;
    case "ocean-breeze":
      font = dm_sans.className;
      break;
    case "supabase":
      font = outfit.className;
      break;
    case "twitter":
      font = open_sans.className;
      break;
    case "notebook":
      font = architects_daughter.className;
      break;
    case "claymorphism":
      font = plus_jakarta_sans.className;
      break;
    case "mono":
      font = geist_mono.className;
      break;
    case "ocean-breeze":
      font = dm_sans.className;
      break;
    case "supabase":
      font = outfit.className;
      break;
    default:
      font = inter.className;
  }
  return font;
}
