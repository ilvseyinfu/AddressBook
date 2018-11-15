


export default class IndexedDB {



	constructor (database, version, store) {
		this.database = database;
		this.version = version;
		this.db = null;
		this.store = store;
	}

	callback () {
		console.log(`${this.database}, ${this.version}`)
	}

  open (table, pushErr = (err) => {throw new Error(err)}) {
		let request;
		if(window.indexedDB) {
			request = window.indexedDB.open(this.database, this.version);
			request.onerrror = (event) => {
				pushErr(event)
			}
			request.onsuccess = (event) => {
				this.db = request.result; 
				console.log('get db');
				var objectStore;
				if(this.db && !this.db.objectStoreNames.contains(table.name)) {
					objectStore = this.db.createObjectStore(table.name, table.options)
					// 对name字段建立索引
					table.indexs.map( (index) => {
						objectStore.createIndex(index.name, index.prop, index.option);
					}) 
					console.log('success')
				}
			}
			request.onupgradeneeded = (event) => {
				this.db = event.target.result;
				console.log('upgrade');
				var objectStore;
				if(this.db && !this.db.objectStoreNames.contains('person')) {
					objectStore = this.db.createObjectStore('person',{
						keyPath: 'id'
					})
					// 对name字段建立索引
					objectStore.createIndex('name', 'name', { unique: false})
					objectStore.createIndex('email', 'email', { unique: true})
				}				
			}


		}
	}


	addAll (store, pushErr = (err) => {throw new Error(err)}) {

		if(this.db) {

			let transaction = this.db.transaction(['person'], 'readwrite');
			let objectStore = transaction.objectStore('person')
			store.map((item) => {
				let request = objectStore.put(item);
				request.onsuccess = (event) => {
					console.log('add success');
				}
				request.onerror = (event) => {
					pushErr(event.target.error)
				}
			})
		}

	}

  add (item, pushErr = (err) => {throw new Error(err)}) {

  	console.log(this.db);
		if(this.db) {

				let transaction = this.db.transaction(['person'], 'readwrite');
				let objectStore = transaction.objectStore('person')
				let request = objectStore.put(item);

				request.onsuccess = (event) => {
					console.log('add success');
				}	

				request.onerror = (event) => {
					pushErr(event.target.error);
				}
		}
		
	}

	read ( pushErr = (err) => {throw new Error(err)}) {
		if(this.db) {
			var transaction = this.db.transaction(['person']);
			var objectStore = transaction.objectStore('person');
			var request = objectStore.get(1);
			request.onerror = (event) => {
				pushErr('读取异常')
			}
			request.onsuccess = (event) => {
				if(request.result) {
					console.log(request.result );
				} else {
					pushErr('没有数据');
				}
			}					
		}
	}

	readAll (pushErr = (err) => {throw new Error(err)}) {
		var objectStore = this.db.transaction('person').objectStore('person')

		objectStore.openCursor().onsuccess = (event) => {
				var cursor = event.target.result;
				if(cursor) {
					console.log(cursor.value.name, cursor.value.id, cursor.value.email);
					//console.log(cursor.key, cursor.value.name, cursor.value.age, cursor.value.email);
					cursor.continue();
				} else {
					console.log('没有更多数据了');
				}
		}

	}

	// 删除 指定行
	remove (pushErr = (err) => {throw new Error(err)}) {
		var request = this.db.transaction(['person'], 'readwrite').objectStore('person').delete(1);
		request.onsuccess = (event) => {
			console.log('remove success');
		}
		request.onerror = (event) => {
			pushErr('删除失败')
		}
	}

	update (pushErr = (err) => {throw new Error(err)}) {
		var request = this.db.transaction(['person'], 'readwrite').objectStore('person')
		.put({id: 1, name: '李四', email: 'ilvseyinfu@gmail.com'})

		request.onsuccess = (event) => {
			console.log('update success');
		}
		request.onerror = (event) => {
			pushErr(event)
		}
	}



}
