import { db } from "../config/db";
import { products } from "../models/products";
import { faker } from "@faker-js/faker";
import { categories } from "../models/categories";

async function seedProducts(numProducts = 30) {
  // First get all category IDs
  const allCategories = await db.select().from(categories);
  if (allCategories.length === 0) {
    throw new Error("No categories found. Please seed categories first.");
  }

  // Check for existing products to avoid duplicates
  const existingProducts = await db
    .select({ sku: products.sku })
    .from(products);
  const existingSkus = new Set(existingProducts.map((p) => p.sku));

  const productsToInsert = [];
  let productsCreated = 0;

  while (productsCreated < numProducts) {
    const category = faker.helpers.arrayElement(allCategories);
    const productName = generateProductName(category.name);
    const sku = `SKU-${faker.string.alphanumeric(8).toUpperCase()}`;

    // Only add if SKU doesn't already exist
    if (!existingSkus.has(sku)) {
      // Generate realistic Indonesian prices (in thousands of Rupiah)
      const costPrice = faker.number.int({ min: 5, max: 50 }) * 1000; // 5k - 50k IDR
      const sellPrice = Math.round(
        costPrice * (1 + faker.number.float({ min: 0.1, max: 0.5 }))
      ); // 10-50% markup

      // Select a satuan based on the product category
      const satuan = getSatuanForCategory(category.name);

      // Generate non-zero stock
      const stock = faker.number.int({ min: 10, max: 200 });

      productsToInsert.push({
        name: productName,
        description: faker.commerce.productDescription(),
        sku: sku,
        categoryId: category.id,
        satuan: satuan,
        price_sell: sellPrice.toString(),
        price_cost: costPrice.toString(),
      });

      existingSkus.add(sku);
      productsCreated++;
    }
  }

  if (productsToInsert.length > 0) {
    await db.insert(products).values(productsToInsert);
    console.log(`✅ ${productsToInsert.length} products seeded successfully`);
  } else {
    console.log("No new products to seed");
  }
}

function getSatuanForCategory(categoryName: string): "pcs" | "box" | "kg" {
  switch (categoryName) {
    case "Electronics":
      return "pcs";
    case "Books":
      return "pcs";
    case "Clothing":
      return "pcs";
    case "Home & Kitchen":
      return faker.helpers.arrayElement(["pcs", "box", "kg"]);
    case "Sports & Outdoors":
      return faker.helpers.arrayElement(["pcs", "box"]);
    case "Toys & Games":
      return faker.helpers.arrayElement(["pcs", "box"]);
    default:
      return faker.helpers.arrayElement(["pcs", "box", "kg"]);
  }
}

function generateProductName(categoryName: string): string {
  switch (categoryName) {
    case "Electronics":
      return (
        faker.commerce.productName() +
        " " +
        faker.helpers.arrayElement([
          "Pro",
          "Max",
          "Plus",
          "Lite",
          "X",
          "Series",
        ])
      );
    case "Books":
      return `"${faker.music.songName()}" by ${faker.person.fullName()}`;
    case "Clothing":
      return `${faker.commerce.productAdjective()} ${faker.color.human()} ${faker.commerce.product()}`;
    case "Home & Kitchen":
      return `${faker.commerce.productMaterial()} ${faker.commerce.product()}`;
    case "Sports & Outdoors":
      return `${faker.company.name()} ${faker.commerce.productName()}`;
    case "Toys & Games":
      return `${faker.commerce.productAdjective()} ${faker.commerce.product()} Game`;
    default:
      return faker.commerce.productName();
  }
}

// You can change the number of products to generate here
seedProducts(50)
  .then(() => {
    console.log("Seeder completed");
    process.exit();
  })
  .catch((error) => {
    console.error("Error seeding products:", error);
    process.exit(1);
  });
