import type { Passwords, Users } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { Users } from "@prisma/client";

export async function getUserById(id: Users["id"]) {
  return prisma.users.findUnique({ where: { id } });
}

export async function getUserByEmail(email: Users["email"]) {
  return prisma.users.findUnique({ where: { email } });
}

export async function createUser(email: Users["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.users.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: Users["email"]) {
  return prisma.users.delete({ where: { email } });
}

export async function verifyLogin(
  email: Users["email"],
  password: Passwords["hash"],
) {
  const userWithPassword = await prisma.users.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
