<script setup lang="ts">
import {getUserInfoAPI} from "@/apis/user";
import type {UserInfo} from "@/types/user";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores";
import {useRouter} from "vue-router";
import {showConfirmDialog} from "vant";

//个人信息数据
const userInfo = ref<UserInfo>()

onMounted(async () => {
   await getUserInfo()
})

// 创建枚举类型
// enum Direction {
//       Up1 = 'Up',
//       Down1 = 'Down',
//       Left = 'Left',
//       Right = 'Right'
// }

// 使用枚举类型
// const changeDirection = (direction: Direction) => {
//   console.log(direction)
// }

// 调用函数时，需要应该传入：枚举 Direction 成员的任意一个
// 类似于 JS 中的对象，直接通过 点（.）语法 访问枚举的成员
// changeDirection(Direction.Down1)

const getUserInfo = async () => {
  const res = await getUserInfoAPI()
  console.log(res)
  userInfo.value = res.data
  // console.log(userInfo.value)
}

//快捷工具数据
const tools = [
  { label: '我的问诊', path: '/user/consult?fromuser=1' },
  { label: '我的处方', path: '/' },
  { label: '家庭档案', path: '/user/patient' },
  { label: '地址管理', path: '/user/address' },
  { label: '我的评价', path: '/' },
  { label: '官方客服', path: '/' },
  { label: '设置', path: '/' }
]

const store = useUserStore()
const router = useRouter()
const logout = async()=>{
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出优医问诊吗？'
  })
  store.delUser()
  router.push('/login')
}
</script>

<template>
  <div class="user-page" v-if="userInfo">
    <div class="user-page-head">
      <div class="top">
        <!--<van-image-->
        <!--    round-->
        <!--    fit="cover"-->
        <!--    src="@/assets/avat.jpg"-->
        <!--/>-->
        <img :src="userInfo.avatar">
        <div class="name">
          <p>{{ userInfo.account }}</p>
          <p>
            <van-icon name="edit"/>
          </p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ userInfo.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ userInfo.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{userInfo.couponNumber}}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order">全部订单
          <van-icon name="arrow"/>
        </router-link>
      </div>
      <van-row>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.paidNumber">
            <cp-icon name="user-paid" />
          </van-badge>
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.shippedNumber">
            <cp-icon name="user-shipped" />
          </van-badge>
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.receivedNumber">
            <cp-icon name="user-shipped" />
          </van-badge>
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <van-badge :content="userInfo.orderInfo.finishedNumber">
            <cp-icon name="user-shipped" />
          </van-badge>
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell  v-for="(item,index) in tools" :key="item.label" :title="item.label" is-link :border="false" :to="item.path">
        <template #icon><cp-icon name="user-tool-01" /></template>
      </van-cell>
    </div>
    <a class="logout" href="javascript:;" @click="logout">退出登录</a>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;
  // 头部
  &-head {
    height: 200px;
    background: linear-gradient(180deg, rgba(30, 190, 60, 0.46), rgba(44, 181, 165, 0));
    margin: 0 -15px;
    padding: 0 15px;

    .top {
      display: flex;
      padding-top: 50px;
      align-items: center;

      .van-image {
        width: 70px;
        height: 70px;
      }

      img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
      }

      .name {
        padding-left: 10px;

        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }

          &:last-child {
            margin-top: 10px;
            color: var(--cp-primary);
            font-size: 16px;
          }
        }
      }
    }

    .van-row {
      margin: 0 -15px;
      padding-top: 15px;

      p {
        text-align: center;

        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }

        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }

  // 订单
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;

    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;

      a {
        color: var(--cp-tip);
      }
    }

    .van-col {
      text-align: center;

      .cp-icon {
        font-size: 28px;
      }

      p {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }

  // 分组
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    h3 {
      padding-left: 16px;
      line-height: 44px;
    }

    .van-cell {
      align-items: center;
    }

    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }

  .logout {
    display: block;
    margin: 20px auto;
    width: 100px;
    text-align: center;
    color: var(--cp-price);
  }
}
</style>