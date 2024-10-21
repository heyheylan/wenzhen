import CpNavBar from '@/components/cp-nav-bar.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpIcon from "@/components/cp-icon.vue";
import CpPaySheet from '@/components/CpPaySheet.vue'
import CpConsultMore from '@/components/CpConsultMore.vue'
declare module 'vue' {
    interface GlobalComponents {
        CpNavBar: typeof CpNavBar
        CpRadioBtn: typeof CpRadioBtn
        CpIcon: typeof CpIcon
        CpConsultMore: typeof CpConsultMore
        CpPaySheet: typeof CpPaySheet
    }
}