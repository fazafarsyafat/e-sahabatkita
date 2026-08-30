import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // 1. Cek apakah Super Admin sudah ada
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "SUPER_ADMIN" }
    });

    if (existingAdmin) {
      return NextResponse.json({ message: "Super Admin sudah ada!", email: existingAdmin.email });
    }

    // 2. Buat password yang diacak
    const hashedPassword = await bcrypt.hash("SahabatPMII2026", 10);

    // 3. Buat akun Super Admin pertama
    const admin = await prisma.user.create({
      data: {
        name: "Administrator Pusat",
        email: "admin@pmii.or.id",
        password: hashedPassword,
        role: "SUPER_ADMIN",
      }
    });

    return NextResponse.json({ 
      message: "Sukses membuat Super Admin!", 
      email: admin.email,
      password: "SahabatPMII2026"
    });

  } catch (error) {
    return NextResponse.json({ error: "Gagal membuat admin", details: error }, { status: 500 });
  }
}
