<!-- eslint-disable vue/valid-v-else -->
<template>
<div class="categories">
<el-card>
  <el-row class="top">
        <el-button type="primary" @click="showGoodscate">
            添加商品分类
        </el-button>
  </el-row>

   <el-row  class="Table">
     <zk-table
        :data="tableData"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treetable"
        >
        <!-- 是否有效列 -->
        <template slot="isOk" slot-scope="scope">
            <i class="el-icon-success"
                v-if="scope.row.cat_deleted===false"
                style="color: lightgreen;">
            </i>
            <i class="el-icon-error" v-else  style="color: red;"></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.cat_level===0" size="mini">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cat_level===1" size="mini">二级</el-tag>
        <el-tag type="danger" v-else="scope.row.cat_level===2" size="mini">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="opt" slot-scope="scope">
        <el-button   size="mini" @click="editCate(scope.row)">编辑</el-button>
        <el-button type="danger" size="mini" @click="delCate(scope.row.cat_id)">删除</el-button>
        </template>
    </zk-table>
   </el-row>

   <el-row>
    <template>
        <div class="block">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="catdata.pagrnum"
            :page-size="catdata.pagesize"
            :page-sizes="[10,20,50]"
            layout="total, sizes,prev, pager, next"
            :total="total">
        </el-pagination>

        </div>
    </template>
    </el-row>

     <!-- 添加商品分类弹出框 -->
    <el-dialog title="商品分类" :visible.sync="dialogVisible"  @close="clearcat" width="35%">
      <el-form :model="addCat" :rules="addCatRules" ref="addCatRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name" >
          <el-input v-model="addCat.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" >
            <!-- option数据源（显示的内容）props选择器的配置对象 -->
            <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="handleChange"
            clearable>
            </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewCategory">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="修改分类" :visible.sync="editdialogVisible">
      <el-form :model="editCateList"  :rules="addCatRules" ref="editCateRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name" >
          <el-input v-model="editCateList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</div>
</template>
<script>
export default {
  data () {
    return {
      dialogVisible: false,
      editdialogVisible: false,
      editCateList: {},
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 前2级的分类数据列表
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 添加分类请求
      addCat: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCatRules: {
        cat_name: [{ required: true, message: '输入分类名称', trigger: 'blur' }]
      },
      catdata: {
        type: 3,
        // 当前页码值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 10
      },
      tableData: [],
      // 总数据条数
      total: 0,
      columns: [
        // 第一列数据
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        // 第二列数据
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isOk',
          width: '75px'
        },
        // 第三列数据
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        // 第四列数据
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ]
    }
  },
  created () {
    this.getCatdata()
  },
  methods: {
    async getCatdata () {
      // eslint-disable-next-line quotes
      const { data: res } = await this.$http.get(`categories`, { params: this.catdata })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.tableData = res.data.result
      this.total = res.data.total
      // console.log(this.tableData);
    },
    // 监听页面改变
    handleSizeChange (pageSize) {
      this.catdata.pagesize = pageSize
      this.getCatdata()
    },
    // 监听pagenum的改变
    handleCurrentChange (pagenum) {
      this.catdata.pagenum = pagenum
      this.getCatdata()
    },

    // 添加商品分类按钮
    showGoodscate () {
      this.dialogVisible = true
      this.getParentCatelist()
    },
    // 获取前2级分类数据
    async getParentCatelist () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.parentCateList = res.data
      // console.log(this.parentCateList);
    },

    handleChange () {
    // 如果selectedKeys数组中的length大于0,证明选中了父级的分类，新添加的是等级为父级的分类
    // 反之,则说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 取出当前选中的最末尾一级的id,作为当前的值的父级id
        this.addCat.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 接着为当前的分类等级赋值
        this.addCat.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCat.cat_pid = 0
        this.addCat.cat_level = 0
      }
    },
    // 点击对话框的确定按钮
    addNewCategory () {
      this.$refs.addCatRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCat)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCatdata()
        this.dialogVisible = false
      })
    },
    // 重置
    clearcat () {
      this.$refs.addCatRef.resetFields()
      this.selectedKeys = []
      this.addCat.cat_pid = 0
      this.addCat.cat_level = 0
    },
    // 点击编辑
    editCate (data) {
      this.editdialogVisible = true
      // 将本分类得到的数据保存
      this.editCateList = data
    },
    // 编辑按钮
    async editCateInfo () {
      const { data: res } = await this.$http.put(`categories/${this.editCateList.cat_id}`, { cat_name: this.editCateList.cat_name })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getCatdata()
      this.editdialogVisible = false
    },
    // del
    async delCate (id) {
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getCatdata()
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>
