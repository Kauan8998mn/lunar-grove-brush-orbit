import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = "md",
  speaking = false,
  className,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  speaking?: boolean;
  className?: string;
}) {
  const dim = { sm: "size-7 text-[10px]", md: "size-9 text-xs", lg: "size-12 text-sm", xl: "size-20 text-xl" }[size];
  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-raised font-semibold text-accent",
        dim,
        speaking && "speaking-ring",
        className,
      )}
    >
      {src ? <img src={src} alt="" className="size-full object-cover" /> : initials(name)}
    </div>
  );
}
