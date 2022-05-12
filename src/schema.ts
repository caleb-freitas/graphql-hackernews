import { makeSchema } from 'nexus'
import { join } from 'path'
import * as types from "./graphql"

export const schema = makeSchema({
	types,
	outputs: {
		// schema.graphql::is the graphql schema definition language for defining the structure of the api
		schema: join(process.cwd(), "schema.graphql"),
		// nexus-typegen.ts::contain typescript type definitions for all types in graphql schema
		typegen: join(process.cwd(), "nexus-typegen.ts")
	},
	contextType: {
		// path to the context module
		module: join(process.cwd(), "./src/context.ts"),
		// name of the exported interface in that module
		export: "Context"
	}
})