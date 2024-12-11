//导入模块
const Router = require('@koa/router')
const path = require('path')
const fs = require('fs')
const { koaBody } = require('koa-body')

//创建路由实例
const router = new Router()
const tempDir = path.join(__dirname, '.././temp')
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true }) // 创建目录
}
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
    const file = ctx.request.files.file  // 文件
    if (!file) {
      ctx.body = {
        msg: 'File does not exist!',
        filePath: null,
        code: 500,
      }
      return
    }
    //文件相关配置
    const folderName = ctx.request.body.folderName || 'default'  // 设置存储的文件夹
    const fileName = ctx.request.body.fileName || 'default_name'  // 设置存储的文件名
    const useDate = ctx.request.body.useDate || 'yes' // 是否使用日期作为文件夹
    const ext = ctx.request.body.ext || 'jpg' // 文件后缀
    const targetDir = path.join(__dirname, '.././public', folderName)
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true }) // 创建文件夹
    }
    const oldPath = file.filepath // formidable 自动生成的文件路径
    let newPath
    if (useDate === 'no') {
      newPath = path.join(targetDir, `${fileName}.${ext}`)
    } else {
      const dateString = new Date().getTime().toString()
      newPath = path.join(targetDir, `${fileName + dateString}.${ext}`)
    }

    fs.renameSync(oldPath, newPath) // 将文件移动到指定目录
    ctx.body = {
      message: 'File uploaded successfully!',
      filePath: `http://${host}/image/${folderName}/${path.basename(newPath)}`,
      code: 200,
    }
  } catch (error) {
    console.error(error)
    ctx.body = {
      message: 'File uploaded unsuccessfully!',
      error: error.message,
      filePath: null,
      code: 500,
    }
  }
})
module.exports = router