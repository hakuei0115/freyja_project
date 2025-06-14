export const useAccountStore = defineStore('account', () => {
    const accountInfo = ref(null);
    const vipInfo = ref(null);
    const isVip = ref(false);

    const setAccountInfo = (account) => {
        accountInfo.value = account;
    };
    
    const setVipInfo = (vip) => {
        vipInfo.value = vip;
        isVip.value = !!vip; // Set isVip to true if vipInfo is not null
    }

    const changeVipStatus = (status) => {
        isVip.value = status;
    };

    return {
        accountInfo,
        setAccountInfo,
        vipInfo,
        setVipInfo,
        isVip,
        changeVipStatus
    }
},
{
    persist: true
});
