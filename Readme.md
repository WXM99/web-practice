# Readme

在生成数据集合时，D3.json函数要求从网络读取json文件。所以读取本地的json文件时，需要搭建一个虚拟网络服务器。推荐使用http-server。

1.  打开命令行，输入``` $ npm install -g http-server```安装http-server.
2. 安装完成后，cd到HTML文件所在目录，再输入 ``` $ http-server```开启服务器.
3. 浏览器访问http://127.0.0.1:8080 点击index列表中的HTML文件即可访问网页.
