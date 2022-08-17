import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "@/components/Home.vue"
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login},
  { path:'/home', component: Home, redirect:'/reports',meta: {title: '首页'},
  children:[
    {path:'data', 
    meta: {title: '用户管理'}, 
    redirect:'/users', 
    component: () => import('../components/two/data'),
    children:[
      {path:'/users',
      name: 'users', 
      meta: {title: '用户列表'},
      component: () => import('../components/pages/data/User')}]},

    {path:'power', 
    meta: {title: '权限管理'}, 
    redirect:'/roles', 
    component: () => import('../components/two/power'),
    children:[
      {path:'/roles',
      name: 'roles', 
      meta: {title: '角色列表'},
      component: () => import('../components/pages/power/Roles')},
      {path:'/rights',
      name: 'rights', 
      meta: {title: '权限列表'},
      component: () => import('../components/pages/power/Rights')}
    ]},

    {path:'goods', 
    meta: {title: '商品管理'}, 
    redirect:'/goods', 
    component: () => import('../components/two/goods'),
    children:[
      {path:'/goods',
      name: 'goods', 
      meta: {title: '商品列表'},
      component: () => import('../components/pages/goods/Goods')
      },
      {path:'/params',
      name: 'params', 
      meta: {title: '分类参数'},
      component: () => import('../components/pages/goods/Params')},
      {path:'/categories',
      name: 'categories', 
      meta: {title: '商品分类'},
      component: () => import('../components/pages/goods/Categories')},
      
      {path:'/goods/good',
      name: 'addgoods', 
      meta: {title: '添加商品'},
      component: () => import('../components/pages/goods/AddGoods'),
      children:[]
    }
    ]},
    {path:'order', 
    meta: {title: '订单管理'}, 
    redirect:'/orders', 
    component: () => import('../components/two/order'),
    children:[
      {path:'/orders',
      name: 'orders', 
      meta: {title: '订单列表'},
      component: () => import('../components/pages/orders/Orders')}]},

    {path:'reports', 
    meta: {title: '数据统计'}, 
    redirect:'/reports', 
    component: () => import('../components/two/report'),
    children:[
      {path:'/reports',
      name: 'reports', 
      meta: {title: '数据报表'},
      component: () => import('../components/pages/report/Reports')}]},

  ],
  

}
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if(to.path =='/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next()
})


export default router
