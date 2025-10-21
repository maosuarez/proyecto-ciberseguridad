"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils/format"
import { deleteProduct, toggleProductAvailability } from "@/app/actions/products"
import type { Product } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"

interface ProductManagementTableProps {
  products: Product[]
}

export function ProductManagementTable({ products }: ProductManagementTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (productId: string) => {
    setDeletingId(productId)
    try {
      await deleteProduct(productId)
      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleAvailability = async (productId: string, currentAvailability: boolean) => {
    try {
      await toggleProductAvailability(productId, !currentAvailability)
      router.refresh()
    } catch (error) {
      console.error("Error toggling availability:", error)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No hay productos creados aún.</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border border-amber-200">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-amber-50/50">
            <TableHead className="w-20">Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Disponible</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="hover:bg-amber-50/50">
              <TableCell>
                <div className="relative w-12 h-12 rounded-md overflow-hidden bg-amber-50">
                  <Image
                    src={product.image_url || "/placeholder.svg?height=48&width=48&query=arepa"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>
                {product.category ? (
                  <Badge variant="outline" className="border-amber-200">
                    {product.category}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">Sin categoría</span>
                )}
              </TableCell>
              <TableCell className="font-semibold text-amber-900">{formatPrice(product.price_in_cents)}</TableCell>
              <TableCell>
                <Switch
                  checked={product.available}
                  onCheckedChange={() => handleToggleAvailability(product.id, product.available)}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon" className="hover:bg-amber-50">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={deletingId === product.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
