<template>
  <div class="hello">
    <div class="header">
      <i class="el-icon-news"></i>
      <span>{{title}}</span>      
    </div>

    <div class="input">
      <el-input suffix-icon="el-icon-plus" v-model.trim="input" placeholder="请输入内容" @keyup.enter.native="addOne"></el-input>
    </div>

    <div class="list"></div>
  </div>


</template>

<script>

import IndexedDB from '../db/DB.js';

/*



 */


export default {
  name: 'HelloWorld',
  data () {
    return {
      input: '',
      title: 'TodoList With IndexedDB',
      db_person: null,
      // 本地模拟存储数据
      store: [
        { id: 0, name: '张三', email: 'ilvseyinfu1@gmail.com' },
        { id: 1, name: '李四', email: 'ilvseyinfu2@gmail.com' },
        { id: 2, name: '王五', email: 'ilvseyinfu3@gmail.com' },
        { id: 3, name: '赵六', email: 'ilvseyinfu4@gmail.com' },      
        { id: 4, name: '陈七', email: 'ilvseyinfu5@gmail.com' },
      ],
      // 表配置
      tables: [
        { name: 'person', options: { autoIncrement: true, keyPath: 'id'}, indexs: [{name: 'name', prop: 'name', option: { unique: false}}, {name: 'email', prop: 'email', option: {unique: true}}]}
      ]
    }
  },

  created () {
    this.db_person = new IndexedDB('db_test', 1, this.store);
    this.db_person.callback();
    this.db_person.open(this.tables[0]);

    // 2s 后插入本地存储的数据
    setTimeout(() => {
      this.db_person.addAll(this.store);
    }, 2000)

    // 5s 后全部读取
    setTimeout(() => {
      this.db_person.readAll();
    }, 5000)


  },

  methods: {
    addOne () {
      alert(1)
    }
  },

  mounted () {

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

.input {
  width: 400px;
  margin: 30px auto;
}


</style>
