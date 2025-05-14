import { db } from "../config/db";
import { products } from "../models/products";
import { faker } from "@faker-js/faker";
import { categories } from "../models/categories";

async function seedProducts() {
  // First get all category IDs
  const allCategories = await db.select().from(categories);
  if (allCategories.length === 0) {
    throw new Error("No categories found. Please seed categories first.");
  }

  const productsToInsert = Array.from({ length: 30 }, (_, i) => {
    const category = faker.helpers.arrayElement(allCategories);
    const productName = generateProductName(category.name);

    return {
      name: productName,
      description: faker.commerce.productDescription(),
      sku: `SKU-${faker.string.alphanumeric(8).toUpperCase()}`,
      stock: faker.number.int({ min: 0, max: 500 }),
      categoryId: category.id,
      price_sell: faker.commerce.price({ min: 10, max: 1000, dec: 2 }),
      price_cost: faker.commerce.price({
        min: 5,
        max: 800,
        dec: 2,
      }),
    };
  });

  await db.insert(products).values(productsToInsert);
  console.log("✅ 30 products seeded successfully");
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

seedProducts()
  .then(() => {
    console.log("Seeder completed");
    process.exit();
  })
  .catch((error) => {
    console.error("Error seeding products:", error);
    process.exit(1);
  });
