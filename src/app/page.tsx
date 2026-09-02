"use client";

import dynamic from "next/dynamic";

/**
 * The SMARTCART storefront is a fully interactive client app (cart, admin
 * panel, WhatsApp checkout, localStorage state), so it is mounted on the
 * client only. All persistence happens through /api/* routes backed by
 * PostgreSQL + Drizzle.
 */
const SmartCartApp = dynamic(() => import("@/App"), {
  ssr: false,
  loading: () => <StoreSkeleton />,
});

function StoreSkeleton() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="h-9 w-full bg-emerald-600" />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
          <div className="hidden h-10 flex-1 animate-pulse rounded-xl bg-slate-200 md:block" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
        </div>
        <div className="mt-8 h-64 animate-pulse rounded-3xl bg-slate-200" />
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
        <p className="mt-10 text-center text-sm font-bold uppercase tracking-widest text-slate-400">
          Loading SMARTCART storefront…
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return <SmartCartApp />;
}
