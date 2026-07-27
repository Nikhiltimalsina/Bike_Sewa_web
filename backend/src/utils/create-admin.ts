import UserModel from "../models/user.model";
import { UserRole } from "../types/user.type";
import connectDB from "../database/mongodb";

async function updateUserToAdmin() {
  await connectDB();

  const user = await UserModel.findOne({ email: "admin@bikesewa.com" });
  if (user) {
    user.role = UserRole.ADMIN;
    await user.save();
    console.log("Updated admin@bikesewa.com to admin role");
    process.exit(0);
  } else {
    console.log("Admin user not found");
    process.exit(1);
  }
}

updateUserToAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});