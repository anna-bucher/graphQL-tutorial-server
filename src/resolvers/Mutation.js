const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function writePost(parent, { title }, ctx, info) {
  const userId = getUserId(ctx)
  return ctx.db.mutation.createPost(
    {
      data: {
        title,
        author: { connect: { id: userId } },
      },
    },
    info
  )
}

function updateTitle(parent, { id, newTitle }, ctx, info) {
  // Just to verify auth.
  const userId = getUserId(ctx)
  return ctx.db.mutation.updatePost(
    {
      where: {
        id,
      },
      data: {
        title: newTitle,
        // editor: { connect: { id: userId } }
      },
    },
    info
  )
}

async function signup(parent, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await ctx.db.mutation.createUser(
    {
      data: { ...args, password },
    },
    `{ id }`
  )
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  // This is an AuthPayload
  // When a query goes further, it uses this
  // as parent.
  return {
    token,
    user,
  }
}

async function login(parent, args, ctx, info) {
  const user = await ctx.db.query.user(
    { where: { email: args.email } },
    `{ id password }`
  )
  if (!user) {
    console.log(`Login: user with email '${args.email}' not found.`)
    throw new Error('Invalid user or password.')
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    console.log(`Password not valid.`)
    throw new Error('Invalid user or password.')
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function vote(parent, args, ctx, info) {
  const userId = getUserId(ctx)

  const voteExists = await ctx.db.exists.Vote({
    user: { id: userId },
    post: { id: args.postId },
  })
  if (voteExists) {
    throw new Error(`Already voted for link: ${args.postId}`)
  }

  return ctx.db.mutation.createVote(
    {
      data: {
        user: { connect: { id: userId } },
        post: { connect: { id: args.postId } },
      },
    },
    info
  )
}

module.exports = {
  signup,
  login,
  writePost,
  updateTitle,
  vote,
}
