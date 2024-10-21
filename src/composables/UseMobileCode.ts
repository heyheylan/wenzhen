import {sendMobileCode} from "@/apis/user";
import {showSuccessToast,type FormInstance} from "vant";
import {ref,onMounted,type Ref} from "vue";
import type {CodeType} from "@/types/user";

export function  useMobileCode ( mobile:Ref<string>,type:CodeType ,code:Ref<string>){
    const time = ref(0)
    const form = ref<FormInstance>()
    let timeId:number

    const send = async ()=>{
        // 已经倒计时time的值大于0，此时不能发送验证码
        if (time.value > 0) return

        // 验证不通过报错，阻止程序继续执行
        await form.value?.validate('mobile')  //检验mobile是否有值
        const res = await sendMobileCode(mobile.value,type)
        code.value = res.data.code
        console.log(code.value)
        showSuccessToast('发送成功')
        time.value = 60

        // 倒计时开始
        if(timeId) clearInterval(timeId)
        timeId = window.setInterval(()=>{
            time.value--
            if(time.value <= 0) window.clearInterval(timeId)
        },1000)

    }

    onMounted(()=>{
        clearInterval(timeId)
    })

    return{
        time,
        send,
        form,
    }
}