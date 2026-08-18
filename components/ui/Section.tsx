import { cn } from "@/lib/utils";
import { Container, type ContainerSize } from "./Container";

export function Section({
  id,
  container = "page",
  className,
  children,
}: {
  id?: string;
  container?: ContainerSize;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("py-12 md:py-20", className)}>
      <Container size={container}>{children}</Container>
    </section>
  );
}
