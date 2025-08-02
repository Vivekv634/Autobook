import { ButtonHTMLAttributes } from "react";
import { Button } from "../ui/button";

interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  loading: boolean;
}

export default function ButtonLoader({
  label,
  loading,
  ...rest
}: ButtonLoaderProps) {
  return (
    <Button {...rest} className="cursor-pointer disabled:cursor-not-allowed">
      <span className="font-semibold">{loading ? "Loading..." : label}</span>
    </Button>
  );
}
