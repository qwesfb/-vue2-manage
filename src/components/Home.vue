<template>
<div class="home">
<el-container class="container">
  <el-aside :class="isCollapse==false?'error':'success'">
    <Nav :isCollapse = 'isCollapse'></Nav>
  </el-aside>
  <el-container>
    <el-header>
      <Header @listenToIsCollapse='btnstate'></Header>
    </el-header>
    <el-main><router-view></router-view></el-main>
  </el-container>
</el-container>
</div>
</template>

<style>
.container{
  height: 100%;
}
.el-aside {
  background-color:#d35151;
  border-style:none;
  text-align: center;

}
.el-submenu__title{
  padding-left: 10px !important;
}
.success{
  width: auto !important;
}
.error{
  width: 180px !important;
}
.el-header{
  font-size: 16px;
  background-color: #7c9da5;
  text-align: center;
  line-height: 60px;
  color: #fff;
}
.el-main {
  background-color: #E9EEF3;
  padding: 0 !important;
}

body > .el-container {
  margin-bottom: 40px;
}
.el-container .el-aside {
  line-height: 260px;
}
</style>

<script>
import Nav from '../components/HomeParts/Nav'
import Header from '../components/HomeParts/Header'
export default {
  name: 'home-1',
  components: {
    Nav,
    Header
  },
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    btnstate (isCollapse) {
      this.isCollapse = isCollapse
    }
  }
}
</script>
