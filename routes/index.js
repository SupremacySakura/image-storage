const Router = require('@koa/router')
const path = require('path')
const fs = require('fs')
const { koaBody } = require('koa-body')
const router = new Router()
router.get('/', async (ctx, next) => {
  ctx.body = 'hello image storage'
})
router.post('/upload', koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'temp'),
    keepExtensions: true
  }
}), async (ctx) => {
  try {
    const folderName = ctx.request.body.folderName
    const file = ctx.request.files.file
    if (!folderName) {
      ctx.throw(400, 'folderName is required')
    }
    const targetDir = path.join(__dirname, 'public', folderName)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true }) // 创建文件夹
    }
    const oldPath = file.filepath // formidable 自动生成的文件路径
    const newPath = path.join(targetDir, file.newFilename || file.originalFilename)

    fs.renameSync(oldPath, newPath) // 将文件移动到指定目录
    ctx.body = {
      message: 'File uploaded successfully!',
      filePath: `/public/${folderName}/${path.basename(newPath)}`,
    }
  } catch (error) {
    console.error(error)
    ctx.body = {
      message: 'Failed to upload file',
      error: error.message,
    }
  }
})
module.exports = router