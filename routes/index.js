//导入模块
const Router = require('@koa/router')
const path = require('path')
const fs = require('fs')
const { koaBody } = require('koa-body')
//创建路由实例
const router = new Router()
//首页
router.get('/', async (ctx, next) => {
  ctx.body = 'hello image storage'
})
//上传图片
router.post('/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '.././temp'),
    keepExtensions: true
  }
}), async (ctx) => {
  const host = ctx.host
  try {
    const file = ctx.request.files.file
    if (!file) {
      ctx.body = {
        code: 500,
        msg: '文件不存在',
        filePath: null,
        code: 500,
      }
      return
    }
    const folderName = ctx.request.body.folderName || 'default'
    const fileName = ctx.request.body.fileName || 'default_name'
    const targetDir = path.join(__dirname, '.././public', folderName)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true }) // 创建文件夹
    }
    const oldPath = file.filepath // formidable 自动生成的文件路径
    const dateString = new Date().getTime().toString()
    const newPath = path.join(targetDir, `${fileName + dateString}${path.extname(file.originalFilename)}`)

    fs.renameSync(oldPath, newPath) // 将文件移动到指定目录
    ctx.body = {
      message: 'File uploaded successfully!',
      filePath: `http://${host}/image/${folderName}/${path.basename(newPath)}`,
      code: 200,
    }
  } catch (error) {
    console.error(error)
    ctx.body = {
      message: '上传文件失败',
      error: error.message,
      filePath: null,
      code: 500,
    }
  }
})
module.exports = router