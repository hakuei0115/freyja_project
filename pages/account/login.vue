<script setup>
const router = useRouter();
const { $swal } = useNuxtApp();
const accountStore = useAccountStore();

definePageMeta({
  layout: 'account'
});

const userLoginObject = ref({
  email: "",
  password: "",
});

const login = async (userLoginObject) => {
  const { data, error } = await useFetch(
    "https://nuxr3.zeabur.app/api/v1/user/login",
    {
      method: "POST",
      body: userLoginObject,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (error.value) {
    $swal.fire({
      position: "center",
      icon: "error",
      title: "登入失敗",
      text: "請檢查您的電子信箱或密碼是否正確",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  if (data.value) {
    $swal.fire({
      position: "center",
      icon: "success",
      title: "登入成功",
      text: "歡迎回來",
      showConfirmButton: false,
      timer: 1500,
    });

    const auth = useCookie("auth", { maxAge:600 })
    auth.value = data.value.token;
    accountStore.setAccountInfo(data.value.result);

    router.push("/");
  }
}

useSeoMeta({
  title: 'Freyja | 歡迎登入',
  description: '歡迎回到 Freyja，立即登入以享受我們的獨特住宿體驗！',
  ogTitle: 'Freyja | 歡迎登入',
  ogDescription: '歡迎回到 Freyja，立即登入以享受我們的獨特住宿體驗！',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Freyja | 歡迎登入',
  twitterDescription: '歡迎回到 Freyja，立即登入以享受我們的獨特住宿體驗！'
});

useHead({
  title: 'Freyja | 歡迎登入',
  meta: [
    { name: 'description', content: '歡迎回到 Freyja，立即登入以享受我們的獨特住宿體驗！' },
    { property: 'og:title', content: 'Freyja | 歡迎登入' },
    { property: 'og:description', content: '歡迎回到 Freyja，立即登入以享受我們的獨特住宿體驗！' },
    { name: 'twitter:title', content: 'Freyja | 歡迎登入' },
    { name: 'twitter:description', content: '歡迎回到 Freyja，立即登入以享受我們的獨特住宿體驗！' }
  ]
});
</script>

<template>
  <div class="px-5 px-md-0">
    <div class="mb-10">
      <p class="mb-2 text-primary-100 fs-8 fs-md-7 fw-bold">
        享樂酒店，誠摯歡迎
      </p>
      <h1 class="text-neutral-0 fw-bold">
        立即開始旅程
      </h1>
    </div>

    <Form v-slot="{ errors }">
      <form class="mb-10" @submit.prevent="login(userLoginObject)" >
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="email"
          >
            電子信箱
          </label>
          <Field name="email" v-slot="{ field }" rules="required|email">
            <input
              v-bind="field"
              id="email"
              class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
              :class="{ 'is-invalid': errors['email'] }"
              placeholder="請輸入信箱"
              type="email"
              v-model="userLoginObject.email"
            >
            <ErrorMessage name="email" class="invalid-feedback" />
          </Field>
        </div>
        <div class="mb-4 fs-8 fs-md-7">
          <label
            class="mb-2 text-neutral-0 fw-bold"
            for="password"
          >
            密碼
          </label>
          <Field name="password" v-slot="{ field }" rules="required|min:6">
            <input
              v-bind="field"
              id="password"
              class="form-control p-4 text-neutral-100 fw-medium border-neutral-40"
              :class="{ 'is-invalid': errors['password'] }"
              placeholder="請輸入密碼"
              type="password"
              v-model="userLoginObject.password"
            >
            <ErrorMessage name="password" class="invalid-feedback" />
          </Field>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-10 fs-8 fs-md-7">
          <div class="form-check d-flex align-items-end gap-2 text-neutral-0">
            <input
              id="remember"
              class="form-check-input"
              type="checkbox"
              value=""
            >
            <label
              class="form-check-label fw-bold"
              for="remember"
            >
              記住帳號
            </label>
          </div>
          <button
            class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
            type="button"
          >
            忘記密碼？
          </button>
        </div>
        <button
          class="btn btn-primary-100 w-100 py-4 text-neutral-0 fw-bold"
          type="submit"
        >
          會員登入
        </button>
      </form>
    </Form>

    <p class="mb-0 fs-8 fs-md-7">
      <span class="me-2 text-neutral-0 fw-medium">沒有會員嗎？</span>
      <NuxtLink
        to="/account/signup"
        class="text-primary-100 fw-bold text-decoration-underline bg-transparent border-0"
      >
        <span>前往註冊</span>
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
</style>