type TestUser = {
  email: "user@user.com" | "root@root.com" | "deactivated@deactivated.com";
  password: "user" | "root" | "deactivated";
};

export type TestUserType = "user" | "admin" | "deactivated";

export const testUsers: Record<TestUserType, TestUser> = {
  user: {
    email: "user@user.com",
    password: "user",
  },
  admin: {
    email: "root@root.com",
    password: "root",
  },
  deactivated: {
    email: "deactivated@deactivated.com",
    password: "deactivated",
  },
};
