# Chat-Tools
不被偷窥聊天工具

## 项目技术

go

react + electron

### 如何使用

先在根目录下打包 client.go

其中该文件开头tcpService = "192.168.11.202:1200"  代表指向的服务端ip地址及端口


打包完成后,进入service目录进行打包. 打包后得到服务端程序.service.go开头有标明监听端口


之后进入client目录,安装依赖. 安装完成后. 执行 yarn run build 打包. 会自行根据操作系统打出对应的客户端包
