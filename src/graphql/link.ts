import { extendType, idArg, nonNull, objectType, stringArg } from "nexus"

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
    t.nonNull.list.nonNull.field("loadLinks", {
      type: "Link",
      args: {
        filter: stringArg()
      },
      resolve(parent, args, context) {
        const where = args.filter
          ? {
            OR: [
              { description: { contains: args.filter } },
              { url: { contains: args.filter } }
            ]
          }
          : {}
        return context.prisma.link.findMany({
          where
        })
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