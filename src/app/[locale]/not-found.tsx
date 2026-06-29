import { Button } from '@/components/ui/Button';

/** 404 shown for unknown routes within a locale (e.g. a bad /work slug). */
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-label uppercase tracking-widest text-accent">404</p>
      <h1 className="mt-3 font-heading text-h1 text-foreground">Page not found</h1>
      <p className="mt-3 max-w-md text-body text-muted-foreground">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Button as="a" href="/" className="mt-8">
        Back to home
      </Button>
    </main>
  );
}
