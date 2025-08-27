import { envVars } from "../config/env";
import { IAuthProvider, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      console.log("Super Admin already exist");
      return;
    }
    console.log("Trying to create super admin");

    const hashPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider[] = [
      {
        provider: "credentials",
        providerId: envVars.SUPER_ADMIN_EMAIL,
      },
    ];

    await User.create({
      name: "Super Admin",
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      auths: authProvider,
      role: Role.SUPER_ADMIN,
    });
    console.log("Super Admin created successfully");
  } catch (error) {
    console.log(error);
  }
};
