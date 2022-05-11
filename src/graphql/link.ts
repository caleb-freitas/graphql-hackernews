import { extendType, idArg, intArg, nonNull, objectType, stringArg } from "nexus"
import { NexusGenObjects } from "../../nexus-typegen"

// create a new type in graphql schema
export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id")
    t.nonNull.string("description")
    t.nonNull.string("url")
  }
})

const links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
]

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve(parent, args, context, info) {
        return links
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
      resolve(parent, args, context) {
        const { description, url } = args
        let idCounter = links.length + 1
        const link = {
          id: idCounter,
          description: description,
          url: url
        }
        links.push(link)
        return link
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
      resolve(parent, args, context) {
        const { id } = args
        const index = links.map(link => {
          return link.id
        }).indexOf(parseInt(id))
        const link = links[index]
        links.splice(index, 1)
        return link
      }
    })
  }
})
