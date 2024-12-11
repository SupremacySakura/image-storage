# 静态资源部署服务器
## 介绍
这是一个简单的静态工具，将它部署到你的服务器，配合另一个工具，可以实现基础的静态资源上传功能
## 使用
### 下载
`git clone https://github.com/SupremacySakura/resource-storage.git`
### 安装依赖
`npm install`
### 启动
`node app.js`

### 使用说明
将它下载到本地，并上传至你的服务器，配合另一个工具即可实现。地址为[yxzq-utils](https://www.npmjs.com/package/yxzq-utils)，你也可以不使用作者提供的工具，只需要向该服务器发送post请求并提供相关参数即可。

### 参数说明
```JavaScript
//请求地址
//你的服务器域名+端口+/upload

//请求头
//FormData.getHeaders()

//请求体格式
//form-data
//form-data包括的参数
{
    file,  // 文件
    fileName,  // 文件名,默认值:'default'
    folderName,  // 储存的文件夹,默认值:'default_name'
    useDate,  // 是否使用时间戳进行命名,默认值:'yes',可选值:'no'
    ext,  // 文件后缀,默认值:'jpg'
}
//返回值
//promise
{
      message: 'File uploaded successfully! | File uploaded unsuccessfully! | File does not exist!',
      filePath: url | null,
      code: 200|500,
      error?:error.message
    }
```