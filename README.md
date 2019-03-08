### IndexedDB初体验    

#### 在线访问地址: [在线预览](https://ilvseyinfu.github.io/AddressBook/#/)

#### 特点：   
1. 对象形式存储  
2. 异步 （防止锁死浏览器，localstorage是同步的
3. 支持事物 （只要有一步失败，整个事物回滚
4. 同源限制  (不能跨域访问数据库 
5. 存储空间比localstorage大  （大的多 
6. 支持二进制存储   


我写了一个[通讯录](https://github.com/ilvseyinfu/indexedDB)的项目，利用indexeddb在浏览器持续化端存储通讯录数据，支持通讯录导入，新增，搜索，修改，删除联系人


学习自: [阮一峰浏览器数据库](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html) & [indexedDB API](https://wangdoc.com/javascript/bom/indexeddb.html#indexeddb-%E5%AF%B9%E8%B1%A1)

#### 安装：
```
yarn install
```
#### 运行:
```
yarn start
```

#### 示例:
![演示图片](https://github.com/ilvseyinfu/blog/raw/master/images/new_address.jpg)

#### 我贴出大概示例：


```typescript

// DB.ts

interface Idb {
	database: string; // 数据库名称
	version: number; // 版本号
	db: any; // 数据库创建成功后的对象
	store: any[]; // 初始化存储数据
	tables: any[]; // 表选项
	
	open(): void; // 打开数据库方法
	add(): void; // 插入一条数据
	read(i): void; // 读取指定数据
	readAll(): void; // 读取全部数据
	remove(i): void; // 移除指定数据
	update(o): void; // 更新指定数据
}


```

init.ts

```typescript

import IndexedDB from './DB';
var db_person = new IndexedDB('db_test', 1);
db_person.open(); // 初始化数据库操作
```



