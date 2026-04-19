import Nav from '@/components/Nav';

export default function Home() {
  return (
    <>
      <Nav />
      <main className="min-h-screen">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-[var(--color-fg-muted)]">Sections in progress…</p>
        </div>
      </main>
    </>
  );
}
