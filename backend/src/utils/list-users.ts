import UserModel from "../models/user.model";
import connectDB from "../database/mongodb";

async function listUsers() {
  await connectDB();

  const users = await UserModel.find().select("fullName email role createdAt");

  if (users.length === 0) {
    console.log("No users found in the database at all.");
  } else {
    console.log(`Found ${users.length} user(s):\n`);
    users.forEach((u) => {
      console.log(`- ${u.email}  |  role: ${u.role}  |  name: ${u.fullName}`);
    });
  }

  process.exit(0);
}

listUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});