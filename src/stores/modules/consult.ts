import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import persist from "pinia-plugin-persistedstate";

export const useConsultStore = defineStore('cp-consult',()=>{

    //可选的信息
    const consultInfo = ref<PartialConsult>({})



    //问诊类型
    const setType = (type:ConsultType) => (consultInfo.value.type = type)
    // 设置极速问诊类型
    const setIllnessType = (type: 0 | 1) => {
       consultInfo.value.illnessType = type
        console.log(consultInfo.value.illnessType)
    }
    // 设置科室
    const setDep = (id: string) => (consultInfo.value.depId = id)
    // 设置病情描述
    const setIllness = (
        illness: Pick<PartialConsult, 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'>
    ) => {
        consultInfo.value.illnessDesc = illness.illnessDesc
        consultInfo.value.illnessTime = illness.illnessTime
        consultInfo.value.consultFlag = illness.consultFlag
        consultInfo.value.pictures = illness.pictures
    }
    // 设置患者
    const setPatient = (id: string) => (consultInfo.value.patientId = id)
    // 设置优惠券
    const setCoupon = (id?: string) => (consultInfo.value.couponId = id)
    // 清空记录
    const clear = () => (consultInfo.value = {})

    return{
        consultInfo,
        setType,
        setIllnessType,
        setDep,
        setIllness,
        setPatient,
        setCoupon,
        clear
    }

},
    {
        persist:true
    }

)