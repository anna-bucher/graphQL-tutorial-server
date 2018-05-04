function posts(parent, args, ctx, info) {
  return ctx.db.query.posts({ where: { id_in: parent.postIds } }, info)
}

module.exports = {
  posts,
}
