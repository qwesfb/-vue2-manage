<template>
<div class="params">
<el-card>
    <el-row class="top">
        <el-col>
            <span>选择商品分类:</span>
            <el-cascader :options="options" clearable  :props="props" @change="handleChange" v-model="selectedKeys">

            </el-cascader>
        </el-col>
    </el-row>
    <el-row class="Table"  >
       <el-tabs v-model="activeName" @tab-click="handleTabClick">   
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" class="top" :disabled="isBtnDisables"  @click="dialogVisible=true">
                    添加参数</el-button>
                <el-table :data="manyParamsForm" border style="width: 100%" class="Table ">
                     <!-- 展开行 -->
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                            <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="closeTag(index,scope.row)">
                                {{ item }}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>

                     <el-table-column  label="#" width="50" type="index">
                     </el-table-column>
                     <el-table-column  label="参数名称" width="600" prop="attr_name">
                     </el-table-column>
                     <el-table-column  label="操作" >
                        <template slot-scope="scope">
                            <el-button size="mini"  @click="editParams(scope.row.attr_id)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="delParams(scope.row.attr_id)">删除</el-button>
                        </template>
                     </el-table-column>
                </el-table>
            </el-tab-pane>

            <el-tab-pane label="静态参数" name="only"  >
                <el-button type="primary" class="top" :disabled="isBtnDisables" @click="dialogVisible=true">
                    添加参数</el-button>
                <el-table :data="onlyParamsForm" border style="width: 100%" class="Table ">
                     <!-- 展开行 -->
                      <el-table-column type="expand"> </el-table-column>

                     <el-table-column  label="#" width="50" type="index">
                     </el-table-column>
                     <el-table-column  label="参数名称" width="600" prop="attr_name">
                     </el-table-column>
                     <el-table-column  label="操作" >
                        <template slot-scope="scope">
                            <el-button size="mini"  @click="editParams(scope.row.attr_id)">编辑</el-button>
                            
                            <el-button size="mini" type="danger" @click="delParams(scope.row.attr_id)">删除</el-button>
                        </template>
                     </el-table-column>
                </el-table></el-tab-pane>
        </el-tabs>
    </el-row>

    <!-- 添加参数弹框 -->
    <el-dialog
        :title="'添加'+title"
        :visible.sync="dialogVisible"
        width="30%"
        @close="addParamsClosed">
       <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef">
        <el-form-item :label="title" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
       </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParamsClick">确 定</el-button>
        </span>
    </el-dialog>
       <!-- 修改参数弹框 -->
    <el-dialog
        :title="'修改'+title"
        :visible.sync="editdialogVisible"
        width="30%"
        @close="editParamsClosed">
       <el-form :model="editParamsForm" :rules="addParamsRules" ref="editParamsRef">
        <el-form-item :label="title" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
       </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParamsClick">修改</el-button>
        </span>
    </el-dialog>
</el-card>

</div>
</template>

<script>
export default {
    data() {
        return {
            options:[],
            props:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
           tableData:{},
            activeName: 'many',
            //商品分类3级id
            selectedKeys:[],
            //动态参数
            manyParamsForm:[],
            //静态参数
            onlyParamsForm:[],
            //add弹框参数
            dialogVisible:false,
            addParamsForm:{},
            addParamsRules:{
                attr_name:[{required: true, message: '商品名称不能为空',trigger: 'blur'}]
            },
            //编辑
            editdialogVisible:false,
            editParamsForm:{},
            //按钮，是否文本框
            inputVisible:false,
            //文本框输入内容
            inputValue:''
        }
    },
    created(){
        this.getParamsList()
    },
    methods: {
        async getParamsList(){
            const { data: res } = await this.$http.get(`categories`)
            if(res.meta.status!==200)return this.$message.error(res.meta.msg)
            this.options = res.data
        },

   
        //获取数据判断
        async getParamsData(){
            if(this.selectedKeys.length !== 3){
               this.selectedKeys=[]
               return this.$message.error('只能选择第三级商品')
            }
        //获取动态参数
            const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
			  	params:{sel:this.activeName}
			  })
			  if(res.meta.status!==200)return this.$message.error(res.meta.msg)
               //获取具体参数,新添加的参数/没有具体参数，不留tag,判断是否存在
              res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                //每列单独赋值，inputVisible && inputValue
                item.inputVisible = false
                item.inputValue = ''
              })
              if(this.activeName === 'many'){
                this.manyParamsForm = res.data
                
              }else{
                this.onlyParamsForm = res.data
               
              }


              		    
        },
        handleChange(){
           this.getParamsData()
        },
        //tab便签点击事件
		handleTabClick(tab, event) {
			 this.getParamsData()
		  },
        // 添加的确定按钮
        addParamsClick(){
            this.$refs.addParamsRef.validate( async valid=>{
                if(!valid) return 
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name:this.addParamsForm.attr_name,
                    attr_sel:this.activeName
                })
                if(res.meta.status !== 201) return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
                this.dialogVisible =false
                this.getParamsData()
            })
        },
        
        async editParams(id){
            this.editdialogVisible =true
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
              params: {attr_sel:this.activeName}
            })
            this.editParamsForm =res.data
        },

        async editParamsClick(){
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
                attr_name: this.editParamsForm.attr_name,
                attr_sel: this.activeName
            })
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.$message.success(res.meta.msg)
            this.getParamsData()
            this.editdialogVisible =false
        },


        async delParams(id){
            const confirmResult=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err=>err)
		  	//如果用户确认删除，则返回字符串confirm
		  	//如果用户确认取消，则返回字符串cancel
		  	if(confirmResult!=='confirm')return this.$message.info("已经取消了删除")

            const { data:res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
            //console.log(res);
            if(res.meta.status != 200){
            return this.$message.error(res.meta.msg)
        }
            this.$message.success(res.meta.msg)
            this.getParamsData()
        },

        addParamsClosed(){
            this.$refs.addParamsRef.resetFields()
        },
        editParamsClosed(){
            this.$refs.editParamsRef.resetFields()
        },

        //属性添加
        showInput(val){
            val.inputVisible = true;
        },
        //+New Tag
        showInput(val){
           val.inputVisible = true;
           this.$nextTick(_ => {
			//文本框自动获得焦点
		  	  this.$refs.saveTagInput.$refs.input.focus();
		  	});
        },

       		  //tag标签的事件,把添加的标签显示出来,并保存到数据库
        async handleInputConfirm(val) {
            //如果输入的字符串全是字符,则清空输入框
            if(val.inputValue.trim().length ===0){
                val.inputValue=''
                val.inputVisible=false
                return
            }
             //如果没有return,则需要做后续处理
            let inputValue = val.inputValue;
            if (inputValue) {
                //发起请求,添加新的标签
                val.attr_vals.push(val.inputValue.trim())
                val.inputValue=''
                val.inputVisible=false
                //发起请求,保存本次参数到数据库
                const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${val.attr_id}`,{
                attr_name:val.attr_name,
                attr_sel:val.attr_sel,
                attr_vals:val.attr_vals.join(' ')
                })
                if(res.meta.status!==200)return this.$message.error(res.meta.msg)
                this.$message.success(res.meta.msg)
            }
        },
        //删除对应的tag标签
        async closeTag(i,val){
            //这个splice会修改原数组,所以修改完成之后,发起请求,就可以完成删除了.
            val.attr_vals.splice(i,1)
            //发起请求:将对attr_vals的操作保存到数据库中
            const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${val.attr_id}`,{
                attr_name:val.attr_name,
                attr_sel:val.attr_sel,
                attr_vals:val.attr_vals.join(' ')
                })
                if(res.meta.status!==200)return this.$message.error(res.meta.msg)
                this.$message.success('删除标签成功')
        }
    },
    computed:{
			//要么选中三级,添加按钮恢复
			isBtnDisables(){
				if(this.selectedKeys.length!==3)return true
				return false
			},
            //获取选中商品的id
            cateId(){
                if(this.selectedKeys.length === 3){
                    return this.selectedKeys[2]
                }
                return null
            },
            //共用添加填空的修改参数
            title(){
                if(this.activeName =='many'){
                    return '动态参数'
                }else{
                    return '静态参数'
                }
            }
		}

}
</script>

<style lang="less" scoped>
.el-cascader{
    margin-left: 20px;
}
.el-tag,.el-button--small,.input-new-tag{
    margin: 10px 0 0 20px;
}
.input-new-tag{
    width: 120px;
}
</style>