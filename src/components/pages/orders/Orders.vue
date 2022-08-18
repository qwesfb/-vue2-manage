<template>
<div class="orders">
<el-card>
    <el-row class="top">
        <el-col :span="7"> <!--    @click="userList()"-->
        <el-input placeholder="查找订单" clearable v-model="ordersData.query"  @clear="getOrdersList()">
            <el-button slot="append" icon="el-icon-search" class="search" @click="getOrdersList()">

            </el-button>
        </el-input>
        </el-col>
    </el-row>

    <el-row class="Table">
    <el-table border :data="ordersList" style="width: 100%">
        <el-table-column type="index" width="30">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="200">

        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column  label="支付情况" width="120">
             <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.order_pay=='0'">未付款</el-tag>
                <el-tag type="success" v-else> 已付款</el-tag>
            </template>

        </el-table-column>
         <el-table-column  prop="is_send" label="发货情况" width="100">
        </el-table-column>
        <el-table-column label="下单时间" width="180">
            <template slot-scope='scope'>
                {{ scope.row.create_time| dataFormat  }}
            </template>
        </el-table-column>
         <el-table-column  prop="consignee_addr" label="发货地址" width="250">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
                <el-button type="primary" icon="el-icon-edit" circle @click="editAddress(scope.row.order_id)">
                </el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="物流信息" placement="top">
                <el-button type="success" icon="el-icon-location-information" circle @click="searchdialogVisible =true"></el-button>
                 </el-tooltip>
                 <el-tooltip class="item" effect="dark" content="订单信息" placement="top">
                <el-button type="warning" icon="el-icon-goods" circle @click="editOrder(scope.row.order_id)"></el-button>
                 </el-tooltip>
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
              :current-page.sync="ordersData.pagrnum"
              :page-size="ordersData.pagesize"
              :page-sizes="[10,20,50,100]"
              layout="total, sizes,prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </template>
    </el-row>
    <!-- 修改地址 -->
    <el-dialog
        title="修改地址信息"
        :visible.sync="editdialogVisible"
        width="50%"
        @close="editDialogClosed"
        >
        <!-- 内容主体区域，这里有一个匿名插槽 -->
    <el-form :model="adressForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item label="省市区/县" prop="adress1">
                <!-- 选择地址的级联选择框 -->
                <el-cascader
                    v-model="adressForm.adress1"
                    :options="adressList"
                    @change="handleChange"
                    :props="{ expandTrigger: 'hover' }"
                    clearable
                ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" prop="adress2">
                <el-input v-model="adressForm.adress2"></el-input>
            </el-form-item>
    </el-form>
        <!-- 底部区域，这里是一个具名插槽 -->
        <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editInfo">修改</el-button>
        </span>
    </el-dialog>

    <!-- 物流信息 -->
    <el-dialog
    title="查看物流信息"
    :visible.sync="searchdialogVisible"
    width="50%"
    >
    <el-timeline :reverse="reverse">
        <el-timeline-item
        v-for="(item,i) in logistics"
        :key="i"
        :timestamp="item.time"
    >
        {{item.context}}
        </el-timeline-item>
    </el-timeline>
    </el-dialog>

    <!-- 订单信息 -->
    <el-dialog title="订单信息" :visible.sync="ordersdialogTableVisible">
    <el-table :data="goodsForm.goods">
        <el-table-column property="goods_id" label="商品ID" width="150"></el-table-column>
        <el-table-column property="goods_number" label="订单数量" width="200"></el-table-column>
        <el-table-column property="goods_price" label="商品价格"></el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ordersdialogTableVisible= false">确定</el-button>
        </span>
    </el-dialog>

</el-card>
</div>
</template>

<script>
import cityData from './city_data2017_element'
import logistics from './logistics'
export default {
  data () {
    return {
      ordersData: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      ordersList: [],
      dialogVisible: false,
      editFormRules: {
        adress1: [{ required: true, message: '请选择区/县', trigger: 'blur' }],
        adress2: [{ required: true, message: '请输入详细的地址', trigger: 'blur' }]
      },
      adressForm: {
        adress1: [],
        adress2: ''
      },
      // 地址
      // 省市县的三级数据,一个数组，每一级都是对象
      adressList: cityData,
      editdialogVisible: false,
      editForm: {},

      // 物流
      searchdialogVisible: false,
      reverse: true,
      logistics,
      // 订单
      ordersdialogTableVisible: false,
      goodsForm: []
    }
  },
  created () {
    this.getOrdersList()
  },
  methods: {
    async getOrdersList () {
      const { data: res } = await this.$http.get(`orders`, {
        params: this.ordersData
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.ordersList = res.data.goods
      this.total = res.data.total
      console.log(this.ordersList)
    },
    // 监听页数条数
    handleSizeChange (newSize) {
      console.log(`每页 ${newSize} 条`)
      this.ordersData.pagesize = newSize
      this.getOrdersList()
    },
    // 监听页码变化
    handleCurrentChange(newPage) {
      console.log(`当前页: ${newPage}`)
      this.ordersData.pagenum = newPage
      // 重新调用data参数获取用户数据
      this.getOrdersList()
    },

    handleChange (value) {
    },
    async editAddress (id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get(`orders/` + id)
      this.editForm = res.data
    },

    editInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`orders/` + this.editForm.order_id, {
          order_price: this.editForm.order_price,
          consignee_addr: this.adressForm.adress1 + ' ' + this.adressForm.adress2
        })
        if (res.meta.status !== 201) {
          return this.$message.error('修改订单失败！')
        }
        this.getOrdersList()
        this.editdialogVisible = false
      })
    },

    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    // 订单
    async editOrder (id) {
      this.ordersdialogTableVisible = true
      const { data: res } = await this.$http.get(`orders/` + id)
      this.goodsForm = res.data
      console.log(this.goodsForm)
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
    width: 100%;
}
</style>
