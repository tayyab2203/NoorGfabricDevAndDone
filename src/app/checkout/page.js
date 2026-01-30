import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-3xl">
        Checkout
      </h1>
      <CheckoutFlow />
    </div>
  );
}
