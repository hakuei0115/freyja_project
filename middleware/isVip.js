export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $swal, isHyrating, payload } = useNuxtApp();

    if (import.meta.client && isHyrating && payload.serverRendered) {
        return;
    }

    const buyVip = useCookie("buyVip");

    if (!buyVip.value) {
        $swal.fire({
            position: "center",
            icon: 'error',
            title: '請先從註冊頁面確認購買 VIP',
            showConfirmButton: false,
            timer: 1500
        });

        return await navigateTo('/account/signup');
    }
});
