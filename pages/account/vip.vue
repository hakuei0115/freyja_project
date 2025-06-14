<script setup>
const router = useRouter();
const { $swal } = useNuxtApp();
const accountStore = useAccountStore();
const { vipInfo } = storeToRefs(accountStore);

definePageMeta({
    layout: 'account'
});

useHead({
    title: 'Freyja | 會員專區',
    meta: [
        { name: 'description', content: '享受專屬 VIP 會員特權，立即升級為 VIP！' },
        { property: 'og:title', content: 'Freyja | 會員專區' },
        { property: 'og:description', content: '享受專屬 VIP 會員特權，立即升級為 VIP！' },
        { name: 'twitter:title', content: 'Freyja | 會員專區' },
        { name: 'twitter:description', content: '享受專屬 VIP 會員特權，立即升級為 VIP！' }
    ]
});

useSeoMeta({
    title: 'Freyja | 會員專區',
    description: '享受專屬 VIP 會員特權，立即升級為 VIP！',
    ogTitle: 'Freyja | 會員專區',
    ogDescription: '享受專屬 VIP 會員特權，立即升級為 VIP！',
    twitterTitle: 'Freyja | 會員專區',
    twitterDescription: '享受專屬 VIP 會員特權，立即升級為 VIP！'
})

const handlePayment = async () => {
    if (!vipInfo.value) {
        return $swal.fire('錯誤', '無法取得會員資訊，請重新登入。', 'error')
    }

    const confirm = await $swal.fire({
        title: '確認付款？',
        text: '付款後即可升級為 VIP 會員，享有專屬優惠與權限。',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '確認付款',
        cancelButtonText: '取消',
    })

    if (confirm.isConfirmed) {
        localStorage.setItem('isVIP', 'true')
        localStorage.setItem('vipUser', JSON.stringify(vipInfo.value))

        await $swal.fire({
            title: '付款成功 🎉',
            text: '恭喜您成為 VIP 會員！',
            icon: 'success',
        })

        router.push('/')
    }
}
</script>

<template>
    <div class="container py-10">
        <h2 class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">VIP 付款頁面</h2>
        <p class="mb-4 text-neutral-0 fw-bold">付款後即可立即成為 VIP 會員，享有專屬優惠。</p>

        <div class="flex flex-col gap-4">
            <button class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold mb-4" @click="handlePayment">
                💳 立即付款升級 VIP
            </button>
            <button class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold" @click="router.push('/')">
                🏠 返回首頁
            </button>
        </div>
    </div>
</template>

<style scoped>
/* .container {
    max-width: 600px;
    margin: 0 auto;
} */
</style>