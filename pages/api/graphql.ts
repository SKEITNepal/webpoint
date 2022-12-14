import { createYoga, createSchema } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { journal } from '@prisma/client'
import { Context } from '../../prisma/context_new'
import { context } from '../../prisma/context_new'



const resolvers = {
  Query: {
    journals: async (parent: unknown, args: {filter?:string, skip?: number; limit?: number}, context: Context) =>
      await context.prisma.journal.findMany({
        take: args.limit,
        skip: args.skip
      }),

    count: async (parent: unknown, args: {}, context: Context) =>
      await context.prisma.journal.count()
  },

  journal: {
    id: (parent: journal) => parent.id,
    title: (parent: journal) => parent.title,
    desc: (parent: journal) => parent.desc,
    date: (parent: journal) => parent.date
  },
  Mutation: {
    async postJournal(
      parent: unknown,
      args: { title: string, date: string, desc: string; },
      context: Context
    ) {
      return await context.prisma.journal.create({
        data: {
          title: args.title,
          date: new Date(args.date).toISOString(),
          desc: args.desc
        }
      });
    }
  }
}

const typeDefs = `
scalar Date
type Query {
  journals(filter: String, limit:Int, skip: Int): [journal!]!
  count: Int
}
type journal {
   id: Int
   title: String
   desc: String
   date: Date
 }

 type Mutation {
  postJournal(title: String!, date: Date!, desc: String!): journal!
  }
`

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefs]
})

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
  context: context
})

