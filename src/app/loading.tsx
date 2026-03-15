import Container from "@/components/Container";

export default function Loading() {
  return (
    <Container className="py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-3 border-[var(--color-outline)] border-t-[var(--color-primary)] rounded-full animate-spin" />
        <p className="text-[14px] text-[var(--color-on-surface-variant)]">Loading...</p>
      </div>
    </Container>
  );
}
