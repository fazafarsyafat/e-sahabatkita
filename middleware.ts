import { withAuth } from "next-auth/middleware";

// Middleware ini akan memblokir pengguna yang belum login jika mengakses rute tertentu
export default withAuth({
  pages: {
    signIn: "/login", // Jika belum login, tendang ke halaman /login
  },
});

export const config = {
  // Hanya lindungi rute di bawah /dashboard (Panel Administrator)
  matcher: ["/dashboard/:path*"],
};
