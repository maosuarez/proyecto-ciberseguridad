-- Seed initial products for Arepabuelas de la Esquina
INSERT INTO "Product" (id, name, description, price, image, category, available, "createdAt", "updatedAt")
VALUES
  (gen_random_uuid(), 'Arepa Reina Pepiada', 'Deliciosa arepa rellena con pollo desmenuzado, aguacate, mayonesa y cilantro. Un clásico venezolano que no puede faltar.', 12000, '/placeholder.svg?height=400&width=400', 'Clásicas', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa Pabellón', 'Arepa rellena con carne mechada, caraotas negras, tajadas de plátano maduro y queso rallado. Sabor tradicional en cada bocado.', 15000, '/placeholder.svg?height=400&width=400', 'Clásicas', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa Dominó', 'Combinación perfecta de caraotas negras y queso blanco rallado. Simple pero deliciosa.', 10000, '/placeholder.svg?height=400&width=400', 'Clásicas', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa de Queso', 'Arepa rellena generosamente con queso blanco derretido. Para los amantes del queso.', 9000, '/placeholder.svg?height=400&width=400', 'Clásicas', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa Pelúa', 'Carne mechada con queso amarillo gratinado. Una explosión de sabor.', 14000, '/placeholder.svg?height=400&width=400', 'Especiales', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa Catira', 'Pollo desmenuzado con queso amarillo. Suave y deliciosa.', 13000, '/placeholder.svg?height=400&width=400', 'Especiales', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa Sifrina', 'Pollo, aguacate, queso y tocineta. Para los paladares más exigentes.', 16000, '/placeholder.svg?height=400&width=400', 'Premium', true, NOW(), NOW()),
  (gen_random_uuid(), 'Arepa Llanera', 'Carne asada, queso de mano, aguacate y tomate. Sabor de los llanos.', 17000, '/placeholder.svg?height=400&width=400', 'Premium', true, NOW(), NOW());
