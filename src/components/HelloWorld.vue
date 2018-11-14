<template>
  <div class="hello">
    IndexedDB TEST
  </div>
</template>

<script>

import IndexedDB from '../db/DB.js';


export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      db_person: null,
      store: [
        { id: 1, name: '张三', email: 'ilvseyinfu@gmail.com' },
        { id: 2, name: '李四', email: 'ilvseyinfu@gmail.com' },
        { id: 3, name: '王五', email: 'ilvseyinfu@gmail.com' },
        { id: 4, name: '赵六', email: 'ilvseyinfu@gmail.com' },
        { id: 5, name: '陈七', email: 'ilvseyinfu@gmail.com' },
      ]

    }
  },

  created () {
    this.db_person = new IndexedDB('db_test', 1, this.store);
    this.db_person.callback();
    this.db_person.open();


  },

  mounted () {

    //this.db_person.add();
    //this.db_person.read();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
