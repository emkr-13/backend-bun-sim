import { db } from "../config/db";
import { categories } from "../models/categories";
import { faker } from "@faker-js/faker";

async function seed(numCategories = 12) {
  // First check if categories already exist
  const existingCategories = await db
    .select({ name: categories.name })
    .from(categories);
  const existingNames = new Set(existingCategories.map((cat) => cat.name));

  // Generate unique categories
  const categoriess = [];
  while (categoriess.length < numCategories) {
    const name = faker.commerce.department();
    // Only add if name doesn't already exist
    if (!existingNames.has(name)) {
      categoriess.push({
        name,
        description: faker.commerce.productDescription(),
      });
      existingNames.add(name);
    }
  }

  if (categoriess.length > 0) {
    await db.insert(categories).values(categoriess);
    console.log(`${categoriess.length} categories seeded successfully`);
  } else {
    console.log("No new categories to seed");
  }
}

seed(12).then(() => {
  console.log("Seeder completed");
  process.exit();
});
