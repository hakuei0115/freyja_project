<script setup>
import BookingLoading from '@/components/rooms/BookingLoading.vue';

definePageMeta({
    middleware: ['auth']
});

const { $swal } = useNuxtApp();
const accountStore = useAccountStore();
const { isVip } = storeToRefs(accountStore);
const booking = useBookingStore();
const { bookingResult } = storeToRefs(booking);
const roomId = computed(() => bookingResult.value.roomId);
const auth = useCookie('auth');
const router = useRouter();

const bookConfirmInfo = reactive({
    roomId: roomId.value,
    checkInDate: bookingResult.value.checkInDate,
    checkOutDate: bookingResult.value.checkOutDate,
    peopleNum: bookingResult.value.peopleNum,
    userInfo: {
        name: "",
        phone: "",
        email: "",
        address: {
            zipcode: "",
            detail: ""
        }
    }
});

const zipcode = [
    {label: '新興區', value: '800'},
    {label: '前金區', value: '801'},
    {label: '鹽埕區', value: '802'},
]

const city = ref('');
const district = ref('');
const detailAddress = ref('');

watch([city, district, detailAddress], ([cityValue, districtValue, detailValue]) => {
    if (cityValue && districtValue && detailValue) {
        bookConfirmInfo.userInfo.address.zipcode = zipcode.find(z => z.label === districtValue)?.value || "";
        bookConfirmInfo.userInfo.address.detail = `${cityValue} ${districtValue} ${detailValue}`;
    }
}, { immediate: true });

const goBack = () => {
    router.back();
}

const isLoading = ref(false);

const confirmBooking = async () => {
    isLoading.value = true;

    try {
        const { result } = await $fetch(`https://nuxr3.zeabur.app/api/v1/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.value
            },
            body: bookConfirmInfo,
            async onResponseError({ request, response, options }) {
                const { message } = response._data;
                $swal.fire({
                    position: "center",
                    icon: 'error',
                    title: message
                });
                if (response.status === 403) {
                    await navigateTo('/account/login');
                }
            }
        });

        if (!result._id) return;

        await router.push(`/booking-confirmation/${result._id}`);
    } catch (error) {
        console.error('Error confirming booking:', error);
    } finally {
        isLoading.value = false;
    }
}

const { data: roomData, pending, error } = await useAsyncData(
    () => `booking-room-detail-${roomId.value}`,
    () => $fetch(`https://nuxr3.zeabur.app/api/v1/rooms/${roomId.value}`),
    {
        watch: [roomId],
        immediate: true,
    }
)

const roomDetail = computed(() => roomData.value?.result || null)
</script>

<template>
    <main class="pt-18 pt-md-30 bg-neutral-120">
        <section class="py-10 py-md-30 bg-primary-10">
            <div class="container">
                <button class="d-flex align-items-baseline gap-2 mb-10 bg-transparent border-0" type="button"
                    @click="goBack">
                    <Icon class="fs-5 text-neutral-100" icon="mdi:keyboard-arrow-left" />
                    <h1 class="mb-0 text-neutral-100 fs-3 fw-bold">
                        確認訂房資訊
                    </h1>
                </button>

                <div class="row gap-10 gap-md-0">
                    <div class="col-12 col-md-7">
                        <section>
                            <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                                訂房資訊
                            </h2>
                            <div class="d-flex flex-column gap-6">
                                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                                    <div>
                                        <h3 class="title-deco mb-2 fs-7 fw-bold">
                                            選擇房型
                                        </h3>
                                        <p class="mb-0 fw-medium">
                                            {{ roomDetail.name }}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                                    <div>
                                        <h3 class="title-deco mb-2 fs-7 fw-bold">
                                            訂房日期
                                        </h3>
                                        <p class="mb-2 fw-medium">
                                            入住： {{ bookingResult.checkInDate }}
                                        </p>
                                        <p class="mb-0 fw-medium">
                                            退房： {{ bookingResult.checkOutDate }}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center text-neutral-100">
                                    <div>
                                        <h3 class="title-deco mb-2 fs-7 fw-bold">
                                            房客人數
                                        </h3>
                                        <p class="mb-0 fw-medium">
                                            {{ bookingResult.peopleNum }} 人
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

                        <section>
                            <div class="d-flex justify-content-between align-items-center mb-10">
                                <h2 class="mb-0 text-neutral-100 fs-6 fs-md-4 fw-bold">
                                    訂房人資訊
                                </h2>
                            </div>

                            <div class="d-flex flex-column gap-6">
                                <div class="text-neutral-100">
                                    <label for="name" class="form-label fs-8 fs-md-7 fw-bold">姓名</label>
                                    <input id="name" type="text" class="form-control p-4 fs-8 fs-md-7 rounded-3"
                                        placeholder="請輸入姓名" v-model="bookConfirmInfo.userInfo.name">
                                </div>

                                <div class="text-neutral-100">
                                    <label for="phone" class="form-label fs-8 fs-md-7 fw-bold">手機號碼</label>
                                    <input id="phone" type="tel" class="form-control p-4 fs-8 fs-md-7 rounded-3"
                                        placeholder="請輸入手機號碼" v-model="bookConfirmInfo.userInfo.phone">
                                </div>

                                <div class="text-neutral-100">
                                    <label for="email" class="form-label fs-8 fs-md-7 fw-bold">電子信箱</label>
                                    <input id="email" type="email" class="form-control p-4 fs-8 fs-md-7 rounded-3"
                                        placeholder="請輸入電子信箱" v-model="bookConfirmInfo.userInfo.email">
                                </div>

                                <div class="text-neutral-100">
                                    <label for="address" class="form-label fs-8 fs-md-7 fw-bold">地址</label>
                                    <div className="d-flex gap-2 mb-4">
                                        <select
                                            class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                                            v-model="city"
                                        >
                                            <option value="臺北市">
                                                臺北市
                                            </option>
                                            <option value="臺中市">
                                                臺中市
                                            </option>
                                            <option selected value="高雄市">
                                                高雄市
                                            </option>
                                        </select>
                                        <select
                                            class="form-select w-50 p-4 text-neutral-80 fs-8 fs-md-7 fw-medium rounded-3"
                                            v-model="district"
                                        >
                                            <option value="前金區">
                                                前金區
                                            </option>
                                            <option value="鹽埕區">
                                                鹽埕區
                                            </option>
                                            <option selected value="新興區">
                                                新興區
                                            </option>
                                        </select>
                                    </div>
                                    <input id="address" type="text" class="form-control p-4 fs-8 fs-md-7 rounded-3"
                                        placeholder="請輸入詳細地址" v-model="detailAddress">
                                </div>
                            </div>
                        </section>

                        <hr class="my-10 my-md-12 opacity-100 text-neutral-60">

                        <section>
                            <h2 class="mb-8 mb-md-10 text-neutral-100 fs-6 fs-md-4 fw-bold">
                                房間資訊
                            </h2>
                            <div class="d-flex flex-column gap-6">
                                <section>
                                    <h3 class="title-deco mb-4 mb-md-6 fs-7 fs-md-5 fw-bold">
                                        房型基本資訊
                                    </h3>
                                    <ul class="d-flex gap-4 list-unstyled">
                                        <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                                            <Icon class="mb-2 fs-5 text-primary-100"
                                                icon="fluent:slide-size-24-filled" />
                                            <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                                                {{ roomDetail.areaInfo }}
                                            </p>
                                        </li>
                                        <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                                            <Icon class="mb-2 fs-5 text-primary-100" icon="material-symbols:king-bed" />
                                            <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                                                {{ roomDetail?.bedInfo }}
                                            </p>
                                        </li>
                                        <li class="card-info px-4 py-5 bg-neutral-0 border border-primary-40 rounded-3">
                                            <Icon class="mb-2 fs-5 text-primary-100" icon="ic:baseline-person" />
                                            <p class="mb-0 fw-bold text-neutral-80 text-nowrap">
                                                2 - {{ roomDetail?.maxPeople }} 人
                                            </p>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                                        房間格局
                                    </h3>
                                    <ul
                                        class="d-flex flex-wrap gap-6 gap-md-10 p-6 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                                        <li class="d-flex gap-2" v-for="(layout, index) in roomDetail?.layoutInfo" :key="index">
                                            <template v-if="layout.isProvide">
                                                <Icon
                                                    class="fs-5 text-primary-100"
                                                    icon="material-symbols:check"
                                                />
                                                <p class="mb-0 text-neutral-80 fw-bold">
                                                    {{ layout.title }}
                                                </p>
                                            </template>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                                        房內設備
                                    </h3>
                                    <ul
                                        class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                                        <li class="flex-item d-flex gap-2" v-for="(facility, index) in roomDetail?.facilityInfo" :key="index">
                                            <template v-if="facility.isProvide">
                                                <Icon
                                                    class="fs-5 text-primary-100"
                                                    icon="material-symbols:check"
                                                />
                                                <p class="mb-0 text-neutral-80 fw-bold">
                                                    {{ facility.title }}
                                                </p>
                                            </template>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 class="title-deco mb-4 mb-md-6 text-neutral-100 fs-7 fs-md-5 fw-bold">
                                        備品提供
                                    </h3>
                                    <ul
                                        class="d-flex flex-wrap row-gap-2 column-gap-10 p-6 mb-0 fs-8 fs-md-7 bg-neutral-0 rounded-3 list-unstyled">
                                        <li v-for="(amenity, index) in roomDetail?.amenityInfo" :key="index" class="flex-item d-flex gap-2">
                                            <template v-if="amenity.isProvide">
                                                <Icon
                                                    class="fs-5 text-primary-100"
                                                    icon="material-symbols:check"
                                                />
                                                <p class="mb-0 text-neutral-80 fw-bold">
                                                    {{ amenity.title }}
                                                </p>
                                            </template>
                                        </li>
                                    </ul>
                                </section>
                            </div>
                        </section>
                    </div>

                    <div class="col-12 col-md-5">
                        <div
                            class="confirm-form rounded-3xl d-flex flex-column gap-10 p-6 p-md-10 mx-auto ms-md-auto me-md-0 bg-neutral-0">
                            <img
                                class="img-fluid rounded-3"
                                :src="roomDetail?.imageUrl"
                                :alt="roomDetail?.name"
                            >

                            <div>
                                <h2 className="mb-6 text-neutral-100 fs-6 fs-md-4 fw-bold">
                                    價格詳情
                                </h2>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div class="d-flex align-items-center text-neutral-100 fw-medium">
                                        <span>NT$ {{ roomDetail.price }}</span>
                                        <Icon class="ms-2 me-1 text-neutral-80" icon="material-symbols:close" />
                                        <span class="text-neutral-80">{{ bookingResult?.daysCount }} 晚</span>
                                    </div>
                                    <span class="fw-medium">
                                        NT$ {{ roomDetail.price * bookingResult?.daysCount }}
                                    </span>
                                </div>

                                <template v-if="isVip">
                                    <div class="d-flex justify-content-between align-items-center fw-medium">
                                        <p class="d-flex align-items-center mb-0 text-neutral-100">
                                            VIP折扣
                                        </p>
                                        <span class="text-primary-100">
                                            -10%
                                        </span>
                                    </div>

                                    <template v-if="bookingResult?.daysCount >= 7">
                                        <div class="d-flex justify-content-between align-items-center fw-medium">
                                            <p class="d-flex align-items-center mb-0 text-neutral-100">
                                                VIP訂房滿7天折扣
                                            </p>
                                            <span class="text-primary-100">
                                                -10%
                                            </span>
                                        </div>
                                    </template>
                                    <hr class="my-6 opacity-100 text-neutral-40">
                                    <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                                        <p class="d-flex align-items-center mb-0">
                                            總價
                                        </p>
                                        <span>
                                            NT$ {{ roomDetail.price * bookingResult?.daysCount * 0.9 * (bookingResult?.daysCount >= 7 ? 0.9 : 1) }}
                                        </span>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="d-flex justify-content-between align-items-center text-neutral-100 fw-bold">
                                        <p class="d-flex align-items-center mb-0">
                                            總價
                                        </p>
                                        <span>
                                            NT$ {{ roomDetail.price * bookingResult?.daysCount }}
                                        </span>
                                    </div>
                                </template>
                            </div>

                            <button class="btn btn-primary-100 py-4 text-neutral-0 fw-bold rounded-3" type="button"
                                @click="confirmBooking">
                                確認訂房
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <BookingLoading v-if="isLoading" />
    </main>
</template>

<style lang="scss" scoped>
@import "bootstrap/scss/mixins/breakpoints";

$grid-breakpoints: (
    xs: 0,
    sm: 576px,
    md: 768px,
    lg: 992px,
    xl: 1200px,
    xxl: 1400px,
    xxxl: 1537px
);

.title-deco {
    display: flex;
    align-items: center;
}

.title-deco::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 24px;
    background-color: #BF9D7D;
    border-radius: 10px;
    margin-right: 0.75rem;
}

.form-control::placeholder {
    --neutral-60: #909090;
    color: var(--neutral-60);
    font-weight: 500;
}

.card-info {
    width: 97px;
    height: 97px;
}

.flex-item {
    flex: 1 1 15%;

    @include media-breakpoint-down(md) {
        flex-basis: 40%;
    }
}

.rounded-3xl {
    border-radius: 1.25rem;
}

.confirm-form {
    position: sticky;
    top: 160px;
    max-width: 478px;

    @include media-breakpoint-down(md) {
        position: static;
        top: 0;
        max-width: auto;
    }
}
</style>