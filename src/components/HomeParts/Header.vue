<template>
<div class='header'>
    <el-row :gutter="20">
        <el-col :span="1"><i class="el-icon-s-fold" @click="navbtn"></i></el-col>
        <el-col :span="20">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="(item) in lists" :key="item.path">
                    <router-link :to="item.path">{{item.meta.title}}</router-link>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="3">
            <div class="grid-content bg-purple">
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                    <el-avatar shape="square" :size="40" :src="url" alt="头像"></el-avatar>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item icon="el-icon-circle-plus" @click.native="leave">退出账号</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <p>admin</p>
            </div>
        </el-col>
    </el-row>
</div>
</template>

<style lang="less" scoped>
.header{
    text-align: left;
    .el-col i{
        transform: scale(1.8);
        color: none !important;
    }
}
.grid-content{
    display: flex;
    p{
        margin-left: 20px;
    }
    .el-avatar{
        margin-top: 10px;
    }
    .el-dropdown-link {
    cursor: pointer;
    }

}
.el-breadcrumb{
   line-height: 60px;
    font-size: 16px
}
</style>

<script>
export default {
  data () {
    return {
      url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      isCollapse: false,
      // 定义一个数组 用于接收路由信息
      lists: []
    }
  },
  created () {
    console.log(this.$route.matched)
    // 获取路由内的全部信息
    this.lists = this.$route.matched
  },
  // 这里必须使用监听，否则无法实时获取路由变动信息。
  // 监听后路由会实时变动，不然需要手动刷新路径才会改变
  watch: {
    $route (to, from) {
      console.log(to)
      this.lists = to.matched
    }
  },

  methods: {
    navbtn () {
      this.isCollapse = !this.isCollapse
      console.log(this.isCollapse)
      this.$emit('listenToIsCollapse', this.isCollapse)
    },
    leave () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }

}
</script>
