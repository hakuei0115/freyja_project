interface RegisterForm {
  name: string
  email: string
  password: string
  phone: string
  birthday: string
  address: {
    zipcode: string
    detail: string
  }
}

export const useRegister = () => {
  const { $swal } = useNuxtApp();

  const userRegisteObject = reactive<RegisterForm>({
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

  const register = async (userData: RegisterForm) => {
    try {
      const response = await $fetch<{ message: string }>(`/v1/user/signup`, {
        method: 'POST',
        body: { ...userData },
        baseURL: 'https://nuxr3.zeabur.app/api',
      })

      $swal.fire({
        position: "center",
        icon: 'success',
        title: '註冊成功',
        showConfirmButton: false,
        timer: 1500
    });
    } catch (error: any) {
      console.error(error);
      $swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while registering. Please try again.",
      });
    }
  }

  return {
    userRegisteObject,
    register
  }
}
