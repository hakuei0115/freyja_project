export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $swal, isHyrating, payload } = useNuxtApp();
    // 防止 $fetch 執行兩次
    if (
        import.meta.client && isHyrating && payload.serverRendered
    ) {
        return;
    }
    const auth = useCookie('auth');
    if (!auth.value) {
        $swal.fire({
            position: "center",
            icon: 'success',
            title: '請先登入',
            showConfirmButton: false,
            timer: 1500
        });
        return await navigateTo('/account/login');
    }
    try {
        const res = await $fetch('/user/check', {
            baseURL: 'https://nuxr3.zeabur.app/api/v1',
            headers: { Authorization: auth.value }
        });
        if (!res?.status) {
            $swal.fire({
                position: "center",
                icon: 'success',
                title: '請先登入',
                showConfirmButton: false,
                timer: 1500
            });
            return await navigateTo('/account/login');
        } else {
            return;
        }
    } catch (error) {
        console.log(error);
        $swal.fire({
            position: "center",
            icon: 'success',
            title: '請先登入',
            showConfirmButton: false,
            timer: 1500
        });
        return await navigateTo('/account/login');
    }
});
