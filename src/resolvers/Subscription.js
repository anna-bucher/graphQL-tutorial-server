const publications = {
  subscribe: async (parent, args, ctx, info) => {
    return ctx.db.subscription.post({}, info)
  },
}

module.exports = { publications }
