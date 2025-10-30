import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { UserManagementTable } from "@/components/user-management-table"

export default async function UsersManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const users = await prisma.profile.findMany({
    orderBy: { created_at: "desc" },
    select: {
      id: true,
      full_name: true,
      email: true,
      role: true,
      status: true,
      created_at: true,
      avatar_url: true,
    },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Gestión de Usuarios</h1>
        <p className="text-muted-foreground mt-2">Aprobar, rechazar o gestionar usuarios registrados</p>
      </div>

      <UserManagementTable users={users} />
    </div>
  )
}
