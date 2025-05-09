import { db } from "../config/db";
import { categories } from "../models/categories";

async function seed() {
  const categoriess = [
    {
      name: "Electronics",
      description: "Devices and gadgets",
    },
    {
      name: "Books",
      description: "Literature and educational materials",
    },
    {
      name: "Clothing",
      description: "Apparel and accessories",
    },
    {
      name: "Home & Kitchen",
      description: "Household items and kitchenware",
    },
    {
      name: "Sports & Outdoors",
      description: "Sporting goods and outdoor equipment",
    },
    {
      name: "Toys & Games",
      description: "Playthings and games for children",
    },
  ];
  await db.insert(categories).values(categoriess);
  console.log("Categories seeded successfully");
}
seed().then(() => {
  console.log("Seeder completed");
  process.exit();
});
