import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--color-success-sage)]/20"
      style={{ background: "#5BA383" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/collections"
                  className="text-sm text-white/90 hover:text-white"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-sm text-white/90 hover:text-white"
                >
                  All Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/90 hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-white/90 hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Newsletter
            </h3>
            <p className="mt-2 text-sm text-white/90">
              Get 10% off your first order. Subscribe below.
            </p>
          </div>
          <div>
            <p className="text-sm text-white/80">
              Secure checkout. Cash on delivery available.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/90">
          &copy; {new Date().getFullYear()} Noor G Fabrics. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
