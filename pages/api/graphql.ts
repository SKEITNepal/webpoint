import { createYoga, createSchema } from 'graphql-yoga'
import { makeExecutableSchema } from '@graphql-tools/schema'
import type { Journal } from '@prisma/client'
import { Context } from '../../prisma/context_new'
import { context } from '../../prisma/context_new'



const resolvers = {
  Query: {
    journals: async (parent: unknown, args: { skip?: number; limit?: number }, context: Context) =>
      await context.prisma.journal.findMany({
        take: args.limit,
        skip: args.skip,
      }),
    filter: async (parent: unknown, args: { start: string, end: string, skip?: number; limit?: number }, context: Context) =>
      await context.prisma.journal.findMany({
        take: args.limit,
        skip: args.skip,
        where: {
          date: {
            gte: new Date(args.start),
            lte: new Date(args.end)
          }
        }
      }),
    count: async (parent: unknown, args: {}, context: Context) =>
      await context.prisma.journal.count(),
    start: async (parent: unknown, args: {}, context: Context) =>
      await context.prisma.journal.findFirst({ orderBy: [{ date: 'asc' }] }),
    end: async (parent: unknown, args: {}, context: Context) =>
      await context.prisma.journal.findFirst({ orderBy: [{ date: 'desc' }] }),
  },

  Journal: {
    id: (parent: Journal) => parent.id,
    title: (parent: Journal) => parent.title,
    desc: (parent: Journal) => parent.desc,
    date: (parent: Journal) => parent.date
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
  journals(limit:Int, skip: Int): [Journal!]!
  filter(start: String!, end:String!, limit:Int, skip: Int): [Journal!]!
  count: Int
  start: Journal!
  end: Journal!
}
type Journal {
   id: Int
   title: String
   desc: String
   date: Date
 }

 type Mutation {
  postJournal(title: String!, date: Date!, desc: String!): Journal!
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

