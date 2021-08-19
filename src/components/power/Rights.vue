<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="slot">
            <el-tag v-if="slot.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="slot.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else-if="slot.row.level === '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { request } from "../../network/request";

export default {
  name: "Rights",
  data() {
    return {
      // 所有权限列表
      rightsList: []
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    // 获取权限列表
    async getRightsList() {
      const res = await request({
        url: 'rights/list',
        method: 'get'
      })
      if(res.data.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！');
      }
      this.rightsList = res.data.data
      // console.log(this.rightsList);
    }
  } 
}
</script>

<style lang="less" scoped>

</style>