<script setup lang="ts">
import {getMedicalOrderDetailAPI, getMedicalOrderLogisticsAPI} from "@/apis/order";
import type {Logistics} from "@/types/order";
import { onMounted, ref} from "vue";
import {useRoute,useRouter} from "vue-router";
import AMapLoader from '@amap/amap-jsapi-loader'
import endImg from '@/assets/end.png'
import startImg from '@/assets/start.png'
import carImg from '@/assets/car.png'


const route = useRoute()
const router = useRouter()

//获取物流信息
const logistics = ref<Logistics>()
onMounted(async () =>{
  //物流信息
  const res = await  getMedicalOrderLogisticsAPI(route.params.id as string)
  console.log(res)
  logistics.value = res.data


  // 设置高德地图安全配置
  window._AMapSecurityConfig = {
    securityJsCode: 'ef30fdd3d2cfe98afbbf4d67421f91d5'
  };

  await AMapLoader.load({
    key: '9a93e2c9bb3bb947580cf3d182f465f5',
    version: '2.0'
  }).then((AMap) => {
    // 使用 Amap 初始化地图
    const map = new AMap.Map('map', {
      // 设置地图容器id
      mapStyle:"amap://styles/fresh",
      viewMode: "3D", // 是否为3D地图模式
      zoom: 11, // 初始化地图级别
      // center: [116.397428, 39.90923], // 初始化地图中心点位置
    })

    AMap.plugin('AMap.Driving',function (){
      const driving = new AMap.Driving({
        map: map,
        showTraffic:false,
        // hideMarkers: true
      })

      // 起点
      const start = res.data.logisticsInfo.shift()
      const startMarker = new AMap.Marker({
        position: [start?.longitude, start?.latitude],
        icon: startImg
      })
      // map.add(startMarker)
      // 终点
      const end = res.data.logisticsInfo.pop()
      //自定义标点图片
      const endMarker = new AMap.Marker({
        position: [end?.longitude, end?.latitude],
        icon: endImg
      })
      // map.add(endMarker)

      //导航信息查询
      driving.search(
          //经纬度
          [start?.longitude, start?.latitude],
          [end?.longitude, end?.latitude],
          //途径点
          { waypoints: res.data.logisticsInfo.map((item) => [item.longitude, item.latitude]) },
          //查询状态
          (status: string, result: object) => {
            // 未出错时，result即是对应的路线规划方案
            console.log(status, result)
            const marker = new AMap.Marker({
              icon:carImg,
              position: [
                  res.data.currentLocationInfo.longitude,
                  res.data.currentLocationInfo.latitude
                ],
              anchor: 'center'
            })
            map.add(marker)
            setTimeout(()=>{
              map.setFitView([marker])
              map.setZoom(10)
            },2000)
          }
      )
    })
  })
})

</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ logistics?.statusValue }} 预计{{ logistics?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status" v-if="item.statusValue">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}
#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;
  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    > span {
      flex: 1;
      text-align: center;
    }
    .van-icon {
      font-size: 18px;
      color: #666;
      &:last-child {
        color: var(--cp-primary);
      }
    }
  }
  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;
    .status {
      font-size: 15px;
      line-height: 26px;
    }
    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;
      > span {
        padding-right: 10px;
      }
    }
  }
}
.logistics {
  padding: 0 10px 20px;
  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }
  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }
    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }
    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }
    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>