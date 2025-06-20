<script setup>
const router = useRouter();
const { $swal } = useNuxtApp();
const accountStore = useAccountStore();

definePageMeta({
  layout: 'account'
});

const agreementCheck = ref(null);
const isEmailAndPasswordValid = ref(false);

const birthDay = ref('');
const birthYear = ref('');
const birthMonth = ref('');

const city = ref('');
const district = ref('');
const detailAddress = ref('');

const zipcode = [
  {label: '新興區', value: '800'},
  {label: '前金區', value: '801'},
  {label: '鹽埕區', value: '802'},
]

watch([birthDay, birthYear, birthMonth], ([day, year, month]) => {
  if (day && year && month) {
    userRegisterObject.birthday = `${year}/${month}/${day}`;
  }
}, { immediate: true });

watch([city, district, detailAddress], ([cityValue, districtValue, detailValue]) => {
  if (cityValue && districtValue && detailValue) {
    userRegisterObject.address.zipcode = zipcode.find(z => z.label === districtValue)?.value || "";
    userRegisterObject.address.detail = `${cityValue} ${districtValue} ${detailValue}`;
  }
}, { immediate: true });

const userRegisterObject = reactive({
  name: "",
  email: "",
  password: "",
  phone: "",
  birthday: "",
  address: {
    zipcode: "",
    detail: "",
  },
});

const toStep2 = (value = {}) => {
  if (value['密碼'] !== value['確認密碼']) {
    $swal.fire({
      position: "center",
      icon: 'error',
      title: '密碼不一致',
      showConfirmButton: false,
      timer: 1500
    });
    return;
  }
  isEmailAndPasswordValid.value = true;
};

const register = async (userRegisterObject) => {
  if (!agreementCheck.value) {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "請同意個資使用規範",
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }

  console.log("userRegisterObject", userRegisterObject);
  const { data, error } = await useFetch(
    "https://nuxr3.zeabur.app/api/v1/user/signup",
    {
      method: "POST",
      body: userRegisterObject,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (error.value) {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "註冊失敗",
      text: error.value.message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  if (data.value) {
    $swal.fire({
      position: "center",
      icon: "success",
      title: "註冊成功",
      text: "請至信箱驗證",
      showConfirmButton: false,
      timer: 1500,
    });

    if (data.value) {
      $swal.fire({
        position: 'center',
        icon: 'info',
        title: '是否要升級為 VIP？',
        text: 'VIP 可享有以下特權：\n・專屬折扣\n・優先預約\n・免費升等房型',
        showCancelButton: true,
        confirmButtonText: '升級 VIP',
        cancelButtonText: '稍後再說',
      })
      .then((result) => {
        if (result.isConfirmed) {
          accountStore.setVipInfo(
            {
              id: data.value.result.id,
              name: userRegisterObject.name,
              email: userRegisterObject.email,
            }
          );

          const buyVip = useCookie("buyVip", { maxAge:600 })
          buyVip.value = 'buybuybuy';
          
          router.push('/account/vip');
        } else {
          router.push('/account/login');
        }
      });
    }

    router.push("/account/login");
  }
}

useSeoMeta({
  title: 'Freyja | 歡迎註冊',
  description: '加入 Freyja 成為會員，絕美市景與舒適空間即可立即預訂，享受獨特的住宿體驗！',
  ogTitle: 'Freyja | 歡迎註冊',
  ogDescription: '加入 Freyja 成為會員，絕美市景與舒適空間即可立即預訂。享受獨特的住宿體驗！',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Freyja | 歡迎註冊',
  twitterDescription: '加入 Freyja 成為會員，絕美市景與舒適空間即可立即預訂。享受獨特的住宿體驗！'
});

useHead({
  title: 'Freyja | 歡迎註冊',
  meta: [
    { name: 'description', content: '加入 Freyja 成為會員，絕美市景與舒適空間即可立即預訂，享受獨特的住宿體驗！' },
    { property: 'og:title', content: 'Freyja | 歡迎註冊' },
    { property: 'og:description', content: '加入 Freyja 成為會員，絕美市景與舒適空間即可立即預訂。享受獨特的住宿體驗！' },
    { name: 'twitter:title', content: 'Freyja | 歡迎註冊' },
    { name: 'twitter:description', content: '加入 Freyja 成為會員，絕美市景與舒適空間即可立即預訂。享受獨特的住宿體驗！' }
  ]
});
</script>

<template>
  <div class="p-5 px-md-0 py-md-30">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="mb-4 text-neutral-0 fw-bold">
        立即註冊
      </h1>

      <div class="d-flex align-items-center py-4 gap-2">
        <div class="d-flex flex-column align-items-center gap-1 text-neutral-0">
          <span
            :class="{'d-none': isEmailAndPasswordValid}"
            class="step p-2 bg-primary-100 rounded-circle"
          >1</span>
          <Icon
            :class="{'d-none': !isEmailAndPasswordValid}"
            class="p-2 fs-3 bg-primary-100 rounded-circle"
            icon="material-symbols:check"
          />
          <p class="mb-0 fs-8 fs-md-7 fw-bold">
            輸入信箱及密碼
          </p>
        </div>

        <hr class="flex-grow-1 my-0 border border-neutral-60 opacity-100">

        <div
          :class="{
            'text-neutral-0': isEmailAndPasswordValid, 'text-neutral-60': !isEmailAndPasswordValid
          }"
          class="d-flex flex-column align-items-center gap-1"
        >
          <span
            :class="{
              'bg-primary-100': isEmailAndPasswordValid, 'bg-transparent border border-neutral-60': !isEmailAndPasswordValid
            }"
            class="step p-2 rounded-circle"
          >2</span>
          <p class="mb-0 fs-8 fs-md-7 fw-bold">
            填寫基本資料
          </p>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <Form @submit="toStep2" v-slot="{ errors }">
        <div
          :class="{'d-none': isEmailAndPasswordValid}"
          class="mb-4"
        >
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="email"
            >
              電子信箱
            </label>
            <Field name="電子信箱" v-slot="{ field }" rules="required|email">
              <input
                v-bind="field"
                id="email"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors['電子信箱'] }"
                placeholder="請輸入信箱"
                type="email"
                v-model="userRegisterObject.email"
              >
              <ErrorMessage name="電子信箱" class="invalid-feedback" />
            </Field>
          </div>
          <div class="mb-4 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="password"
            >
              密碼
            </label>
            <Field name="密碼" v-slot="{ field }" rules="required|min:6">
              <input
                v-bind="field"
                id="password"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors['密碼'] }"
                placeholder="請輸入密碼"
                type="password"
                v-model="userRegisterObject.password"
              >
              <ErrorMessage name="密碼" class="invalid-feedback" />
            </Field>
          </div>
          <div class="mb-10 fs-8 fs-md-7">
            <label
              class="mb-2 text-neutral-0 fw-bold"
              for="confirmPassword"
            >
              確認密碼
            </label>
            <Field name="確認密碼" v-slot="{ field }" rules="required|min:6">
              <input
                v-bind="field"
                id="confirmPassword"
                class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
                :class="{ 'is-invalid': errors['確認密碼'] }"
                placeholder="請再輸入一次密碼"
                type="password"
              >
              <ErrorMessage name="確認密碼" class="invalid-feedback" />
            </Field>
          </div>
          <button
            class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold"
            type="submit"
          >
            下一步
          </button>
        </div>
      </Form>

      <form
        :class="{'d-none': !isEmailAndPasswordValid}"
        class="mb-4"
        @submit.prevent="register(userRegisterObject)"
      >
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="name"
          >
            姓名
          </label>
          <input
            id="name"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40  rounded-3"
            placeholder="請輸入姓名"
            type="text"
            v-model="userRegisterObject.name"
            required
          >
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="phone"
          >
            手機號碼
          </label>
          <input
            id="phone"
            class="form-control p-4 text-neutral-100 fw-medium border-neutral-40  rounded-3"
            placeholder="請輸入手機號碼"
            type="tel"
            pattern="[0-9]{10}"
            max="10"
            v-model="userRegisterObject.phone"
            required
          >
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="birth"
          >
            生日
          </label>
          <div
            class="d-flex gap-2"
          >
            <select
              id="birth"
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              v-model="birthYear"
            >
              <option
                v-for="year in 65"
                :key="year"
                :value="year + 1958"
              >
                {{ year + 1958 }}
              </option>
            </select>
            <select
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              v-model="birthMonth"
            >
              <option
                v-for="month in 12"
                :key="month"
                :value="String(month).padStart(2, '0')"
              >
                {{ month }}
              </option>
            </select>
            <select
              class="form-select p-4 text-neutral-80 fw-medium rounded-3"
              v-model="birthDay"
            >
              <option
                v-for="day in 30"
                :key="day"
                :value="String(day).padStart(2, '0')"
              >
                {{ day }}
              </option>
            </select>
          </div>
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="form-label text-neutral-0 fw-bold"
            for="address"
          >
            地址
          </label>
          <div>
            <div
              class="d-flex gap-2 mb-2"
            >
              <select
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                v-model="city"
              >
                <option value="臺北市">
                  臺北市
                </option>
                <option value="臺中市">
                  臺中市
                </option>
                <option
                  selected
                  value="高雄市"
                >
                  高雄市
                </option>
              </select>
              <select
                class="form-select p-4 text-neutral-80 fw-medium rounded-3"
                v-model="district"
              >
                <option value="前金區">
                  前金區
                </option>
                <option value="鹽埕區">
                  鹽埕區
                </option>
                <option
                  selected
                  value="新興區"
                >
                  新興區
                </option>
              </select>
            </div>
            <input
              id="address"
              type="text"
              class="form-control p-4 rounded-3"
              placeholder="請輸入詳細地址"
              v-model="detailAddress"
            >
          </div>
        </div>
      
        <div class="form-check d-flex align-items-end gap-2 mb-10 text-neutral-0">
          <input
            id="agreementCheck"
            class="form-check-input"
            type="checkbox"
            value=""
            v-model="agreementCheck"
            required
          >
          <label
            class="form-check-label fw-bold"
            for="agreementCheck"
          >
            我已閱讀並同意本網站個資使用規範
          </label>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
        >
          完成註冊
        </button>
        <div class="col-12 col-md-6">
          <button
            class="btn btn-neutral-40 w-100 py-4 text-neutral-60 fw-bold mt-4"
            type="button"
            @click="isEmailAndPasswordValid = false"
          >
            上一步
          </button>
        </div>
      </form>
    </div>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">已經有會員了嗎？</span>
      <NuxtLink
        to="login"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>立即登入</span>
      </NuxtLink>
    </p>
  </div>
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


input[type="password"] {
  font: small-caption;
  font-size: 1.5rem;
}

input::placeholder {
  color: #909090;
  font-size: 1rem;
  font-weight: 500;

  @include media-breakpoint-down(md) {
    font-size: 14px;
  }
}

.form-check-input {
  width: 1.5rem;
  height: 1.5rem;
}

.form-check-input:checked {
  background-color: #BF9D7D;
  border-color: #BF9D7D;
}

.step {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
}
</style>