const showRequest = async (ctx, next) => {
    await next()
    console.log(`${ctx.request.url},${ctx.request.method},${JSON.stringify(ctx.request.body)},${ctx.status}`)
}
module.exports = {
    showRequest
}