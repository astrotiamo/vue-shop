<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template v-slot="slot">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in slot.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRighById(slot.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRighById(slot.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable @close="removeRighById(slot.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{slot.row}}
            </pre> -->
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="286px">
          <template v-slot="slot">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditRoleDialog(slot.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(slot.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(slot.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleVisible"
        width="50%" @close="addRoleDialogClosed">
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editRoleDialogVisible"
        width="50%" @close="editRoleDialogClosed">
        <el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="70px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRoleInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限的对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%"
        @close="closeSetRightDialog">
        <!-- 树形控件 -->
        <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="closeSetRightDialog">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      addRoleVisible: false,
      addRoleForm: {},
      addRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      editRoleDialogVisible: false,
      editRoleForm: {},
      editRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名', trigger: 'blur'},
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色的列表
    async getRolesList() {
      const res = await request({
        url: 'roles',
        method: 'get'
      })
      if(res.data.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！');
      }
      this.roleList = res.data.data
      // console.log(this.roleList);
    },
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 添加角色
    addRoleInfo() {
      request({
        url: 'roles',
        method: 'post',
        data: this.addRoleForm
      }).then(res => {
        console.log(res);
        if(res.data.meta.status !== 201) {
          return this.$message.error('添加角色失败！');
        }
        this.$message.success('添加角色成功!')
        this.getRolesList()
        this.addRoleVisible = false
      })
    },
    //展示编辑角色对话框
    showEditRoleDialog(id) {
      request({
        url: 'roles/' + id,
        method: 'get'
      }).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) {
          return this.$message.error('查询角色信息失败！')
        }
        this.editRoleForm = res.data.data
        // console.log(res);
      })
      this.editRoleDialogVisible = true
    },
    // 取消编辑对话框
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 修改角色信息并提交
    editRoleInfo() {
      this.$refs.editRoleFormRef.validate(valid => {
        if(!valid) return
        // 发起修改用户信息的数据请求
        request({
          url: 'roles/' + this.editRoleForm.roleId,
          method: 'put',
          data: {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        }).then(res => {
          // console.log(this.editRoleForm.roleId);
          // console.log(res);
          if(res.data.meta.status !== 200) {
            return this.$message.error('更新角色信息失败！')
          }
          // 关闭对话框
          this.editRoleDialogVisible = false
          // 刷新数据列表
          this.getRolesList()
          // 提示修改成功
          this.$message.success('更新角色信息成功！')
        })
      })
    },

    // 根据id删除对应的角色消息
    async removeRoleById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const res = await request({
        url: 'roles/' + id,
        method: 'delete'
      })
      if(res.data.meta.status !== 200) {
        return this.$message.error('删除角色失败！')
      }
      this.$message.success('删除角色成功')
      this.getRolesList()
    },

    // 根据id删除对应的权限
    async removeRighById(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除角色权限，是否继续删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if(confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const res = await request({
        url: `roles/${role.id}/rights/${rightId}`,
        method: 'delete'
      })
      if(res.data.meta.status !== 200) {
        return $message.error('删除权限失败')
      }
      // this.getRolesList()
      role.children = res.data.data
    },

    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const res = await request({
        url: 'rights/tree',
        method: 'get'
      })
      if(res.data.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
      }
      this.rightslist = res.data.data
      // console.log(this.rightslist);

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },

    // 关闭分配权限对话框
    closeSetRightDialog() {
      this.setRightDialogVisible = false
      this.defKeys = []
      // console.log(this.defKeys);
    },
    
    // 通过递归形式获取角色下所有三级权限的id，并保存到defKeys中
    getLeafKeys(node, arr) {
      // arr = []
      // 如果当前node节点不含children属性，则是三级节点
      if(!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
      // console.log(this.defKeys);
    },

    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const res = await request({
        url: `roles/${this.roleId}/rights`,
        method: 'post',
        data: {
          rids: idStr
        }
      })
      if(res.data.meta.status !== 200) {
        return this.$message.error('分配角色权限失败')
      }
      this.$message.success('分配角色权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>