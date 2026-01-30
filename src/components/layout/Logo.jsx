"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="group flex shrink-0 items-center gap-3"
      aria-label="Noor G Fabric - Home"
    >
      <Image
        src="/logo.png"
        alt=""
        width={200}
        height={60}
        className="h-10 w-auto object-contain sm:h-12"
        priority
      />
      <span className="text-lg font-semibold tracking-wide text-[var(--color-primary-dark)] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        Noor G Fabric
      </span>
    </Link>
  );
}
