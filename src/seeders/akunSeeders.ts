import e from "express";
import { db } from "../config/db";
import { akuns } from "../models/akun";

async function seed() {
  const akunsData = [
    {
      name: "john_doe",
      email: "john@mail.com",
      phone: "1234567890",
      address: "123 Main St, Springfield",
      type: "customer" as const,
    },
    {
      name: "jane_doe",
      email: "jane@mail.com",
      phone: "0987654321",
      address: "456 Elm St, Springfield",
      type: "supplier" as const,
    },
    {
      name: "mike_smith",
      email: "mike@mail.com",
      phone: "5556667777",
      address: "789 Oak St, Springfield",
      type: "customer" as const,
    },
    {
      name: "sarah_wilson",
      email: "sarah@mail.com",
      phone: "4445556666",
      address: "321 Pine St, Springfield",
      type: "supplier" as const,
    },
    {
      name: "david_brown",
      email: "david@mail.com",
      phone: "7778889999",
      address: "654 Maple St, Springfield",
      type: "customer" as const,
    },
    {
      name: "lisa_taylor",
      email: "lisa@mail.com",
      phone: "2223334444",
      address: "987 Cedar St, Springfield",
      type: "supplier" as const,
    },
    {
      name: "james_anderson",
      email: "james@mail.com",
      phone: "8889990000",
      address: "147 Birch St, Springfield",
      type: "customer" as const,
    },
    {
      name: "emily_martin",
      email: "emily@mail.com",
      phone: "3334445555",
      address: "258 Walnut St, Springfield",
      type: "supplier" as const,
    },
    {
      name: "robert_lee",
      email: "robert@mail.com",
      phone: "6667778888",
      address: "369 Cherry St, Springfield",
      type: "customer" as const,
    },
    {
      name: "maria_garcia",
      email: "maria@mail.com",
      phone: "1112223333",
      address: "741 Ash St, Springfield",
      type: "supplier" as const,
    },
  ];
  await db.insert(akuns).values(akunsData);
  console.log("Akuns seeded successfully");
}

seed().then(() => {
  console.log("Seeder completed");
  process.exit();
});
