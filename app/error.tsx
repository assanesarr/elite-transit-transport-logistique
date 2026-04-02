"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
      <p className="text-muted-foreground mt-2">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Réessayer
      </button>
    </div>
  )
}
