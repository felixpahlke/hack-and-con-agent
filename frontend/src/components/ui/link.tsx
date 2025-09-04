import { cn } from "@/lib/utils";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "@tanstack/react-router";

interface LinkProps extends RouterLinkProps {
  className?: string;
}

export const Link = ({ className, ...props }: LinkProps) => {
  return (
    <RouterLink
      className={cn("text-blue-500 hover:underline", className)}
      {...props}
    />
  );
};
