<template>
  <div class="hello">
    <div class="header">
      <i class="el-icon-news"></i>
      <span>{{title}}</span>      
    </div>

    <div class="input">
      <el-input suffix-icon="el-icon-plus" v-model.trim="input" placeholder="请输入内容" @keyup.enter.native="addOne"></el-input>
    </div>

    <div class="list">
      <el-table
          v-loading="loading"
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="name"
            label="姓名"
            width="75">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮件"
            width="200">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


        <el-dialog
          title="提示"
          :visible.sync="modifyDialogVisible"
          width="30%"
          center>
          <el-input suffix-icon="el-icon-plus" v-model.trim="modify" placeholder="请输入修改内容" ></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doModify">确 定</el-button>
          </span>
        </el-dialog>


    </div>
  </div>


</template>

<script>

import IndexedDB from '../db/DB.js';


export default {
  name: 'HelloWorld',
  data () {
    return {
      modify_index: null,
      modify: '',
      loading: true,
      input: '',
      modifyDialogVisible: false,
      title: 'AddressBook With IndexedDB',
      db_person: null,
      tableData: [{
          name: '暂无',
          email: '数据初始化中'
        }],


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

    // 2s 后插入本地存储的模拟数据
    setTimeout(() => {
      //this.table = this.db_person.addAll(this.store);
    }, 1000)

    // 5s 后读取本地存储的模拟数据 进行渲染
    setTimeout(() => {
      this.tableData = this.db_person.readAll();
      this.$message.success('本地数据加载成功');
      this.loading = false;
    }, 3000)


  },

  methods: {
    addOne () {
      let dataArr = [];
      dataArr = this.input.split(' ');
      this.db_person.add({
        id: this.tableData.length,
        name: dataArr[0],
        email: dataArr[1]
      })
      this.tableData.push({
        name: dataArr[0],
        email: dataArr[1]
      });
      this.$message.success('增加成功');
    },

    handleEdit (i) {
      this.modifyDialogVisible = true;
      this.modify_index = i;
    },

    doModify () {
      let dataArr = [];
      dataArr = this.modify.split(' ');
      // 前端修改
      this.tableData[this.modify_index].name = dataArr[0];
      this.tableData[this.modify_index].email = dataArr[1];

      // 后端修改
      this.db_person.update({
        id: this.modify_index,
        name: dataArr[0],
        email: dataArr[1]
      })
      this.$message.success('更新数据成功');
      this.modifyDialogVisible = false
    },

    handleDelete (i) {
      // 数据库删除指定数据
      this.db_person.remove(i);
      // 前端删除数据
      this.tableData.splice(i, 1);
      this.$message.success('删除成功');
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
  width: 500px;
  margin: 30px auto;
}

.list {
  width: 500px;
  margin: 30px auto;
}

</style>
