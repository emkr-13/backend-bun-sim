import { db } from "../config/db";
import { store } from "../models/store";

async function seed() {
  const stores = [
    {
      name: "Tech Haven",
      description: "Your one-stop shop for all things tech.",
      location: "123 Tech Lane, Silicon Valley, CA",
      contact_number: "123-456-7890",
      email: "tech@mail.com",
      address: "123 Tech Lane, Silicon Valley, CA",
      manager: "Alice Johnson",
    },
    {
      name: "Book Nook",
      description: "A cozy place for book lovers.",
      location: "456 Book St, New York, NY",
      contact_number: "987-654-3210",
      email: "book@mail.com",
      address: "456 Book St, New York, NY",
      manager: "Bob Smith",
    },
    {
      name: "Fashion Hub",
      description: "Trendy clothing and accessories.",
      location: "789 Fashion Ave, Los Angeles, CA",
      contact_number: "555-123-4567",
      email: "tren@mail.com",
      address: "789 Fashion Ave, Los Angeles, CA",
      manager: "Charlie Brown",
    },
  ];
  await db.insert(store).values(stores);
  console.log("Stores seeded successfully");
}

seed().then(() => {
  console.log("Seeder completed");
  process.exit();
});
