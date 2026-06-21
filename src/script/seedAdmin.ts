import { prisma } from "../lib/prisma";
import { USERROLE } from "../middlewere/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      role: USERROLE.ADMIN,
      password: process.env.ADMIN_PASSWORD,
      image: process.env.IMAGE,
    };
    //check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email as string,
      },
    });
    if (existingUser) {
      throw new Error("User Already Exists");
    }
    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: JSON.stringify(adminData),
      },
    );

  } catch (error) {
    console.error(error);
  }
}

seedAdmin();
