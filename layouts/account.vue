<template>
    <div class="min-vh-100 bg-neutral-120">
        <header class="position-fixed z-3 w-100 bg-neutral-120">
            <nav class="navbar navbar-expand-md p-0 mx-3 my-4 mx-md-20 my-md-6">
                <div class="container-fluid justify-content-between p-0">
                    <NuxtLink class="navbar-brand p-0" to="/">
                        <img src="@/assets/images/logo-white.svg" alt="logo" class="logo img-fluid" />
                    </NuxtLink>
                    <button class="navbar-toggler collapsed p-2 text-white border-0 shadow-none" type="button"
                        data-bs-toggle="collapse" data-bs-target="#navbar" aria-controls="navbar" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <Icon class="fs-1" icon="mdi:close" />
                        <Icon class="fs-5" icon="mdi:menu" />
                    </button>
                </div>
            </nav>
        </header>
        <div class="position-relative d-flex flex-column flex-md-row">
            <img class="d-none d-md-block position-relative z-1 min-vh-100 object-fit-cover" style="max-width: 50%"
                src="@/assets/images/login-hero.png" alt="login-hero" />

            <div class="d-flex flex-column justify-content-center align-items-center flex-grow-1 pt-18 pt-md-0">
                <picture class="w-100">
                    <source srcset="@/assets/images/deco-line-group-horizontal.svg" media="(min-width: 576px)" />
                    <img class="deco-line-group" src="@/assets/images/deco-line-group-horizontal-sm.svg"
                        alt="deco-line-group" />
                </picture>

                <main class="position-relative w-100 w-md-auto">
                    <slot />
                </main>
            </div>
        </div>
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
    xxxl: 1537px,
);

.logo {
    max-width: 27vw;
}

.w-md-auto {
    @include media-breakpoint-up(md) {
        width: auto !important;
    }
}

@include media-breakpoint-down(md) {
    header {
        max-height: 72px;
    }
}

@include media-breakpoint-down(md) {
    .navbar-toggler {
        z-index: 1;
        visibility: hidden;

        svg {
            transition: opacity 0.3s;
        }

        svg:nth-child(1) {
            position: absolute;
            top: 28px;
            right: 28px;
            opacity: 1;
            visibility: visible;
        }

        svg:nth-child(2) {
            opacity: 0;
            visibility: hidden;
        }
    }

    .navbar-toggler.collapsed {
        svg:nth-child(1) {
            opacity: 0;
            visibility: hidden;
        }

        svg:nth-child(2) {
            opacity: 1;
            visibility: visible;
        }
    }

    .navbar-collapse {
        min-height: 100vh;
        background-color: #140f0a;
        position: fixed;
        inset: 0;
        opacity: 0;
        overflow: hidden;
        transition: opacity 0.05s;
    }

    .navbar-collapse.show {
        opacity: 1;
    }

    .navbar-nav {
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;

        a {
            width: 90vw;
        }
    }
}

.deco-line-group {
    position: absolute;
    top: 192px;
    right: 0;

    @include media-breakpoint-down(md) {
        position: static;
        width: 100%;
    }
}
</style>
