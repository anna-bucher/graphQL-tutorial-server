const { GraphQLServer } = require('graphql-yoga')

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
  {
    id: 'link-1',
    url: 'gaspardbucher.com',
    description: 'A guy',
  },
  {
    id: 'link-2',
    url: 'godlily.com',
    description: 'A girl',
  },
]

let idCount = links.length

function findLink(id) {
  return links.find((l) => l.id === id) || null
}

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (root, args) => findLink(args.id),
  },

  Mutation: {
    post(root, args) {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
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
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
