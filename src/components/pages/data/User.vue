<template>
  <div class="users">
    <el-card>
      <el-row class="top">
        <el-col :span="7">
          <el-input placeholder="查找用户" v-model="data.query" clearable @clear='userList'>
            <el-button slot="append" icon="el-icon-search" class="search" @click="userList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="add" @click="dialogVisible = true">添加用户</el-button>
          <!-- 添加用户信息 ref="addFormRef"的作用是设定这个表单的ref属性-->
          <el-dialog  title="用户信息"   :visible.sync="dialogVisible"  @close="dialogClosed">
            <el-form :model="addform" :rules="addFormRules" ref="addFormRef"> 
              <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                <el-input v-model="addform.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                <el-input v-model="addform.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                <el-input v-model="addform.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
                <el-input v-model="addform.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button  @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
          </el-col>
      </el-row>

      <el-row  class="Table">
      <el-table border :data="userlista" style="width: 100%">
      <el-table-column type="index" width="30">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="150">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column  prop="mobile" label="手机号码" width="200">
      </el-table-column>
      <el-table-column  prop="role_name" label="用户身份" width="200">
      </el-table-column>
     <!-- 作用域插槽  slot-scope(接受父数据 )  {{ scope.row }}-->
      <el-table-column label="状态" width="100"  prop="mg_state">
        <template slot-scope="scope"> 
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change='userStateChage(scope.row)'> 
            <!-- 状态发生变化时的回调函数change,传递状态给数据库 -->
          </el-switch>
          </template>
         
      </el-table-column>

      <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button size="mini"  @click="ediDialog(scope.row.id)">编辑</el-button>

           <el-dialog  title="修改用户信息" :visible.sync="editdialogVisible" @close="editdialogClosed">
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef"> 
              <el-form-item label="用户名" :label-width="formLabelWidth">
                <el-input v-model="editForm.username"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                <el-input v-model="editForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile" :label-width="formLabelWidth">
                <el-input v-model="editForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button  @click="editdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editUserInfo">修改</el-button>
            </div>
        </el-dialog>
        <el-button
          size="mini"
          type="danger"
           @click="delUser(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
    </el-table>
      </el-row>
      <el-row>
        <template>
          <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="data.pagrnum"
              :page-size="data.pagesize"
              :page-sizes="[4,10,20,50]"
              layout="total, sizes,prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </template>
      </el-row>
    </el-card>


        
  </div>
</template>


<script>
    export default {
      data() {
        //邮箱验证
        var chechEmail =(rule,valuse,cb)=>{
          //邮箱的正则表达式
          const regEmail =/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
          if(regEmail.test(valuse)){
            return cb()
          }
          cb(new Error('输入合法的邮箱'))
        }
        //手机验证
        var chechMobile =(rule,valuse,cb)=>{
          //邮箱的正则表达式
          const regEmail = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/

          if(regEmail.test(valuse)){
            return cb()
          }
          cb(new Error('输入合法的手机号码'))
        }
        return {
          data:{
            query:"",
            pagenum:1,
            pagesize: 10
          },
          userlista:[],
          total:0,
          dialogVisible: false,
          editdialogVisible:false,
          addform: {
            username: '',
            password: '',
            email: '',
            mobile: ''
          },
          addFormRules:{
            username:[
              {required: true, message: '请输入用户名',  trigger: 'blur'},
              {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'} 
            ],
            password:[
               {required: true, message: '请输入密码',  trigger: 'blur'},
              {min:6, max: 15, message: '长度在 3 到 10 个字符',  trigger: 'blur'}
            ],
           email:[
               {required: true, message: '请输入邮箱',  trigger: 'blur'},
               {validateor:chechEmail,  trigger: 'blur'}
            ],
            mobile:[
               {required: true, message: '请输入手机号码',  trigger: 'blur'},
               {validateor:chechMobile,  trigger: 'blur'}
            ],
          },
          formLabelWidth: '120px',
          editForm:{}
        }
        
      },
      created(){
        this.userList()
      },
      methods:{
        async userList(){
          const{ data:res }= await this.$http.get('users',{ params:this.data })
           if(res.meta.status !== 200) {
          return this.$message.error('获取用户失败')
        }
        this.userlista =res.data.users
        this.total = res.data.total
         console.log(this.userlista);
        },
        //监听页数条数
         handleSizeChange(newSize) {
        console.log(`每页 ${newSize} 条`)
        this.data.pagesize=newSize
         this.userList()
      },
      //监听页码变化
      handleCurrentChange(newPage) {
        console.log(`当前页: ${newPage}`)
         this.data.pagenum=newPage
        //重新调用data参数获取用户数据
        this.userList()
      },
      async userStateChage(userinfo){
       const {data:res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
       //console.log(res);
      if(res.meta.status != 200){
        this.userinfo.mg_state =! this.userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
      },

      addUser(){
        // $refs+this.ref.name 获取到的是dom元素validate预校验
         this.$refs.addFormRef.validate(async(valid)  =>{
          if (!valid) return
          const { data:res } = await this.$http.post('users', this.addform)
          //console.log(res);
          if(res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
          this.$message.success(res.meta.msg)
          this.dialogVisible = false 
          this.userList()
        })
      },
      //编辑editform
      async ediDialog(id){
        this.editdialogVisible=true
          const{ data:res } = await this.$http.get(`users/${id}`)
           if(res.meta.status != 200){
             return this.$message.error(res.meta.msg)
          }
          this.editForm=res.data
      },
      //重置操作
      dialogClosed(){
         this.$refs.addFormRef.resetFields()
      },
      editdialogClosed(){
        this.$refs.editFormRef.resetFields()
      },

      //表单的验证和提交
      editUserInfo(){
         this.$refs.editFormRef.validate(async(valid)  =>{
          if (!valid) return
          const { data:res } = await this.$http.put('users/'+this.editForm.id,{
            email:this.editForm.email,
            mobile:this.editForm.mobile
          })
          if(res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }  
         this.editdialogVisible = false
          this.$message.success(res.meta.msg)
          this.userList()
        })
      },

      async delUser(id){
          const { data:res } = await this.$http.delete(`users/`+id)
          if(res.meta.status != 200){
             return this.$message.error(res.meta.msg)
          }
          this.$message.success(res.meta.msg)
          this.userList()
      }
      }
    }
  </script>

<style lang="less" scoped>

  .add{
    margin-left: 30px;
  }

.search{
 transform: scale(1.3);
}
.add{
  font-size: 16px;
}
.cell>.el-button{
  margin-left: 20px;
}
</style>

