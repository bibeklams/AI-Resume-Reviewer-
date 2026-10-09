import prisma from "../../../config/prisma.js";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findActiveUserByEmail = (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });
};

export const findVerifiedUserByEmail = (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
      deletedAt: null,
      emailVerified: true,
    },
  });
};

export const findUserById = (userId: number) => {
  return prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null,
    },
  });
};

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return prisma.user.create({
    data,
  });
};

export const restoreUser = (
  userId: number,
  data: {
    name: string;
    password: string;
  },
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: data.name,
      password: data.password,
      deletedAt: null,
      emailVerified: false,
    },
  });
};

export const verifyEmail = (userId: number) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      emailVerified: true,
    },
  });
};

export const updatePassword = (userId: number, hashedPassword: string) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
};
