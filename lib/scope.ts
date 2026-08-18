import { Session } from "next-auth";

/**
 * Helper to generate Prisma where clause based on the user's role and hierarchy.
 * Ini memastikan pengguna hanya bisa mengakses data sesuai dengan scope organisasinya.
 * 
 * Penggunaan:
 * const scopeFilter = getScopeFilter(session);
 * const data = await prisma.berita.findMany({
 *   where: {
 *     ...scopeFilter,
 *     isPublished: true
 *   }
 * });
 */
export function getScopeFilter(session: Session | null) {
  if (!session || !session.user) {
    return { id: "UNAUTHORIZED_SCOPE" }; // Fallback agar tidak membocorkan data jika belum login
  }

  const user = session.user as any;
  const role = user.role;

  switch (role) {
    case "SUPER_ADMIN":
      // PC PMII melihat semua data
      return {};
      
    case "ADMIN_KOMISARIAT":
      // Melihat data semua rayon di bawah komisariatnya, serta data komisariatnya sendiri
      if (!user.komisariatId) return { id: "INVALID_KOMISARIAT" };
      return { komisariatId: user.komisariatId };
      
    case "ADMIN_RAYON":
      // Hanya melihat data rayonnya sendiri
      if (!user.komisariatId || !user.rayonId) return { id: "INVALID_RAYON" };
      return { 
        komisariatId: user.komisariatId, 
        rayonId: user.rayonId 
      };
      
    case "ANGGOTA":
    default:
      // Anggota secara default hanya bisa melihat data milik dirinya sendiri.
      // (Untuk modul publik seperti Berita, sebaiknya tidak pakai filter ini, melainkan dipisah di level API)
      return { userId: user.id };
  }
}
