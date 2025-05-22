import { db } from "../config/db";
import { akuns } from "../models/akun";
import { faker } from "@faker-js/faker";

async function seed(numCustomers = 10, numSuppliers = 25) {
  // First check if accounts already exist
  const existingAkuns = await db.select({ email: akuns.email }).from(akuns);
  const existingEmails = new Set(existingAkuns.map((akun) => akun.email));

  // Generate unique accounts
  const akunsData = [];

  // Generate customer accounts
  let customersCreated = 0;
  while (customersCreated < numCustomers) {
    const email = faker.internet.email().toLowerCase();

    // Only add if email doesn't already exist
    if (!existingEmails.has(email)) {
      akunsData.push({
        name: faker.person.fullName(),
        email: email,
        phone:
          faker.string.numeric(3) +
          "-" +
          faker.string.numeric(3) +
          "-" +
          faker.string.numeric(4),
        address:
          faker.location.streetAddress() +
          ", " +
          faker.location.city() +
          ", " +
          faker.location.state(),
        type: "customer" as const,
      });
      existingEmails.add(email);
      customersCreated++;
    }
  }

  // Generate supplier accounts
  let suppliersCreated = 0;
  while (suppliersCreated < numSuppliers) {
    const email = faker.internet.email().toLowerCase();

    // Only add if email doesn't already exist
    if (!existingEmails.has(email)) {
      akunsData.push({
        name: faker.company.name(),
        email: email,
        phone:
          faker.string.numeric(3) +
          "-" +
          faker.string.numeric(3) +
          "-" +
          faker.string.numeric(4),
        address:
          faker.location.streetAddress() +
          ", " +
          faker.location.city() +
          ", " +
          faker.location.state(),
        type: "supplier" as const,
      });
      existingEmails.add(email);
      suppliersCreated++;
    }
  }

  if (akunsData.length > 0) {
    await db.insert(akuns).values(akunsData);
    console.log(
      `${customersCreated} customers and ${suppliersCreated} suppliers seeded successfully`
    );
  } else {
    console.log("No new accounts to seed");
  }
}

// You can change the number of customers and suppliers to generate here
// seed(numCustomers, numSuppliers)
seed(10, 25).then(() => {
  console.log("Seeder completed");
  process.exit();
});
