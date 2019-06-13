## 安装
``` bas
# install dependencies
npm install
```

## 开发
``` bash
# serve with hot reload at localhost:8080
npm run dev
```

## 编译
``` bash
# build for production with minification
npm run build
```

## 工程结构
```
asset：全局资源。
module：模块代码。
util：工具类。
```

## package.json
波浪符号（~）：它会更新到当前minor version（也就是中间的那位数字）中最新的版本。

* ~1.15.2 代表的更新版本范围为 >= 1.15.2 < 1.16.0

插入符号（^）

* ^1.2.1 代表的更新版本范围为 >=1.2.1 && < 2.0.0
* ^0.2.1 代表的更新版本范围为 >=0.2.1 && < 0.3.0
* ^0.0.2 代表的更新版本范围为 0.0.2（相当于锁定为了0.0.2版本）

