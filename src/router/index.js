import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    // Document title tag
    // We combine it with defaultDocumentTitle set in `src/main.js` on router.afterEach hook
    meta: {
      title: "Dashboard",
    },
    path: "/",
    name: "dashboard",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    meta: {
      title: "Plant",
    },
    path: "/plant",
    name: "plant",
    component: () => import("@/views/PlantView.vue"),
  },
  {
    meta: {
      title: "Variety",
    },
    path: "/variety",
    name: "variety",
    component: () => import("@/views/VarietyView.vue"),
  },
  {
    meta: {
      title: "Cultivation",
    },
    path: "/cultivation",
    name: "cultivation",
    component: () => import("@/views/CultivationView.vue"),
  },
  {
    meta: {
      title: "Plant Problem",
    },
    path: "/plant-problem",
    name: "plant-problem",
    component: () => import("@/views/PlantProblemView.vue"),
  },
  {
    meta: {
      title: "Land",
    },
    path: "/land",
    name: "land",
    component: () => import("@/views/LandView.vue"),
  },
  {
    meta: {
      title: "User",
    },
    path: "/user",
    name: "user",
    component: () => import("@/views/UserView.vue"),
  },
  {
    meta: {
      title: "Measurement",
    },
    path: "/measurement",
    name: "measurement",
    component: () => import("@/views/MeasurementView.vue"),
  },
  {
    meta: {
      title: "Measurement Detail",
    },
    path: "/measurement-detail/:id",
    name: "measurement-detail",
    component: () => import("@/views/Detail/MeasurementDetail.vue"),
    props: true, // enables passing the `id` parameter as a prop to the component
  },
  {
    meta: {
      title: "Tables",
    },
    path: "/tables",
    name: "tables",
    component: () => import("@/views/TablesView.vue"),
  },
  {
    meta: {
      title: "Forms",
    },
    path: "/forms",
    name: "forms",
    component: () => import("@/views/FormsView.vue"),
  },
  {
    meta: {
      title: "Device",
    },
    path: "/device",
    name: "device",
    component: () => import("@/views/DeviceView.vue"),
  },
  {
    meta: {
      title: "Profile",
    },
    path: "/profile",
    name: "profile",
    component: () => import("@/views/ProfileView.vue"),
  },
  {
    meta: {
      title: "Ui",
    },
    path: "/ui",
    name: "ui",
    component: () => import("@/views/UiView.vue"),
  },
  {
    meta: {
      title: "Login",
    },
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },
  {
    meta: {
      title: "Error",
    },
    path: "/error",
    name: "error",
    component: () => import("@/views/ErrorView.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});
router.beforeEach((to, from, next) => {
  const isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated"));
  if (to.name !== "login" && !isAuthenticated) next({ name: "login" });
  if (to.name === "login" && isAuthenticated) next({ name: "dashboard" });
  else next();
});

export default router;
