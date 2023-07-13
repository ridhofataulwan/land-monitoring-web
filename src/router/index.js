import { isTokenExpired, getToken, decodeToken } from "@/services/jwt.js";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  // No need Authentication
  {
    meta: {
      title: "Index",
    },
    path: "/index",
    name: "index",
    component: () => import("@/views/Page/Auth/IndexView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/Page/Auth/LoginView.vue"),
  },
  {
    meta: {
      title: "Reset Password",
    },
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/views/Page/Auth/ResetPassword.vue"),
  },

  // Need Authentication
  {
    meta: {
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: () => import("@/views/Page/HomeView.vue"),
  },
  {
    meta: {
      title: "Plant",
    },
    path: "/plant",
    name: "plant",
    component: () => import("@/views/Page/PlantView.vue"),
  },
  {
    meta: {
      title: "Variety",
    },
    path: "/variety",
    name: "variety",
    component: () => import("@/views/Page/VarietyView.vue"),
  },
  {
    meta: {
      title: "Add Variety",
    },
    path: "/variety/add",
    name: "add variety",
    component: () => import("@/views/Add/AddVariety.vue"),
  },
  {
    meta: {
      title: "Detail Variety",
    },
    path: "/variety/:id",
    name: "detail variety",
    component: () => import("@/views/Detail/VarietyDetail.vue"),
    props: true,
  },
  {
    meta: {
      title: "Cultivation",
    },
    path: "/cultivation",
    name: "cultivation",
    component: () => import("@/views/Page/CultivationView.vue"),
  },
  {
    meta: {
      title: "Plant Problem",
    },
    path: "/plant-problem",
    name: "plant-problem",
    component: () => import("@/views/Page/PlantProblemView.vue"),
  },
  {
    meta: {
      title: "Land",
    },
    path: "/land",
    name: "land",
    component: () => import("@/views/Page/LandView.vue"),
  },
  {
    meta: {
      title: "Land Detail",
    },
    path: "/land/:id",
    name: "land-detail",
    component: () => import("@/views/Detail/LandDetail.vue"),
    props: true,
  },
  {
    meta: {
      title: "Measurement",
    },
    path: "/measurement",
    name: "measurement",
    component: () => import("@/views/Page/MeasurementView.vue"),
  },
  {
    meta: {
      title: "Measurement Detail",
    },
    path: "/measurement/:id",
    name: "measurement-detail",
    component: () => import("@/views/Detail/MeasurementDetail.vue"),
    props: true, // enables passing the `id` parameter as a prop to the component
  },
  {
    meta: {
      title: "Device",
    },
    path: "/device",
    name: "device",
    component: () => import("@/views/Page/DeviceView.vue"),
  },
  {
    meta: {
      title: "User",
    },
    path: "/user",
    name: "user",
    component: () => import("@/views/Page/UserView.vue"),
  },
  {
    meta: {
      title: "Detail User",
    },
    path: "/user/:id",
    name: "user-detail",
    component: () => import("@/views/Detail/UserDetail.vue"),
    props: true,
  },
  {
    meta: {
      title: "Admin",
    },
    path: "/admin",
    name: "admin",
    component: () => import("@/views/Page/AdminView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Page/ProfileView.vue"),
  },

  // Addition
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/Zarchive/FormsView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/Zarchive/UiView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/Zarchive/ErrorView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});
router.beforeEach((to, from, next) => {
  const token = getToken();
  const decodedToken = token ? decodeToken(token) : null;
  console.log(to.name);

  if (
    to.name === "login" &&
    !isTokenExpired(token) &&
    decodedToken.payload.role === "ADMIN"
  ) {
    next({ name: "dashboard" });
  } else if (
    to.name !== "login" &&
    isTokenExpired(token) &&
    to.name !== "reset-password" &&
    to.name !== "index"
  ) {
    const message = "Your session has expired. Please log in again.";
    window.alert(message);
    next({ name: "login" });
  } else if (
    to.name !== "login" &&
    decodedToken?.payload.role !== "ADMIN" &&
    to.name !== "reset-password" &&
    to.name !== "index"
  ) {
    const message = "You do not have permission to access this page.";
    window.alert(message);
    next({ name: "index" });
  } else {
    next();
  }
});

export default router;
