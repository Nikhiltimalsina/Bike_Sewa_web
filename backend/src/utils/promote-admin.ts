import UserModel from "../models/user.model";
import { UserRole } from "../types/user.type";
import connectDB from "../database/mongodb";

async function promoteToAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: npx ts-node-dev src/utils/promote-admin.ts <email>");
    process.exit(1);
  }

  await connectDB();

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log(`No user found with email: ${email}`);
    process.exit(1);
  }

  user.role = UserRole.ADMIN;
  await user.save();
  console.log(`✅ ${email} is now an admin (role: ${user.role})`);
  process.exit(0);
}

promoteToAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});