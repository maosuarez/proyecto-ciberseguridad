import { prisma } from "@/lib/db";

async function main() {
  const products = [
    {
      name: "Arepa Reina Pepiada",
      description:
        "Deliciosa arepa rellena con pollo desmenuzado, aguacate, mayonesa y cilantro. Un clásico venezolano que no puede faltar.",
      price_in_cents: 850,
      image_url: "/uploads/202510091237-foto.jpg",
      category: "Clásicas",
      available: true,
    },
    {
      name: "Arepa Pabellón",
      description:
        "Arepa rellena con carne mechada, caraotas negras, tajadas de plátano maduro y queso rallado. El sabor de Venezuela en cada bocado.",
      price_in_cents: 950,
      image_url: "/uploads/202510091240-foto.jpg",
      category: "Clásicas",
      available: true,
    },
    {
      name: "Arepa Dominó",
      description:
        "Arepa rellena con caraotas negras y queso blanco rallado. Simple, deliciosa y tradicional.",
      price_in_cents: 650,
      image_url: "/uploads/202510091241-foto.jpg",
      category: "Clásicas",
      available: true,
    },
    {
      name: "Arepa Pelúa",
      description:
        "Arepa con carne mechada y queso amarillo gratinado. Una combinación irresistible.",
      price_in_cents: 850,
      image_url: "/uploads/202510091242-foto.jpg",
      category: "Clásicas",
      available: true,
    },
    {
      name: "Arepa de Pernil",
      description:
        "Arepa rellena con jugoso pernil de cerdo marinado, acompañado de ensalada y salsas.",
      price_in_cents: 900,
      image_url: "/uploads/202510091243-foto.jpg",
      category: "Especiales",
      available: true,
    },
    {
      name: "Arepa Catira",
      description:
        "Arepa con pollo desmenuzado y queso amarillo. Una combinación perfecta de sabores.",
      price_in_cents: 800,
      image_url: "/uploads/202510091244-foto.jpg",
      category: "Clásicas",
      available: true,
    },
    {
      name: "Arepa de Camarones",
      description:
        "Arepa gourmet rellena con camarones salteados en salsa de ajo y hierbas frescas.",
      price_in_cents: 1200,
      image_url: "/uploads/202510091245-foto.jpg",
      category: "Gourmet",
      available: true,
    },
    {
      name: "Arepa Vegetariana",
      description:
        "Arepa rellena con vegetales asados, aguacate, queso y salsa de cilantro.",
      price_in_cents: 750,
      image_url: "/uploads/202510091246-foto.jpg",
      category: "Vegetarianas",
      available: true,
    },
    {
      name: "Arepa de Queso",
      description:
        "Arepa sencilla rellena con abundante queso blanco. Perfecta para los amantes del queso.",
      price_in_cents: 550,
      image_url: "/uploads/202510091247-foto.jpg",
      category: "Clásicas",
      available: true,
    },
    {
      name: "Arepa Llanera",
      description:
        "Arepa con carne asada, tomate, aguacate y queso. Sabor de los llanos venezolanos.",
      price_in_cents: 950,
      image_url: "/uploads/202510091248-foto.jpg",
      category: "Especiales",
      available: true,
    },
    {
      name: "Arepa de Perico",
      description:
        "Arepa rellena con huevos revueltos con tomate y cebolla. Perfecta para el desayuno.",
      price_in_cents: 600,
      image_url: "/uploads/202510091249-foto.jpg",
      category: "Desayuno",
      available: true,
    },
    {
      name: "Arepa Sifrina",
      description:
        "Arepa gourmet con pollo, aguacate, queso, tomate y mayonesa especial.",
      price_in_cents: 1000,
      image_url: "/uploads/202510091250-foto.jpg",
      category: "Gourmet",
      available: true,
    },
  ];

  // Limpia la tabla antes de insertar (opcional)
  await prisma.product.deleteMany();
  console.log("🧹 Tabla products limpiada.");

  // Inserta los productos
  await prisma.product.createMany({ data: products });
  console.log("✅ Productos de ejemplo insertados correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error al ejecutar el seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
