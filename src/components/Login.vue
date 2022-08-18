<template>
    <div class="login">
    <div class="box">
    <el-form label-width="80px" :model="form" :rules="rules" ref="ruleForm">
      <el-form-item label="用户名" prop="username" >
      <el-input  placeholder="请输入内容" v-model="form.username"  clearable ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input placeholder="请输入密码" v-model="form.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登入</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    </div>
    </div>
</template>

<script>
export default {
  name: 'login-1',
  data () {
    return {
      // 表单信息
      form: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
      }
    }
  },

  // 监听
  mounted () {
    window.addEventListener('keydown', this.keyDown)
  },
  methods: {
    resetForm () {
      this.$refs.ruleForm.resetFields()
    },
    login () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.form)
        if (res.meta.status !== 200) {
          return this.$message.error('登陆失败')
        }
        this.$message.success('登陆成功')
        console.log(res)
        // 保存token到sessionstorage
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    // 回车登入
    keyDown (e) {
      if (e.keyCode === 13) {
        if (this.form.password === '' || this.form.username === '') {
          return false
        } else {
          this.login()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login{
    background-color: #d35151;
    display: flex;
    align-items: center;
    justify-content: center;
}
.box{
  width: 400px;
  background-color: #ffffff;
  height: 300px;
  border-radius: 20px;
}
.el-form {
 width: 90%;
 margin-top:15%;
}

.el-form-item {
   margin-bottom:35px;
}
.el-button--default{
  margin-left: 100px !important;
}

</style>
