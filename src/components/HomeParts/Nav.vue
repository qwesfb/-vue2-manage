<template>
  <div class="nav">
      <el-row class="tac" >
          <el-col :span="24">
              <el-menu      
              class="el-menu-vertical-demo"
              background-color="#d35151"
              text-color="#fff"
              :collapse="isCollapse"
              active-text-color="#ffd04b"
              unique-opened
              router
              :default-active="activePath"
              >
              <!-- 一级菜单 -->
              <el-submenu :index="item.id+' '" v-for="item in menuList" :key='item.id'>
                <template slot="title">
                  <i :class="iconsObj[item.id]"></i>
                  <span slot="title">{{ item.authName }}</span>
                </template>
                    <!-- 二级菜单 -->
              <el-menu-item :index="'/'+subItem.path" v-for='subItem in item.children' :key='subItem.id'
              @click="savaNvaState('/'+subItem.path)">
                <template>
                  <span slot="title">{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
              </el-submenu>
              
              </el-menu>
          </el-col>
          </el-row>
  </div>
</template>


<script>
  export default {
    name:'Nav',
    props: ['isCollapse'],
    data() {
        return {
             isCollapse:'',
             //菜单数据
             menuList:[],
             iconsObj:{
              '125' : 'el-icon-user',
              '103' : 'el-icon-key',
              '101' : 'el-icon-goods',
              '102' : 'el-icon-box',
              '145' : 'el-icon-s-data',
             },
             //激活状态
             activePath:''
        }
    },
    created(){
      this.getMemuList(),
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      //获取菜单信息
      async getMemuList(){
       const{ data: res } =  await this.$http.get('menus')
        if(res.meta.status != 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
       //console.log(this.menuList);
      },
      savaNvaState(activePath){
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath=activePath
      }
    },
    
  }
</script>



<style lang="less" scoped>
.el-menu{
 border: none;
 i{
  color: #fff;
 }
}

</style>
