<script setup>
definePageMeta({
    middleware: ['auth'],
    layout: 'user'
});

const { $swal } = useNuxtApp();
const route = useRoute();

const isEditPassword = ref(false);
const isEditProfile = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const birthDay = ref('');
const birthYear = ref('');
const birthMonth = ref('');
const city = ref('');
const district = ref('');
const detailAddress = ref('');

const zipcode = [
    { label: '新興區', value: '800' },
    { label: '前金區', value: '801' },
    { label: '鹽埕區', value: '802' },
]

const { data: userDataRaw } = await useAsyncData(
    'userData',
    () => $fetch('https://nuxr3.zeabur.app/api/v1/user', {
        headers: {
            Authorization: useCookie('auth').value
        }
    })
);

const userData = computed(() => userDataRaw.value?.result || {});

const setUserInfo = (info) => {
    const birthday = new Date(info.birthday);
    birthYear.value = birthday.getFullYear();
    birthMonth.value = birthday.getMonth() + 1;
    birthDay.value = birthday.getDate();

    city.value = info.address.detail.split(' ')[0] || '';
    district.value = info.address.detail.split(' ')[1] || '';
    detailAddress.value = info.address.detail.split(' ')[2] || '';
};

setUserInfo(userData.value);

const changePassword = async () => {
    if (!newPassword.value || !confirmPassword.value) {
        $swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '請輸入新密碼和確認密碼！'
        });
        return;
    }
    if (newPassword.value !== confirmPassword.value) {
        $swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '新密碼和確認密碼不一致！'
        });
        return;
    }

    const { status } = await $fetch('https://nuxr3.zeabur.app/api/v1/user', {
        method: 'PUT',
        headers: {
            Authorization: useCookie('auth').value
        },
        body: {
            userId: route.params.userId,
            oldPassword: oldPassword.value,
            newPassword: newPassword.value
        }
    });

    if (!status) return;
    $swal.fire({
        position: "center",
        icon: 'success',
        title: '密碼變更成功，下次請用新密碼登入！'
    });

    isEditPassword.value = false;
}

watch([birthDay, birthYear, birthMonth], ([day, year, month]) => {
    if (day && year && month) {
        userData.value.birthday = `${year}/${month}/${day}`;
    }
}, { immediate: true });

watch([city, district, detailAddress], ([cityValue, districtValue, detailValue]) => {
    if (cityValue && districtValue && detailValue) {
        userData.value.address.zipcode = zipcode.find(z => z.label === districtValue)?.value || "";
        userData.value.address.detail = `${cityValue} ${districtValue} ${detailValue}`;
    }
}, { immediate: true });

const saveProfile = async () => {
    const { status } = await $fetch('https://nuxr3.zeabur.app/api/v1/user', {
        method: 'PUT',
        headers: {
            Authorization: useCookie('auth').value
        },
        body: {
            userId: route.params.userId,
            name: userData.value.name,
            phone: userData.value.phone,
            birthday: userData.value.birthday,
            address: userData.value.address
        }
    });

    if (!status) return;
    $swal.fire({
        position: "center",
        icon: 'success',
        title: '個人資料已更新！'
    });

    isEditProfile.value = false;
};

useSeoMeta({
    title: 'Freyja | 會員資料',
    description: '填妥 Freyja 會員資料，不定期享 Freyja 提供的各項優惠，享受獨特的住宿體驗！',
    ogTitle: 'Freyja | 會員資料',
    ogDescription: '填妥 Freyja 會員資料，不定期享 Freyja 提供的各項優惠，享受獨特的住宿體驗！',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Freyja | 會員資料',
    twitterDescription: '填妥 Freyja 會員資料，不定期享 Freyja 提供的各項優惠，享受獨特的住宿體驗！'
});
</script>

<template>
    <div class="row gap-6 gap-md-0">
        <div class="col-12 col-md-5">
            <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
                <h2 class="fs-6 fs-md-5 fw-bold">修改密碼</h2>
                <div class="d-flex flex-column gap-4 gap-md-6">
                    <div class="fs-8 fs-md-7">
                        <p class="mb-2 text-neutral-80 fw-medium">電子信箱</p>
                        <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0">{{ userData.email
                        }}</span>
                    </div>

                    <div class="d-flex justify-content-between align-items-center"
                        :class="{ 'd-none': isEditPassword }">
                        <div>
                            <label class="mb-0 text-neutral-80 fs-8 fs-md-7 fw-medium">
                                密碼
                            </label>
                            <input class="form-control pe-none p-0 text-neutral-100 fs-5 fs-md-3 fw-bold border-0"
                                type="password" value="**********" />
                        </div>

                        <button
                            class="flex-shrink-0 text-primary-100 fs-8 fs-md-7 fw-bold text-decoration-underline border-0 bg-transparent"
                            type="button" @click="isEditPassword = !isEditPassword">
                            重設
                        </button>
                    </div>

                    <div class="d-flex flex-column gap-4 gap-md-6" :class="{ 'd-none': !isEditPassword }">
                        <div>
                            <label for="oldPassword" class="form-label fs-8 fs-md-7 fw-bold">舊密碼</label>
                            <input id="oldPassword" type="password" class="form-control p-4 fs-7 rounded-3"
                                placeholder="請輸入舊密碼" v-model="oldPassword" />
                        </div>

                        <div>
                            <label for="newPassword" class="form-label fs-8 fs-md-7 fw-bold">新密碼</label>
                            <input id="newPassword" type="password" class="form-control p-4 fs-7 rounded-3"
                                placeholder="請輸入新密碼" v-model="newPassword" />
                        </div>

                        <div>
                            <label for="confirmPassword" class="form-label fs-8 fs-md-7 fw-bold">確認新密碼</label>
                            <input id="confirmPassword" type="password" class="form-control p-4 fs-7 rounded-3"
                                placeholder="請再輸入一次新密碼" v-model="confirmPassword" />
                        </div>
                    </div>

                    <button :class="{ 'd-none': !isEditPassword }"
                        class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3" type="button"
                        @click="changePassword">
                        儲存設定
                    </button>
                </div>
            </section>
        </div>

        <div class="col-12 col-md-7">
            <section class="rounded-3xl d-flex flex-column gap-6 gap-md-10 p-6 p-md-10 bg-neutral-0">
                <h2 class="fs-6 fs-md-5 fw-bold">基本資料</h2>
                <div class="d-flex flex-column gap-4 gap-md-6">
                    <div class="fs-8 fs-md-7">
                        <label class="form-label" :class="{
                            'fw-bold text-neutral-100': isEditProfile,
                            'fw-medium text-neutral-80': !isEditProfile,
                        }" for="name">
                            姓名
                        </label>
                        <input id="name" name="name" class="form-control text-neutral-100 fw-bold" :class="{
                            'pe-none p-0 border-0': !isEditProfile,
                            'p-4': isEditProfile,
                        }" type="text" v-model="userData.name" />
                    </div>

                    <div class="fs-8 fs-md-7">
                        <label class="form-label" :class="{
                            'fw-bold text-neutral-100': isEditProfile,
                            'fw-medium text-neutral-80': !isEditProfile,
                        }" for="phone">
                            手機號碼
                        </label>
                        <input id="phone" name="phone" class="form-control text-neutral-100 fw-bold" :class="{
                            'pe-none p-0 border-0': !isEditProfile,
                            'p-4': isEditProfile,
                        }" type="tel" v-model="userData.phone" />
                    </div>

                    <div class="fs-8 fs-md-7">
                        <label class="form-label" :class="{
                            'fw-bold text-neutral-100': isEditProfile,
                            'fw-medium text-neutral-80': !isEditProfile,
                        }" for="birth">
                            生日
                        </label>
                        <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                            :class="{ 'd-none': isEditProfile }">1990 年 8 月 15 日</span>
                        <div class="d-flex gap-2" :class="{ 'd-none': !isEditProfile }">
                            <select id="birth" class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="birthYear">
                                <option v-for="year in 65" :key="year" :value="year + 1958">
                                    {{ year + 1958 }} 年
                                </option>
                            </select>
                            <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="birthMonth">
                                <option v-for="month in 12" :key="month" :value="String(month).padStart(2, '0')">
                                    {{ month }} 月
                                </option>
                            </select>
                            <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="birthDay">
                                <option v-for="day in 30" :key="day" :value="String(day).padStart(2, '0')">
                                    {{ day }} 日
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="fs-8 fs-md-7">
                        <label class="form-label" :class="{
                            'fw-bold text-neutral-100': isEditProfile,
                            'fw-medium text-neutral-80': !isEditProfile,
                        }" for="address">
                            地址
                        </label>
                        <span class="form-control pe-none p-0 text-neutral-100 fw-bold border-0"
                            :class="{ 'd-none': isEditProfile }">{{ userData.address.detail }}</span>
                        <div :class="{ 'd-none': !isEditProfile }">
                            <div class="d-flex gap-2 mb-2">
                                <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="city">
                                    <option value="臺北市">臺北市</option>
                                    <option value="臺中市">臺中市</option>
                                    <option selected value="高雄市">高雄市</option>
                                </select>
                                <select class="form-select p-4 text-neutral-80 fw-medium rounded-3" v-model="district">
                                    <option value="前金區">前金區</option>
                                    <option value="鹽埕區">鹽埕區</option>
                                    <option selected value="新興區">新興區</option>
                                </select>
                            </div>
                            <input id="address" type="text" class="form-control p-4 rounded-3" placeholder="請輸入詳細地址" v-model="detailAddress" />
                        </div>
                    </div>
                </div>
                <button :class="{ 'd-none': isEditProfile }"
                    class="btn btn-outline-primary-100 align-self-start px-8 py-4 rounded-3" type="button"
                    @click="isEditProfile = !isEditProfile">
                    編輯
                </button>

                <button :class="{ 'd-none': !isEditProfile }"
                    class="btn btn-neutral-40 align-self-md-start px-8 py-4 text-neutral-60 rounded-3" type="button"
                    @click="saveProfile"
                >
                    儲存設定
                </button>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rounded-3xl {
    border-radius: 1.25rem;
}

input[type="password"] {
    font: small-caption;
}

.form-control::placeholder {
    --neutral-60: #909090;
    color: var(--neutral-60);
    font-weight: 500;
}
</style>
