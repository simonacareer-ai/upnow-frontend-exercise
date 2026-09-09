import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-base-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-primary-dark">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                U
              </span>
              <span className="text-lg tracking-tight">UpNow</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">
              Your premium marketplace for rentals, services, and curated
              experiences across the UAE.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link href="/" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/" className="hover:text-primary">Careers</Link></li>
              <li><Link href="/" className="hover:text-primary">Press</Link></li>
              <li><Link href="/" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Resources
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link href="/listings" className="hover:text-primary">Explore</Link></li>
              <li><Link href="/" className="hover:text-primary">Blog</Link></li>
              <li><Link href="/" className="hover:text-primary">Help Centre</Link></li>
              <li><Link href="/" className="hover:text-primary">Guides</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-900">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><Link href="/" className="hover:text-primary">Terms of Service</Link></li>
              <li><Link href="/" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-primary">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-base-200 pt-6 sm:flex-row">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} UpNow. All rights reserved.
          </p>
          <div className="flex gap-4 text-neutral-400">
            <span className="text-xs">Verified listings</span>
            <span className="text-xs">·</span>
            <span className="text-xs">Transparent pricing</span>
            <span className="text-xs">·</span>
            <span className="text-xs">Secure digital lease signing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
