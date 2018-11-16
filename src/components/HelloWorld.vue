<template>
  <div class="hello">

    <div class="header">
      <img class="logo" src="../assets/tel.svg" />
      <span>{{title}}</span>      
    </div>

    <div class="input">
      <el-input suffix-icon="el-icon-plus" v-model.trim="input" placeholder="请输入添加内容" @keyup.enter.native="addOne"></el-input>
    </div>


    <div class="input">
      <el-input suffix-icon="el-icon-search" v-model.trim="search" placeholder="请输入搜索姓名" @keyup.enter.native="searchOne"></el-input>
    </div>

    <div class="clear">
      <el-button v-if="!loading" size="small" type="primary" plain @click="removeAll">一键清除所有联系人</el-button>
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
                @click="handleEdit(scope.$index, scope.row)">
                <img class="edit" src="../assets/edit.svg" />
                </el-button>
              <el-button
                size="mini"
                @click="handleDelete(scope.$index, tables[0].name)">
                <img class="edit" src="../assets/del.svg" />
                </el-button>
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
            <el-button type="primary" @click="doModify(tables[0].name)">确 定</el-button>
          </span>
        </el-dialog>


    </div>
    <div class="footer">
      <span><i class="el-icon-loading" style="margin-right: 5px;"></i>indexedDB AddressBook by ilv</span>
    </div>
    
  </div>


</template>

<script>

import IndexedDB from '../db/DB.js';

export default {
  name: 'HelloWorld',
  data () {
    return {
      search: '',
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
        { id: 0, name: '张三', email: 'example1@gmail.com' },
        { id: 1, name: '李四', email: 'example2@gmail.com' },
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

    // 1s 后插入本地存储的模拟数据
    setTimeout(() => {
       this.table = this.db_person.addAll(this.store, this.tables[0].name);
    }, 1000)

    // 2s 后读取本地存储的模拟数据 进行渲染
    setTimeout(() => {
      this.tableData = this.db_person.readAll(this.tables[0].name);
      this.$message.success('本地数据加载成功');
      this.loading = false;
    }, 2000)


  },

  methods: {
    
    searchOne() {
      this.loading = true;
      //每次查询指定信息前先全部更新后台数据,保持前后台数据同步
      this.tableData = this.db_person.readAll(this.tables[0].name);

      // 因为查询数据是异步的 为了防止出错 等待三秒
      setTimeout( () => {
        this.tableData = this.tableData.filter(i => {

          if(i.name == this.search || this.search == '') {
            return i
          }
        })
        this.loading = false;        
      }, 2000)
    },


    addOne () {
      let dataArr = [];
      dataArr = this.input.split(' ');
      try{
        // 后端添加数据
        this.db_person.add({
          id: this.tableData.length,
          name: dataArr[0],
          email: dataArr[1]
        }, this.tables[0].name)
        // 前端添加数据
        this.tableData.push({
          name: dataArr[0],
          email: dataArr[1]
        });
        let num1 = this.tableData.length;
        console.log(num1)
        this.tableData = _.uniqBy(this.tableData, 'email');
        let num2 = this.tableData.length;
        console.log(num2)
        this.input = '';
        if(num1 == num2) {
          this.$message.success('增加成功');
        } else {
          this.$message.error('增加失败， 邮件不能重复输入');
        }
        
      } catch (err) {
        this.$message.error('增加失败');
      }


    },

    handleEdit (i) {
      this.modifyDialogVisible = true;
      this.modify_index = i;
    },

    doModify (table) {
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
      }, table)
      this.$message.success('更新数据成功');
      this.modifyDialogVisible = false
    },

    handleDelete (i, table) {
      // 数据库删除指定数据
      this.db_person.remove(i, table);
      // 前端删除数据
      this.tableData.splice(i, 1);
      this.$message.success('删除成功');
    },

    removeAll () {
      this.$confirm('此操作将永久删除所有联系人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 后端删除
        this.db_person.removeAll();
        // 前端删除
        this.tableData = [];
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },

  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
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

.hello {
  width: 500px;
  margin: 0px auto;
}

.input {
  width: 500px;
  margin: 30px auto;
}

.clear {
  width: 500px;
  text-align: left;
}

.list {
  width: 500px;
  margin: 30px auto;
}

.header {
  font-size: 24px;
  .logo {
    width: 40px;
    height: 40px;
  }  
}

.edit {
  width: 20px;
  height: 20px;
}

.footer {
  width: 500px;
  position: absolute;
  bottom: 5px;

}

</style>
