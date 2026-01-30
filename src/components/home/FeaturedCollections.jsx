"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

async function fetchCollections() {
  const res = await fetch("/api/collections");
  if (!res.ok) throw new Error("Failed to fetch");
  const data = await res.json();
  return data.data || data;
}

function CollectionCard({ collection, className = "", placeholder = false }) {
  const { name, slug, image } = collection || {};
  const href = placeholder ? "/collections" : `/collection/${slug}`;
  return (
    <Link
      href={href}
      className={`group relative block h-full min-h-0 overflow-hidden rounded-xl bg-[var(--color-bg-cream)] shadow-sm transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-heading-gold)] focus:ring-offset-2 ${className}`}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-cream)] via-[var(--color-heading-gold)]/20 to-[var(--color-bg-cream)]"
          aria-hidden
        />
      )}
      {/* Bottom overlay – white text on dark strip like reference */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/50 to-transparent"
        aria-hidden
      />
      <span className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10 text-center text-sm font-bold uppercase tracking-[0.15em] text-white drop-shadow-md sm:pb-5 sm:pt-12 sm:text-base md:text-lg">
        {placeholder ? "View all" : name}
      </span>
    </Link>
  );
}

export function FeaturedCollections() {
  const { data: collections, isLoading, error } = useQuery({
    queryKey: ["collections"],
    queryFn: fetchCollections,
  });

  if (isLoading) {
    return (
      <div className="py-12 text-center text-[var(--color-primary-dark)]/70">
        Loading collections...
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-12 text-center text-red-600">
        Unable to load collections.
      </div>
    );
  }
  if (!collections?.length) {
    return (
      <div className="py-12 text-center text-[var(--color-primary-dark)]/70">
        No collections yet.
      </div>
    );
  }

  const raw = collections.slice(0, 5);
  const placeholderItem = { _id: "placeholder", name: "View all", slug: "", image: null };
  const items = Array.from({ length: 5 }, (_, i) => raw[i] ?? { ...placeholderItem, _id: `placeholder-${i}` });
  const isPlaceholder = (item) => item._id.startsWith("placeholder");

  return (
    <div className="mx-auto max-w-7xl">
      {/* Section title & subtitle */}
      <div className="mb-8 text-center sm:mb-10 md:mb-12">
        <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-[var(--color-heading-gold)] sm:text-3xl md:text-4xl">
          Shop by Category
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--color-primary-dark)]/70 sm:mt-4 sm:text-base">
          Stay ahead of the style curve with our latest arrivals.
        </p>
      </div>

      {/* Same as image: left 2 cards, center 1 full-height, right 2 cards; center column wider */}
      <div className="grid grid-cols-1 gap-4 sm:min-h-[500px] sm:grid-cols-[1fr_1.25fr_1fr] sm:grid-rows-2 sm:gap-5 md:gap-6">
        {/* Left grid – top card */}
        <CollectionCard
          collection={items[0]}
          key={items[0]._id}
          className="min-h-[220px] sm:col-start-1 sm:row-start-1 sm:min-h-0"
          placeholder={isPlaceholder(items[0])}
        />
        {/* Left grid – bottom card */}
        <CollectionCard
          collection={items[1]}
          key={items[1]._id}
          className="min-h-[220px] sm:col-start-1 sm:row-start-2 sm:min-h-0"
          placeholder={isPlaceholder(items[1])}
        />
        {/* Center grid – single full-height card */}
        <CollectionCard
          collection={items[2]}
          key={items[2]._id}
          className="min-h-[360px] sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:min-h-0"
          placeholder={isPlaceholder(items[2])}
        />
        {/* Right grid – top card */}
        <CollectionCard
          collection={items[3]}
          key={items[3]._id}
          className="min-h-[220px] sm:col-start-3 sm:row-start-1 sm:min-h-0"
          placeholder={isPlaceholder(items[3])}
        />
        {/* Right grid – bottom card */}
        <CollectionCard
          collection={items[4]}
          key={items[4]._id}
          className="min-h-[220px] sm:col-start-3 sm:row-start-2 sm:min-h-0"
          placeholder={isPlaceholder(items[4])}
        />
      </div>

      {/* View all collection button – same width as cards grid above */}
      <div className="mt-10 w-full sm:mt-12 md:mt-14">
        <Link
          href="/collections"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-heading-gold)] px-6 py-3.5 font-semibold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:bg-[var(--color-heading-gold)]/90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--color-heading-gold)] focus:ring-offset-2"
        >
          View all collection
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
