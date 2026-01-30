import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { Bestsellers } from "@/components/home/Bestsellers";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSignup } from "@/components/home/NewsletterSignup";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      {/* Featured Collections - light / dark */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <FeaturedCollections />
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-[var(--color-bg-cream)] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold text-[var(--color-heading-gold)] sm:mb-8 sm:text-2xl md:text-3xl">
            Bestsellers
          </h2>
          <Bestsellers />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-6 text-xl font-semibold text-[var(--color-heading-gold)] sm:mb-8 sm:text-2xl md:text-3xl">
            What Our Customers Say
          </h2>
          <Testimonials />
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[var(--color-bg-cream)] py-12 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
