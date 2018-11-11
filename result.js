function lowLevel() {
	var dic = {}
	return {
		get: function(key, callback) {
	    if (callback!=undefined) {
	    	if(dic[key]==undefined) {
		    	callback(true, null)
		    } else {
        	callback(false, dic[key])
        }
	    }
		},

		put:function(key, value, callback) {
			dic[key]=value
			if(callback!=undefined) {
				callback(false)
			}
		},

		del:function(key, callback) {
			delete dic[key]
			if(callback!=undefined) {
				callback(false)
			}
		}
	}
}






function  wrap(lowLevelStorage) {
  
	if(!lowLevelStorage) throw new Error('lowLevelStorage missing')
	  
	function put(key, val) {
    return new Promise((resolve, reject) => {
      lowLevelStorage.put(key, val, (err) => err ? reject(err) : resolve())
    })
	}
  
	function get(key) {
    return new Promise((resolve, reject) => {
      lowLevelStorage.get(key, (err, val) => err ? reject(err) : resolve(val))
    })
  }
  
	function del(key) {
    return new Promise((resolve, reject) => {
      lowLevelStorage.del(key, (err) => err ? reject(err) : resolve())
    })
  }
  
	function batchPut(list) {
    return Promise.all(list.map( item =>  put(item.key, item.value)))
  }
  
	return {
    put,
    get,
    del,
    batchPut
  }
}



const lowLevelStorage = new lowLevel()
const highLevelStorage = wrap(lowLevelStorage)


highLevelStorage.put('a', 1)
.then(function() {
	console.log('put success')
})
.catch(function(err){
	console.log('put fail')
})


highLevelStorage.get('a')
.then(function(val) {
	console.log('get success:', val)
})
.catch(function(err){
	console.log('get fail')
})


highLevelStorage.del('a')
.then(function() {
	console.log('del success:')
})
.catch(function(err){
	console.log('del fail')
})


highLevelStorage.batchPut([
  { key: 'b', value: 2 },
  { key: 'c', value: 3 },
])
.then(function() {
	console.log('batchPut success:')
})
.catch(function(err){
	console.log('batchPut fail')
})


