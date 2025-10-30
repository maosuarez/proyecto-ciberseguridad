import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CouponForm } from "@/components/coupon-form"

export default async function NewCouponPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Crear Nuevo Cupón</h1>
        <p className="text-muted-foreground mt-2">Genera un cupón de descuento para tus clientes</p>
      </div>

      <CouponForm />
    </div>
  )
}
