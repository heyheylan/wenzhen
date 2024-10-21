import {ref} from 'vue'
import {followAPI} from "@/apis/consult";
import type {Doctor, FollowType} from "@/types/consult";
import {showSuccessToast} from "vant";

//关注医生
export const useFollow = () =>{
    const loading = ref(false)
    const follow = async (item:{id:string,likeFlag:0|1},type:FollowType)=>{
        // console.log(item.id)
        loading.value = true
        try {
            const res = await followAPI(type,item.id)
            // console.log(res)
            item.likeFlag = item.likeFlag === 1 ? 0 : 1
            if(res.code === 10000){
                showSuccessToast(item.likeFlag === 1 ? '关注成功' : '取消关注成功')
            }
        }finally {
            loading.value = false
        }
    }


    return{
        loading,
        follow //使用要传type
    }

}