<template>
<div class="reports">
<el-card>
    <el-row class="Table">
        <el-col :span="10" class="colum">
        <el-card class="box-card">
            <i class="el-icon-s-order icons"></i>
            <div class="box">
                <div class="title">今日订单总数</div>
                <div class="count"> 200</div>
            </div>
        </el-card>
        <el-card class="box-card">
            <i class="el-icon-s-goods  icons"></i>
            <div class="box">
                <div class="title">商品总数量</div>
                <div class="count"> 14580</div>
            </div>

        </el-card>
        <el-card class="box-card">
            <i class="el-icon-s-custom icons" ></i>
            <div class="box">
                <div class="title">注册用户人数</div>
                <div class="count">100000+</div>
            </div>
        </el-card>
        <el-card class="box-card">
            <i class="el-icon-present icons"></i>
            <div class="box">
                <div class="title">VIP用户数量</div>
                <div class="count">88888+</div>
            </div>
        </el-card>
        </el-col>
        <!-- 表格 -->
        <el-col :span="12"  :offset="1" id="main" style=" height:400px;" >
        </el-col>
    </el-row>
    <el-row class="table">
        <el-col :span="11" class="colum">
            <el-card class="box-card left-card">
                <div class="headb">商品总览</div>
                <div class="footerb">
                    <ul>
                        <li>
                            <div class="number">1000</div>
                            <div >已下架</div>
                        </li>
                        <li>
                            <div class="number">1000</div>
                            <div >已上架</div>
                        </li>
                        <li>
                            <div  class="number">500</div>
                            <div>库存紧张</div>
                        </li>
                        <li>
                            <div  class="number">5000</div>
                            <div>全部商品</div>
                        </li>
                        </ul>
                </div>
            </el-card>
            <el-card class="box-card left-card">
                 <div class="headb">用户总览</div>
                 <div class="footerb">
                    <ul>
                    <li>
                        <div class="number">100</div>
                        <div>今日新增</div>
                    </li>
                    <li>
                        <div  class="number">200</div>
                        <div >昨日新增</div>
                    </li>
                    <li>
                        <div  class="number">1000</div>
                        <div>本月新增</div>
                    </li>
                    <li>
                        <div  class="number">8900</div>
                        <div>会员总数</div>
                    </li>
                    </ul>
                </div>
            </el-card>
        </el-col>
        <el-col :span="12" :offset="1" >
            <el-card class="info">
             <div class="head">待处理事务</div>
             <div class="footer">
                <ul>
                <li>
                    <span>待付款订单</span>
                    <span class="number">(10)</span>
                     <hr>
                </li>
                <li>
                    <span >已完成订单</span>
                    <span  class="number">(10)</span>
                     <hr>
                </li>
                <li>
                    <span >待确认收货订单</span>
                    <span  style="margin-left:54.5%; color: #;">(10)</span>
                    <hr>
                </li>
                <li>
                    <span>待发货订单</span>
                    <span  class="number">(10)</span>
                     <hr>
                </li>
                <li>
                    <span>新缺货登记</span>
                    <span class="number">(10)</span>
                    <hr>
                </li>
                </ul>
             </div>
            </el-card>
        </el-col>
    </el-row>
</el-card >
</div>
</template>

<script>
// 导入echarts
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      options: {
        title: {
          text: '用户数据'
        },
        // 提示信息
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#d35151'
            }
          }
        },
        // 网格
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // x轴
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },

  // 页面元素被渲染后执行
  async mounted () {
    // 3,基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 4,准备好指定图表的配置项和数据
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) return this.$message.error('获取折线图失败！')
    // 4,准备数据和配置项
    const result = _.merge(res.data, this.options)
    // 5，使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
}
</script>

<style lang="less" scoped>
.Table{
    height: 400px;
    margin-top: 100px;
    margin-bottom: 100px;
}
.table{
    margin-bottom: 20px;
}
.colum{
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    flex-wrap:wrap;
    align-items:stretch ;
    align-content:stretch;
}
.box-card{
    margin-top: 20px;
    width: 200px;
    height: 130px;
    border-radius :20px;
}
.head{
    background-color: #d35151;
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
}
.info{
    margin-right: 50px;
    border-radius :20px
}

.footer{

    height: 300px;
    ul{
        height: 98%;
          li{
            height: 20%;
            line-height: 50px;
            padding-left: 10px;
          }
          .number{
            margin-left:60%;
            color: #d35151;
          }
    }
}
.left-card{
    width: 90%;
    margin-top: 40px;
}
.headb{
    color: #d35151;
    height: 40px;
    line-height: 40px;
    padding-left: 20px;
}
  .footerb ul {
    display: flex;
    margin-left: 20px;
  }

  .footerb ul li {
    flex:1;
    padding:5px 10px;
    .number{
            color: #d35151;
            font-size: 25px;
            margin-bottom: 5px;
    }
  }
.icons{
    font-size: 60px;
    margin: 25px 0  0 10px;
    color: #d35151;
}
.box{
    display: inline-block;
    vertical-align: top;
    padding-top:20px;
    padding-left: 10px;
    .count{
            color: #d35151;
            font-size: 22px;
            padding: 10px 0 0 10px;
    }
  }

</style>
