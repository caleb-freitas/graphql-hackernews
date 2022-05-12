import { extendType, idArg, nonNull, objectType, stringArg } from "nexus"

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("description")
    t.nonNull.string("url")
  }
})

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("loadLinks", {
      type: "Link",
      resolve(parent, args, context, info) {
        return context.prisma.link.findMany()
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
        return context.prisma.link.create({
          data: {
            ...args
          }
        })
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