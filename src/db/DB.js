


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

  open (pushErr = (err) => {throw new Error(err)}) {
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
				if(this.db && !this.db.objectStoreNames.contains('person')) {
					objectStore = this.db.createObjectStore('person',{
						keyPath: 'id'
					})
					// 对name字段建立索引
					objectStore.createIndex('name', 'name', { unique: false})
					objectStore.createIndex('email', 'email', { unique: true})
					console.log('success')
				}

				this.add();
				//this.remove();
				this.readAll();
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

  add (item, index, pushErr = (err) => {throw new Error(err)}) {


		if(this.db) {
				let request = this.db.transaction(['person'], 'readwrite')
		    .objectStore('person')
		    .add(item);

				request.onsuccess = (event) => {
					console.log('add success');
				}	


		}
		
	}

	read (pushErr = (err) => {throw new Error(err)}) {
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

	readAll (pushErr = (err) => {throw new Error(err)}) {
		var objectStore = this.db.transaction('person').objectStore('person')

		objectStore.openCursor().onsuccess = (event) => {
				var cursor = event.target.result;
				if(cursor) {
					console.log(cursor.value.name, cursor.value.id);
					//console.log(cursor.key, cursor.value.name, cursor.value.age, cursor.value.email);
					cursor.continue();
				} else {
					console.log('没有更多数据了');
				}
		}

	}

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
