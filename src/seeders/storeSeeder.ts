import { db } from "../config/db";
import { store } from "../models/store";
import { faker } from "@faker-js/faker";

async function seed(numStores = 20) {
  // First check if stores already exist
  const existingStores = await db.select({ name: store.name }).from(store);
  const existingNames = new Set(existingStores.map((s) => s.name));

  // Generate unique stores
  const stores = [];
  while (stores.length < numStores) {
    const name = faker.company.name() + " " + faker.commerce.department();

    // Only add if name doesn't already exist
    if (!existingNames.has(name)) {
      // Generate a phone number with exactly 12 characters (###-###-####)
      const phoneNumber =
        faker.string.numeric(3) +
        "-" +
        faker.string.numeric(3) +
        "-" +
        faker.string.numeric(4);

      stores.push({
        name,
        description: faker.company.catchPhrase(),
        location: faker.location.city() + ", " + faker.location.state(),
        manager: faker.person.fullName(),
        contactInfo: phoneNumber,
        phone: phoneNumber,
        email: faker.internet.email(),
        address:
          faker.location.streetAddress() +
          ", " +
          faker.location.city() +
          ", " +
          faker.location.state() +
          " " +
          faker.location.zipCode(),
      });
      existingNames.add(name);
    }
  }

  if (stores.length > 0) {
    await db.insert(store).values(stores);
    console.log(`${stores.length} stores seeded successfully`);
  } else {
    console.log("No new stores to seed");
  }
}

// You can change the number of stores to generate here
seed(20).then(() => {
  console.log("Seeder completed");
  process.exit();
});
