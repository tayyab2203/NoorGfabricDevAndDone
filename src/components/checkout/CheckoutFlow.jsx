"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const STEPS = ["Auth", "Shipping", "Review", "Confirmation"];

async function fetchCart() {
  const res = await fetch("/api/cart");
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  return data.data || data;
}

async function createOrder(items, shippingAddress) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, shippingAddress }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to place order");
  }
  return res.json();
}

export function CheckoutFlow() {
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Pakistan",
  });
  const [orderResult, setOrderResult] = useState(null);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState(null);

  const { data: cart, isLoading, refetch: refetchCart } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    enabled: status !== "loading" && (step <= 2 || !orderResult),
  });

  const items = cart?.items || [];
  let subtotal = 0;
  items.forEach((i) => {
    const p = i.productId;
    const price = p?.salePrice ?? p?.price ?? 0;
    subtotal += price * (i.quantity || 1);
  });
  const shippingFee = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shippingFee;

  const canProceedStep1 = session || step > 1;
  const canProceedStep2 =
    shippingAddress.fullName &&
    shippingAddress.phone &&
    shippingAddress.street &&
    shippingAddress.city &&
    shippingAddress.country;

  async function handlePlaceOrder() {
    if (items.length === 0) return;
    setPlacing(true);
    setPlaceError(null);
    try {
      const orderItems = items.map((i) => ({
        productId: i.productId?._id || i.productId,
        variantSKU: i.variantSKU,
        quantity: i.quantity,
      }));
      const result = await createOrder(orderItems, shippingAddress);
      setOrderResult(result?.data ?? result);
      setStep(4);
      refetchCart();
    } catch (e) {
      setPlaceError(e.message);
    } finally {
      setPlacing(false);
    }
  }

  if (status === "loading" || (step === 1 && !session && isLoading)) {
    return <div className="text-[var(--color-primary-dark)]">Loading...</div>;
  }

  if (step === 4 && orderResult) {
    return (
      <div className="rounded-lg bg-[var(--color-success-sage)]/10 p-8 text-center">
        <h2 className="text-xl font-semibold text-[var(--color-primary-dark)]">Order Placed</h2>
        <p className="mt-2 text-[var(--color-primary-dark)]">Order ID: {orderResult?.orderNumber}</p>
        <p className="mt-2 text-sm text-[var(--color-primary-dark)]/80">You will receive a confirmation email.</p>
        <Link href="/account/orders" className="mt-6 inline-block rounded-md bg-[var(--color-accent-gold)] px-6 py-2 font-medium text-white hover:opacity-90">
          View Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap gap-1 text-xs sm:gap-2 sm:text-sm">
        {STEPS.map((s, i) => (
          <span
            key={s}
            className={i + 1 <= step ? "font-medium text-[var(--color-accent-gold)]" : "text-[var(--color-primary-dark)]/50"}
          >
            {i + 1}. {s}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
          <h3 className="font-semibold text-[var(--color-primary-dark)]">Authentication</h3>
          {session ? (
            <p className="mt-2 text-[var(--color-primary-dark)]">Signed in as {session.user.email}. You can continue as guest by proceeding (guest checkout).</p>
          ) : (
            <p className="mt-2 text-[var(--color-primary-dark)]">Sign in for a faster checkout, or continue as guest.</p>
          )}
          {!session && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/checkout" })}
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent-gold)] px-4 py-2.5 font-medium text-white hover:opacity-90"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign in with Google
              </button>
              <Link
                href="/login?callbackUrl=/checkout"
                className="rounded-md border border-[var(--color-primary-dark)]/20 px-4 py-2.5 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]"
              >
                Sign in with email
              </Link>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="rounded-md border border-[var(--color-primary-dark)]/20 px-4 py-2 text-[var(--color-primary-dark)] hover:bg-[var(--color-bg-cream)]"
            >
              Continue (Guest or User)
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
          <h3 className="font-semibold text-[var(--color-primary-dark)]">Shipping Address</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full name"
              value={shippingAddress.fullName}
              onChange={(e) => setShippingAddress((s) => ({ ...s, fullName: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={shippingAddress.phone}
              onChange={(e) => setShippingAddress((s) => ({ ...s, phone: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
            />
            <input
              type="text"
              placeholder="Street"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress((s) => ({ ...s, street: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)] sm:col-span-2"
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress((s) => ({ ...s, city: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
            />
            <input
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress((s) => ({ ...s, state: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
            />
            <input
              type="text"
              placeholder="Postal code"
              value={shippingAddress.postalCode}
              onChange={(e) => setShippingAddress((s) => ({ ...s, postalCode: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress((s) => ({ ...s, country: e.target.value }))}
              className="rounded border border-[var(--color-primary-dark)]/20 px-3 py-2 text-[var(--color-primary-dark)]"
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep(1)} className="rounded border px-4 py-2 text-[var(--color-primary-dark)]">
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="rounded-md bg-[var(--color-accent-gold)] px-6 py-2 text-white hover:opacity-90 disabled:opacity-50"
            >
              Review Order
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="rounded-lg border border-[var(--color-bg-cream)] bg-white p-4 sm:p-6">
          <h3 className="font-semibold text-[var(--color-primary-dark)]">Review Order</h3>
          <p className="mt-2 text-sm text-[var(--color-primary-dark)]/80">Payment: Cash on Delivery (COD)</p>
          {items.length === 0 ? (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-[var(--color-primary-dark)]">
              <p className="font-medium">Your cart is empty.</p>
              <p className="mt-1 text-sm text-[var(--color-primary-dark)]/80">Add items from the shop to place an order.</p>
              <Link href="/collection/all" className="mt-3 inline-block text-sm font-medium text-[var(--color-accent-gold)] hover:underline">
                View collections
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-4 border-t border-[var(--color-bg-cream)] pt-4">
                <p className="text-[var(--color-primary-dark)]">{shippingAddress.fullName}, {shippingAddress.phone}</p>
                <p className="text-sm text-[var(--color-primary-dark)]/80">
                  {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}, {shippingAddress.country}
                </p>
              </div>
              <ul className="mt-4 space-y-2">
                {items.map((item, i) => {
                  const p = item.productId;
                  const price = p?.salePrice ?? p?.price ?? 0;
                  return (
                    <li key={i} className="flex justify-between text-sm text-[var(--color-primary-dark)]">
                      <span>{p?.name} × {item.quantity}</span>
                      <span>Rs. {price * item.quantity}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 border-t border-[var(--color-bg-cream)] pt-4">
                <p className="flex justify-between text-[var(--color-primary-dark)]">Subtotal: Rs. {subtotal}</p>
                <p className="flex justify-between text-[var(--color-primary-dark)]">Shipping: Rs. {shippingFee}</p>
                <p className="flex justify-between font-semibold text-[var(--color-primary-dark)]">Total: Rs. {total}</p>
              </div>
            </>
          )}
          {placeError && <p className="mt-2 text-sm text-red-600">{placeError}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setStep(2)} className="rounded border px-4 py-2 text-[var(--color-primary-dark)]">
              Back
            </button>
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={placing || items.length === 0}
              className="rounded-md bg-[var(--color-accent-gold)] px-6 py-2 text-white hover:opacity-90 disabled:opacity-50"
            >
              {placing ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
