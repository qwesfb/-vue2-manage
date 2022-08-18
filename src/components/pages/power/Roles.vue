<template>
<div class="roles">
 <el-card>
     <el-row class="top">
        <el-button type="primary" @click="dialogVisible = true">添加角色
        </el-button>
     </el-row>
     <!-- 表格 -->
      <el-row class="Table">
  <el-table :data="tableData" style="width: 100%"  border>
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-row v-for="(itema,indexa) in props.row.children" :key="itema.id" :class="['bbottom',indexa == 0?'btop':'','Vcenter']"  >
            <el-col :span="5">
                <el-tag  closable>{{ itema.authName}}</el-tag>
            </el-col>
            <el-col :span='19'>
                <el-row v-for="(itemb,indexb) in itema.children" :key="itemb.id" :class="[indexb == 0?'':'btop','Vcenter']">
                    <el-col :span="6">
                    <el-tag closable type="success">{{itemb.authName}}</el-tag>
                    </el-col>
                    <el-col :span="18">
                        <el-col>
                          <el-tag closable type="warning" v-for="(itemc,index) in itemb.children"
                            :key="itemc.id" @close='remove(props.row,itemc.id)' >
                                {{itemc.authName}}
                          </el-tag>
                        </el-col>

                    </el-col>
                </el-row>
            </el-col>

       </el-row>
    </template>
    </el-table-column>

    <el-table-column label="角色名称" prop="roleName">
    </el-table-column>
    <el-table-column label="角色工位" prop="roleDesc">
    </el-table-column>
    <el-table-column label="操作" prop="desc">
        <template slot-scope="scope">
        <el-button size="mini"  @click="ediDialog(scope.row.id)">编辑</el-button>
        <el-button size="mini" type="danger" @click="delRoles(scope.row.id)">删除</el-button>

        <el-button size="mini" type="warning" @click="showSet(scope.row)">分配权限</el-button>

        </template>
    </el-table-column>
  </el-table>
      </el-row>
    </el-card>
     <!-- 添加角色弹出框 -->
    <el-dialog title="角色信息" :visible.sync="dialogVisible"  @close="clear">
      <el-form :model="addRoles" :rules="addRolesRules" ref="addRolesRef">
        <el-form-item label="用户名" prop="roleName" >
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="工位" prop="roleDesc" >
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="提示" :visible.sync="setdialogVisible" width="30%" @close="clearPower">
          <!-- 树形控件 node-key-->
      <el-tree :data="setlist" :props="treeProps"
      :default-checked-keys="defkeys" show-checkbox
       node-key="id" ref="treeRef"></el-tree>

      <span slot="footer" class="dialog-footer">
          <el-button @click="setdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allQuwer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog title="角色信息" :visible.sync="editdialogVisible"  @close="editdialogClosed">
      <el-form :model="editRoles" :rules="addRolesRules" ref="editRolesRef">
        <el-form-item label="角色名称" prop="roleName" >
          <el-input v-model="editRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色工位" prop="roleDesc" >
          <el-input v-model="editRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolsesInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      setdialogVisible: false,
      editdialogVisible: false,
      tableData: [],
      // 编辑保存
      editRoles: {},
      //  权限保存
      setlist: [],
      // 勾选的节点的 key 的数组
      defkeys: [],
      // 获取权限的角色id
      roleId: '',
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      addRoles: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        roleName: [
          { required: true, message: '角色名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '角色工位', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.rolesList()
  },
  methods: {
    async rolesList () {
      const { data: res } = await this.$http.get(`roles`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.tableData = res.data
      console.log(this.tableData)
    },
    async remove (role, rigjtId) {
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rigjtId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    add () {
      // $refs+this.ref.name 获取到的是dom元素validate预校验
      this.$refs.addRolesRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addRoles)
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        this.dialogVisible = false
        this.rolesList()
      })
    },
    // 重置操作
    clear () {
      this.$refs.addRolesRef.resetFields()
    },
    clearPower () {
      this.defkeys = []
    },
    editdialogClosed () {
      this.$refs.editRolesRef.resetFields()
    },
    async delRoles (id) {
      const { data: res } = await this.$http.delete(`roles/`+id)
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.rolesList()
    },
    // 分配权限
    async showSet (roles) {
      // 角色id
      this.roleId = roles.id
      this.setdialogVisible = true
      // 获得所有权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.dialogVisible = false
      this.setlist = res.data
      // console.log(this.setlist);

      // 点击，调用getLeafKeys()递归获取3级节点的id,roles传递过来的角色名称id
      this.getLeafKeys(roles, this.defkeys)
    },

    // 通过递归的形式，获取角色所有的三级权限的iD
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 没有children就是三级权限的iD
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      })
    },

    // 点击确定后角色添加权限
    // 获取选择权限的id == keys
    async allQuwer () {
      const keys = [
        // 三点运算符的作用是展开,本来两个返回的都是数组,现在把它展开了,然后放置在一个数组中
        // 全部选中的节点的key,返回一个数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 半选中的节点的key,返回一个数组
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 拼接
      const idStr = keys.join(',')
      // :roleId从获取列表得到角色id
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      this.rolesList()
      this.setdialogVisible = false
    },
    // 编辑editform
    async ediDialog (id) {
      this.editdialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editRoles = res.data
      // console.log(this.editRoles);
    },
    // 编辑后表单的验证和提交
    editRolsesInfo () {
      this.$refs.editRolesRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editRoles.roleId, {
          roleName: this.editRoles.roleName,
          roleDesc: this.editRoles.roleDesc
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editdialogVisible = false
        this.$message.success('修改成功')
        this.rolesList()
      })
    }
  }

}
</script>

<style lang="less" scoped>

.bbottom{
    border-bottom: 1px solid #eee;
}
.btop{
   border-top: 1px solid #eee;
}
.el-dialog{
  position: absolute;
}
.el-tag {
    margin: 10px;
}
.Vcenter{
    display: flex;
    align-items: center;
}
</style>
