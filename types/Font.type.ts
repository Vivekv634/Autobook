import z from "zod";

const fonts = {
  poppins: "Poppins",
  roboto: "Roboto",
  "open-sans": "Open Sans",
  lato: "Lato",
  montserrat: "Montserrat",
};

export const FontEnum = z.enum(Object.keys(fonts) as [keyof typeof fonts]);

export type FontType = z.infer<typeof FontEnum>;
