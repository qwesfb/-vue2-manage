<template>
<div class="addgoods">
<el-card>
    <el-row class="top">
      <el-page-header @back="goBack" content="添加商品信息">
      </el-page-header>
    </el-row>
    <el-row class="Table">
        <el-steps :active="active-0" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品属性" ></el-step>
             <el-step title="商品参数" ></el-step>
            <el-step title="商品图片" ></el-step>
            <el-step title="商品内容" ></el-step>
            <el-step title="完成" ></el-step>
        </el-steps>
    </el-row>

    <el-row class="Table">
       <el-form  :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" >
        <!-- before-leave切换标签之前的钩子 -->
        <el-tabs :tab-position="tabPosition" style="height: auto;" v-model="active"
         :before-leave='beforeLeave' @tab-click='tabClicked'>

            <el-tab-pane label="基本信息" name="0">
                <el-form-item label="商品名称" prop='goods_name'>
                  <el-input v-model="addGoodsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop='goods_price'>
                  <el-input v-model="addGoodsForm.goods_price"></el-input>
                </el-form-item>
                 <el-form-item label="商品库存"  prop='goods_number'>
                  <el-input v-model="addGoodsForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量"  prop='goods_weight'>
                  <el-input v-model="addGoodsForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品分类"  prop='goods_cat' >
                  <!-- options数据源  props要配置的属性  v-model选中项绑定值(id) -->
                  <el-cascader  v-model="addGoodsForm.goods_cat"  :options="cateLsit"
                   :props="cateProps" @change="handleChange" clearable >
                  </el-cascader>
                </el-form-item>

            </el-tab-pane>

            <el-tab-pane label="商品属性" name="1">
              <el-form-item v-for="item in onlyTableData" :key="item.attr_id" :label="item.attr_name">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>

             <el-tab-pane label="商品参数" name="2">
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key='item.attr_id'>
                <el-checkbox-group  v-model="item.attr_vals">
                  <el-checkbox v-for="(item,index) in item.attr_vals" :label="item" :key="index" border>

                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
             </el-tab-pane>

            <el-tab-pane label="商品图片" name="3">
              <!-- action上传的地址  on-success文件上传成功时的钩子 无效token-->
              <el-upload
                :action="uploadURL"
                list-type="picture-card"
                :headers="headerObj"
                :on-success='handleSucess'
                :on-remove="handleRemove"
                :on-preview="handlePictureCardPreview">
                <i  class="el-icon-plus"></i>
              </el-upload>
            </el-tab-pane>

            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
              <el-button class="btn" type="primary" @click="clickbtn">完成</el-button>
            </el-tab-pane>

        </el-tabs>
    </el-form>
    </el-row>
    <!-- 上传图片查看框 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="this.dialogImageUrl" alt="">
    </el-dialog>
</el-card>

</div>
</template>

<script>
// 深拷贝插件
import lodash from 'lodash'
export default {
  data () {
    return {
      tabPosition: 'left',
      active: '0',
      addGoodsForm: {
        goods_name: '',
        goods_number: 0,
        goods_price: 0,
        goods_weight: 0,
        // 商品所属的分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 弹出框图片URl
      dialogImageUrl: '',

      // 分类商品数据
      cateLsit: [],
      // 商品分类的选择器的配置属性
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品参数数据
      manyTableData: [],
      // 商品属性
      onlyTableData: [],
      // 图片
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      dialogVisible: false,
      disabled: false,
      // 图片上传请求头对象token
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },

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
    this.getCateList()
  },
  methods: {
    // 商品分类获取
    async getCateList () {
      // eslint-disable-next-line quotes
      const { data: res } = await this.$http.get(`categories`)
      this.cateLsit = res.data
    },
    // 选择器改变，触发
    handleChange () {
      // console.log(this.addGoodsForm.goods_cat);
      // 商品分类必须是第三类具体商品
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // Function(activeName, oldActiveName),下一步前先判断
    beforeLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请检查是否填写完毕')
        return false
      } else if (this.addGoodsForm.goods_name === '') {
        this.$message.error('请检查是否填写完毕')
        return false
      } else {
        this.addGoodsForm.goods_price = Number(this.addGoodsForm.goods_price)
        this.addGoodsForm.goods_number = Number(this.addGoodsForm.goods_number)
        this.addGoodsForm.goods_weight = Number(this.addGoodsForm.goods_weight)
      }
    },

    // 点击切换为参数时，获取商品参数数据
    async tabClicked () {
      if (this.active === 1) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'only' }
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.onlyTableData = res.data
      } else if (this.active === 2) {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: { sel: 'many' }
        })
        if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败')
        // 具体参数是字符串，改成数组,且用空格分割
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        console.log(this.manyTableData)
      }
    },

    // 图片放大查看
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.response.data.url
      this.dialogVisible = true
    },

    // 删除
    handleRemove (file) {
      const fileInfo = file.response.data.url
      // 在pic数组找到图片对应索引
      const x = this.addGoodsForm.pics.findIndex(i =>
        i.pic === fileInfo)
      this.addGoodsForm.pics.splice(x, 1)
    },
    // 上传成功
    handleSucess (response) {
      // 拼接图片信息
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm)
    },
    async clickbtn () {
      this.$refs.addGoodsRef.validate(valid => {
        if (!valid) return this.$message.error('请检查表单')
      })
      // 把addGoodsForm传递数据库
      // goods_cat要求是字符串，在商品分类中已经把他转化成数组
      // 如果重新转换回来，商品分类的级联选择器不行，所以进行深拷贝（插件：lodash）
      const form = lodash.cloneDeep(this.addGoodsForm)
      form.goods_cat = form.goods_cat.join(',')
      // console.log(form);
      // 处理动态参数
      this.manyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals.join(' ')
        }
        this.addGoodsForm.attrs.push(newInfo)
      })
      // 静态参数
      this.onlyTableData.forEach(item => {
        const newInfo = {
          attr_id: item.attr_id,
          attr_value: item.attr_vals
        }
        this.addGoodsForm.attrs.push(newInfo)
      })
      form.attrs = this.addGoodsForm.attrs

      // 这样可行的请求就放到form里面了!可以用这个发起请求了
      const { data: res } = await this.$http.post('goods', form)
      if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      // 然后利用编程式导航,跳转页面到商品页面
      this.$router.push('/goods')
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    cateId () {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.top{
    font-weight: bolder;
    font-size: 1.5vw;
}
.el-steps{
    width: 80%;
    margin-left: 10%;
}
.btn{
  float:right ;
  margin: 30px 3% 0 0;
}
</style>
