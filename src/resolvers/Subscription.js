const publications = {
  subscribe: async (parent, args, ctx, info) => {
    return ctx.db.subscription.post({}, info)
  },
}

const newPost = {
  // where not actually working ATM (bug)
  subscribe: async (parent, args, ctx, info) =>
    // `where` clause not working in subscriptions even though
    // I updated to 1.7.0 ??
    ctx.db.subscription.post({}, info),
  // ctx.db.subscription.post( { where: { mutation_in: ['CREATED'] }, }, info),
}

const newVote = {
  subscribe: (parent, args, ctx, info) =>
    // `where` not working in subscription for now
    ctx.db.subscription.vote({}, info),
  // ctx.db.subscription.vote({ where: { mutation_in: ['CREATED'] } }, info),
}

module.exports = { newPost, publications, newVote }
