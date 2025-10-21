// En src/components/Navbar.tsx

import Link from "next/link"
import { getCurrentUser } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export async function Navbar() {
  const user = await getCurrentUser()

  let cartItemCount = 0
  if (user) {
    const cart = await prisma.cart.findUnique({
      where: { user_id: user.id },
      include: {
        cart_items: {
          select: {
            quantity: true,
          },
        },
      },
    })

    if (cart?.cart_items) {
      cartItemCount = cart.cart_items.reduce((sum, item) => sum + item.quantity, 0)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-amber-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-amber-900">Arepabuelas</span>
            <span className="text-xs text-amber-700 -mt-1">de la esquina</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-amber-50">
                  <ShoppingCart className="h-5 w-5 text-amber-900" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-amber-600 text-xs text-white flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-amber-50">
                    <User className="h-5 w-5 text-amber-900" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      Mis Pedidos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer">
                      Administrar Productos
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/api/auth/signout" className="flex w-full items-center gap-2 cursor-pointer">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
