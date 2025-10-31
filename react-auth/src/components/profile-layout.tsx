// src/components/profile-layout.tsx
// Gerado a partir do Figma (node 5:129) e adaptado para React + Tailwind

import { useSession } from "../lib/auth";
import { useEffect } from "react";

export default function ProfileLayout() {
  const { data: session, isPending, error } = useSession();

  useEffect(() => {
    console.log("[Profile] Session state changed:", {
      isPending,
      hasSession: !!session,
      hasUser: !!session?.user,
      error,
      cookies: document.cookie,
    });

    if (session?.user) {
      console.log("[Profile] User data:", {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      });
    }
  }, [session, isPending, error]);

  if (isPending) {
    console.log("[Profile] Still loading session...");
    return <div className="flex justify-center items-center h-40 text-zinc-400">Carregando perfil...</div>;
  }

  if (!session?.user) {
    console.error("[Profile] No session found! Cookies:", document.cookie);
    return <div className="flex justify-center items-center h-40 text-zinc-400">Usuário não autenticado.</div>;
  }
  // Avatar SVG fallback
  const DefaultAvatar = (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="32" cy="32" r="32" fill="#F3F4F6" />
      <circle cx="32" cy="28" r="14" fill="#FFD600" />
      <ellipse cx="32" cy="48" rx="16" ry="8" fill="#FFD600" />
      <circle cx="32" cy="28" r="8" fill="#FFF" />
      <ellipse cx="32" cy="48" rx="10" ry="5" fill="#FFF" />
    </svg>
  );
  const user = {
    name: session.user.name || "Usuário",
    email: session.user.email || "",
    avatar: session.user.image || null,
    stats: [
      { value: "1205", label: "金币" },
      { value: "5", label: "优惠券" },
      { value: "268", label: "足迹" },
      { value: "78", label: "关注" },
      { value: "136", label: "收藏" },
    ],
  };

  return (
    <div className="w-full max-w-md mx-auto ">
      <div className="relative rounded-b-3xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(180deg, #FFD600 0%, #FFF9C4 100%)' }}>
        {/* Top icons (placeholders) */}
        <div className="absolute top-4 left-4 flex gap-3">
          <div className="w-7 h-7 bg-white/60 rounded-full flex items-center justify-center shadow">
            <svg width="18" height="18" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-3">
          <div className="w-7 h-7 bg-white/60 rounded-full flex items-center justify-center shadow">
            <svg width="18" height="18" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div className="w-7 h-7 bg-white/60 rounded-full flex items-center justify-center shadow">
            <svg width="18" height="18" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h.01M16 8h.01M8 16h.01M16 16h.01"/></svg>
          </div>
        </div>
        {/* Avatar e nome/email */}
        <div className="flex flex-col items-center pt-10 pb-4">
          <div className="relative w-24 h-24">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-gray-100 flex items-center justify-center">
                {DefaultAvatar}
              </div>
            )}
            <button className="absolute bottom-1 right-1 bg-white/90 rounded-full p-1 shadow">
              <svg width="18" height="18" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
            </button>
          </div>
          <div className="text-lg sm:text-2xl font-bold text-zinc-900 mt-2 text-center">{user.name}</div>
          <div className="text-sm sm:text-base text-zinc-700 mt-1 text-center">{user.email}</div>
        </div>
        {/* Stats */}
        <div className="flex justify-between px-4 pb-4">
          {user.stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-base sm:text-lg font-bold text-zinc-900">{stat.value}</span>
              <span className="text-xs sm:text-sm text-zinc-700 mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
