import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt", // Kita gunakan JWT karena menggunakan Credentials Provider
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  pages: {
    signIn: "/login", // Arahkan ke halaman login kustom kita
  },
  providers: [
    CredentialsProvider({
      name: "Email dan Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@pmii.or.id" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // 1. Validasi input
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan kata sandi wajib diisi!");
        }

        // 2. Cari pengguna di database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          throw new Error("Email belum terdaftar atau menggunakan metode login lain.");
        }

        // 3. Bandingkan password dengan bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Kata sandi yang Anda masukkan salah.");
        }

        // 4. Kembalikan data pengguna ke sesi
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Kita lemparkan rolenya agar bisa dibaca di frontend
        };
      }
    })
  ],
  callbacks: {
    // Menyimpan data role ke token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    // Mengirim data dari token ke Session frontend
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  }
};
