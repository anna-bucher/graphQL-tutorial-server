const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

function findLink(context, info, id) {
  return context.db.query.links({ id }, info)
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      // `info` contains the query AST so that the db
      // knows what fields to return
      return context.db.query.links({}, info)
    },
    link: (root, args, context, info) => {
      return findLink(context, info, args.id)
    },
  },

  Mutation: {
    post(root, args, context, info) {
      return context.db.query.createLink(
        {
          data: {
            url: args.url,
            description: args.description,
          },
        },
        info
      )
    },
    updateLink(root, args) {
      const link = findLink(args.id)
      if (link) {
        if (args.url) {
          link.url = args.url
        }
        if (args.description) {
          link.description = args.description
        }
      }
      return link
    },
    deleteLink(root, args) {
      const linkIdx = links.findIndex((l) => l.id === args.id)
      if (linkIdx >= 0) {
        const link = links[linkIdx]
        delete links[linkIdx]
        return link
      }
      return null
    },
  },

  Link: {
    id: (root) => root.id,
    description: (root) => root.description,
    url: (root) => root.url,
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (req) =>
    Object.assign({}, req, {
      db: new Prisma({
        typeDefs: 'src/generated/prisma.graphql',
        endPoint:
          'https://eu1.prisma.sh/public-gravelhiss-219/hackernews-node/dev',
        secret: '09asdfj20j',
        debug: true,
      }),
    }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
