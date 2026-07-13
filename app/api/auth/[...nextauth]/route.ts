import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Endpoint utama yang akan menangani semua request autentikasi dari frontend
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
