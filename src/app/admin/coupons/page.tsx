import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { CouponManagementTable } from "@/components/coupon-management-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function CouponsManagementPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { created_at: "desc" },
    include: {
      _count: {
        select: { used_by: true },
      },
    },
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-balance">Gestión de Cupones</h1>
          <p className="text-muted-foreground mt-2">Crear y gestionar cupones de descuento</p>
        </div>
        <Button asChild>
          <Link href="/admin/coupons/new">
            <Plus className="w-4 h-4 mr-2" />
            Crear Cupón
          </Link>
        </Button>
      </div>

      <CouponManagementTable coupons={coupons} />
    </div>
  )
}
