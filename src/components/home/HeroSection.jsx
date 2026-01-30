"use client";

import Link from "next/link";
import { useState } from "react";

// Put your video in public/ e.g. public/hero-video.mp4
const HERO_VIDEO_SRC = "/hero-video.mp4";

export function HeroSection() {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[var(--color-bg-cream)]">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          onCanPlay={() => setVideoReady(true)}
          // poster="/logo.jpeg"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        {/* Dark overlay so text stays readable */}
        <div
          className="absolute inset-0 bg-[var(--color-primary-dark)]/80"
          aria-hidden
        />
      </div>
      {/* Soft gradient overlay */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(196, 167, 71, 0.2), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(91, 163, 131, 0.15), transparent 50%)",
        }}
        aria-hidden
      />
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30 30 60 0 30z' fill='%23333333' fill-opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 sm:py-28 md:py-32 lg:py-40">
        <div className={`mx-auto max-w-3xl text-center transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-90"}`}>
          {/* Decorative line */}
          <div className="mx-auto mb-6 h-px w-16 bg-[var(--color-heading-gold)] sm:mb-8" aria-hidden />
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-heading-gold)] drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
            Premium Cotton & Lawn
          </h1>
          <p className="mt-4 text-xl font-light tracking-wide text-[var(--color-heading-gold)]/95 sm:mt-6 sm:text-2xl md:text-3xl">
            for Everyday Elegance
          </p>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/90 sm:mt-6 sm:text-lg">
            Discover Noor G Fabrics — quality fabrics and timeless pieces for your wardrobe.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row sm:gap-6">
            <Link
              href="/collections"
              className="group relative w-full min-w-[180px] overflow-hidden rounded-sm bg-[var(--color-accent-gold)] px-8 py-3.5 text-center font-medium tracking-wide text-white transition-all duration-300 hover:opacity-95 hover:shadow-lg sm:w-auto"
            >
              <span className="relative z-10">Shop Now</span>
              <span
                className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0"
                aria-hidden
              />
            </Link>
            <Link
              href="/collections"
              className="w-full min-w-[180px] rounded-sm border-2 border-white/50 px-8 py-3.5 text-center font-medium tracking-wide text-white transition-all duration-300 hover:border-[var(--color-accent-gold)] hover:bg-[var(--color-accent-gold)]/20 hover:text-white sm:w-auto"
            >
              Explore Collections
            </Link>
          </div>
          {/* Small trust line */}
          <p className="mt-8 text-sm tracking-wide text-white/70 sm:mt-10">
            Cash on delivery · Secure checkout · Quality assured
          </p>
        </div>
      </div>
      {/* Bottom soft edge */}
      <div
        className="h-12 w-full sm:h-16"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
        aria-hidden
      />
    </section>
  );
}
