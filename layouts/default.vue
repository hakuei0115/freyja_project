<template>
  <div class="layout-wrapper d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
