async function posts(parent, { filter, skip, first, orderBy }, ctx, info) {
  const where = filter ? { title_contains: filter } : {}
  const foundPosts = await ctx.db.query.posts(
    { where, skip, first, orderBy },
    `{ id }`
  )

  const countSelectionSet = `
  {
    aggregate {
      count
    }
  }
  `

  const postsConnection = await ctx.db.query.postsConnection(
    {},
    countSelectionSet
  )

  return {
    count: postsConnection.aggregate.count,
    postIds: foundPosts.map(post => post.id),
  }
}

function user(parent, { id }, ctx, info) {
  return ctx.db.query.users(
    {
      where: { id },
    },
    info
  )
}

function users(parent, args, ctx, info) {
  return ctx.db.query.users({}, info)
}

module.exports = { posts, user, users }
