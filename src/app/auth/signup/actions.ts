"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const repeatPassword = formData.get("repeatPassword") as string

  // Validaciones de seguridad
  if (!name || !email || !password || !repeatPassword) {
    return { error: "Todos los campos son requeridos" }
  }

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Email inválido" }
  }

  // Validación de contraseña
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres" }
  }

  if (password !== repeatPassword) {
    return { error: "Las contraseñas no coinciden" }
  }

  // Validación de contraseña fuerte
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
  if (!passwordRegex.test(password)) {
    return { error: "La contraseña debe contener al menos una mayúscula, una minúscula y un número" }
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.profile.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "El email ya está registrado" }
    }

    // Hash de la contraseña con bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    await prisma.profile.create({
      data: {
        full_name:name,
        email,
        password: hashedPassword,
      },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] Error al registrar usuario:", error)
    return { error: "Error al crear la cuenta. Por favor intenta de nuevo." }
  }
}
