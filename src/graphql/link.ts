import { Prisma } from "@prisma/client"
import { arg, enumType, extendType, idArg, inputObjectType, intArg, list, nonNull, objectType, stringArg } from "nexus"

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("description")
    t.nonNull.string("url")
    t.nonNull.dateTime("createdAt")
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context, info) {
        return context.prisma.link
          .findUnique({
            where: {
              id: parent.id
            }
          })
          .postedBy()
      }
    })
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, context) {
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .voters();
      }
    })
  }
})

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feed", {  // 1
      type: "Feed",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) })
      },
      async resolve(parent, args, context) {
        const where = args.filter
          ? {
            OR: [
              { description: { contains: args.filter } },
              { url: { contains: args.filter } },
            ],
          }
          : {}
        const links = await context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined
        })
        const count = await context.prisma.link.count({ where })
        const id = `main-feed:${JSON.stringify(args)}`
        return {
          links,
          count,
          id
        }
      }
    })
  }
})


export const AddLink = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("addLink", {
      type: "Link",
      args: {
        description: nonNull(stringArg()),
        url: nonNull(stringArg())
      },
      resolve(parent, args, context, info) {
        const { userId } = context
        if (!userId) {
          throw new Error("Cannot add a link without logging in")
        }
        const newLink = context.prisma.link.create({
          data: {
            ...args,
            postedBy: {
              connect: {
                id: userId
              }
            }
          }
        })
        return newLink
      }
    })
  }
})

export const DeleteLink = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(idArg())
      },
      resolve(parent, args, context, info) {
        const { userId } = context
        if (!userId) {
          throw new Error("Cannot delete a link without logging in")
        }
        const id = parseInt(args.id)
        return context.prisma.link.delete({
          where: {
            id
          }
        })
      }
    })
  }
})

export const UpdateLink = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
        url: stringArg(),
        description: stringArg()
      },
      resolve(parent, args, context, info) {
        const { userId } = context
        if (!userId) {
          throw new Error("Cannot update a link without logging in")
        }
        const id = parseInt(args.id)
        const description = args.description as string
        const url = args.url as string
        return context.prisma.link.update({
          where: {
            id
          },
          data: {
            description,
            url
          }
        })
      }
    })
  }
})

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: Link })
    t.nonNull.int("count")
    t.id("id")
  },
});
