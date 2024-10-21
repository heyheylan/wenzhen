import type {User} from "@/types/user";
import { defineStore } from 'pinia'
import {ref} from 'vue'

export const useUserStore = defineStore('cp-user',()=>{
    //用户信息
    const user = ref<User>()


    //设置用户信息函数
    const SetUser = (data:User)=>{
        user.value = data
        // console.log(1)
    }

    //清空用户信息函数
    const delUser = ()=>{
        user.value = undefined
    }

    return {
        user,
        SetUser,
        delUser
    }
},
    {
        //数据持久化
        persist: true
    }
)