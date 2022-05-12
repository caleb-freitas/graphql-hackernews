import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User"
    })
  }
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      async resolve(parent, args, context) {
        const user = await context.prisma.user.findFirst({
          where: {
            email: args.email
          }
        })
        if (!user) {
          throw new Error("Invalid user")
        }
        const validPassword = await bcrypt.compare(
          args.password,
          user.password
        );
        if (!validPassword) {
          throw new Error("Invalid password")
        }
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        return {
          token,
          user
        }
      }
    })
    t.nonNull.field("signup", { // 1
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg())
      },
      async resolve(parent, args, context) {
        const { email, name } = args;
        const password = await bcrypt.hash(args.password, 10);
        const user = await context.prisma.user.create({
          data: { email, name, password }
        })
        const token = jwt.sign({ userId: user.id }, JWT_SECRET);
        return {
          token,
          user
        }
      }
    })
  }
})