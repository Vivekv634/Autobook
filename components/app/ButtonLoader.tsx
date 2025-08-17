import { ButtonHTMLAttributes, ReactElement } from "react";
import { Button } from "../ui/button";

interface ButtonLoaderProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactElement;
  loading: boolean;
  loadingLabel?: string | ReactElement;
  isIcon?: boolean;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export default function ButtonLoader({
  label,
  loading,
  loadingLabel = "Loading...",
  isIcon = false,
  variant = "default",
  ...rest
}: ButtonLoaderProps) {
  return (
    <Button
      {...rest}
      size={isIcon ? "icon" : "default"}
      className="cursor-pointer disabled:cursor-not-allowed"
      variant={variant}
    >
      <span className="font-semibold">{loading ? loadingLabel : label}</span>
    </Button>
  );
}
