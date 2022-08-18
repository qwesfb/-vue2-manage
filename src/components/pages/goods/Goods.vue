<template>
<div class="goods">
<el-card>
    <el-row class="top">
        <el-col :span="7">
          <el-input placeholder="请输入内容"  v-model="data.query" clearable  @clear='getGoodsList'>
            <el-button slot="append" icon="el-icon-search" class="search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"  class="add">
            <el-button type="primary" class="add" @click="addgoods">
                添加商品
            </el-button>
        </el-col>
    </el-row>

    <el-row class="Table">
        <el-table border :data="goodsList"  style="width: 100%">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="600">
            </el-table-column>
            <el-table-column prop="goods_number" label="商品数量" width="150">
            </el-table-column>
            <el-table-column  prop="goods_price" label="商品价格" width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini"  @click="editGoods(scope.row.goods_id)">查看</el-button>
                    <el-button size="mini" type="danger" @click="delGoods(scope.row.goods_id)">删除</el-button>

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
              :page-sizes="[10,20,50,100]"
              layout="total, sizes,prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </template>
    </el-row>
    <!-- 编辑弹出框 -->
    <el-dialog  title="查看商品信息" :visible.sync="editGoodsVisible" >
        <el-form :model="editForm" :rules="addGoodsRules" ref="editFormRef">
            <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goods_name">
            <el-input v-model="editForm.goods_name"  :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" :label-width="formLabelWidth" prop="goods_number">
            <el-input v-model="editForm.goods_number" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" :label-width="formLabelWidth" prop="goods_price">
            <el-input v-model="editForm.goods_price" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品重量"  :label-width="formLabelWidth" prop="goods_weight">
            <el-input v-model="editForm.goods_weight" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品介绍" prop="mobile" :label-width="formLabelWidth">
            <el-input v-model="editForm.goods_introduce" :disabled="true"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</el-card>
</div>
</template>

<script>
export default {
  data () {
    return {
    // 总共商品条数
      total: 0,
      goodsList: [],
      data: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      editGoodsVisible: false,
      editForm: {},
      formLabelWidth: '120px',
      addGoodsRules: {
        goods_name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '商品价格不能为空', trigger: 'blur' },
          { type: 'number', message: '商品价格必须为数字值', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '商品数量不能为空', trigger: 'blur' },
          { type: 'number', message: '商品数量必须为数字值', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '商品重量不能为空', trigger: 'blur' },
          { type: 'number', message: '商品重量必须为数字值', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.data
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户失败')
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },

    handleSizeChange (val) {
      this.data.pagesize = val
      this.getGoodsList()
      console.log(`每页 ${val} 条`)
    },

    handleCurrentChange (val) {
      this.data.pagenum = val
      this.getGoodsList()
      console.log(`当前页: ${val}`)
    },

    async delGoods (id) {
      const test = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (test !== 'confirm') return this.$message.info('已经取消了删除')

      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getGoodsList()
      this.$message.success(res.meta.msg)
    },
    addgoods () {
      this.$router.push('goods/good')
    },

    async editGoods (id) {
      this.editGoodsVisible = true
      const { data: res } = await this.$http.get(`goods/` + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      console.log(this.editForm)
    }
  }
}
</script>
<style lang="less" scoped>
.add{
margin-left: 30px;
}
</style>
