import { SearchResults } from "@/components/search/SearchResults";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
  const params = typeof searchParams?.then === "function" ? await searchParams : searchParams;
  const q = typeof params?.q === "string" ? params.q : "";
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-4 text-xl font-bold text-[var(--color-primary-dark)] sm:mb-6 sm:text-2xl">
        Search {q ? `for "${q}"` : ""}
      </h1>
      <SearchResults query={q} />
    </div>
  );
}
