<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/user.jpg">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <!-- <el-aside :width="isCollapse ? '64px' : '200px'" style="transition: all .5s ease"> -->
      <el-aside :width="asideWidth" style="transition: all .5s ease">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单 -->
        <!-- :default-active="$route.path" -->
        <el-menu
          background-color="#FFDEAD"
          text-color="#111"
          active-text-color="#FF8C00"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
          >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuLists" :key="item.id">
            <!-- 一级菜单的模板 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path + '')">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { request } from "../network/request";

export default {
  name: "Home",
  data() {
    return {
      menuLists: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      // iconLists: []
      // 是否折叠
      isCollapse: false,
      // 被激活的链接的地址
      activePath: ''
    }
  },
  computed: {
    asideWidth() {
      if(this.isCollapse) {
        return '64px'
      } else {
        return '200px'
      }
    }
  },
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取菜单
    getMenuList() {
      request({
        url: 'menus',
        method: 'get'
      }).then(res => {
        // console.log(res);
        if(res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.menuLists = res.data.data
        // console.log(this.menuLists);
      })
    },
    // 切换菜单的折叠和展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: rgb(151, 149, 126);
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }
  .el-header img {
    width: 61px;
    height: 56px;
  }
  .el-aside {
    background-color: rgb(175, 175, 142);
    .el-menu {
      border-right: none;
    }
  }
  .el-main {
    background-color: rgb(255, 250, 243);
  }
  .iconfont {
    margin-right: 10px;
  }
  .toggle-button {
    background-color: rgb(168, 157, 132);
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>