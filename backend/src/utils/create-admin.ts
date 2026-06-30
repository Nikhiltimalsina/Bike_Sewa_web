import UserModel from "../models/user.model";
import connectDB from "../database/mongodb";

async function updateUserToAdmin() {
  await connectDB();
  
  const user = await UserModel.findOne({ email: "admin@bikesewa.com" });
  if (user) {
    user.role = "admin";
    await user.save();
    console.log("Updated admin@bikesewa.com to admin role");
  } else {
    console.log("Admin user not found");
  }
  process.exit(0);
}

updateUserToAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});