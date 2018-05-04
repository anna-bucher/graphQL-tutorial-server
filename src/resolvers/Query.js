function posts(parent, args, ctx, info) {
  return ctx.db.query.posts({}, info)
}

function user(parent, { id }, ctx, info) {
  return ctx.db.query.users(
    {
      where: { id },
    },
    info,
  )
}

function users(parent, args, ctx, info) {
  return ctx.db.query.users({}, info)
}

module.exports = { posts, user, users }
