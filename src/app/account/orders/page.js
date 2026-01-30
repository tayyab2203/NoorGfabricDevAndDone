import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OrderHistory } from "@/components/account/OrderHistory";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <h1 className="mb-6 text-2xl font-bold text-[var(--color-primary-dark)] sm:mb-8 sm:text-3xl">Order History</h1>
      <OrderHistory />
    </div>
  );
}
