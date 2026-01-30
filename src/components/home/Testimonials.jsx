"use client";

const testimonials = [
  { name: "Ayesha K.", city: "Lahore", text: "Beautiful fabric and perfect fit. Will order again.", rating: 5 },
  { name: "Fatima R.", city: "Karachi", text: "Premium quality lawn. Fast delivery.", rating: 5 },
  { name: "Zainab M.", city: "Islamabad", text: "Elegant collection. Very satisfied.", rating: 4 },
];

export function Testimonials() {
  return (
    <div className="overflow-hidden rounded-lg bg-[var(--color-bg-cream)]/70 px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex gap-4 overflow-x-auto pb-2 sm:gap-8 [-webkit-overflow-scrolling:touch]">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="min-w-[260px] flex-shrink-0 rounded-lg border border-[var(--color-primary-dark)]/10 bg-white p-4 sm:min-w-[280px] sm:p-6"
          >
            <p className="text-[var(--color-primary-dark)]">&ldquo;{t.text}&rdquo;</p>
            <p className="mt-2 text-sm font-medium text-[var(--color-primary-dark)]">{t.name}, {t.city}</p>
            <p className="text-sm text-[var(--color-accent-gold)]">{"★".repeat(t.rating)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
