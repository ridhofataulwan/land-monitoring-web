import {
  mdiMonitor,
  mdiGithub,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTelevisionGuide,
  mdiBarley,
  mdiCompost,
  mdiGrain,
  mdiVirus,
  mdiCalculatorVariant,
  mdiAccountGroup,
  mdiLandPlots,
  mdiDevices,
  mdiMenuDown,
  mdiShieldAccount,
} from "@mdi/js";

export default [
  {
    to: "/",
    icon: mdiMonitor,
    label: "Dashboard",
  },
  {
    label: "Tanaman",
    icon: mdiBarley,
    menu: [
      {
        label: "Jenis Tanaman",
        icon: mdiCompost,
        to: "/plant",
      },
      {
        label: "Varietas",
        icon: mdiGrain,
        to: "/variety",
      },
      // {
      //   label: "Hama dan Penyakit",
      //   icon: mdiVirus,
      //   to: "/plant-problem",
      // },
      // {
      //   label: "Budidaya",
      //   icon: mdiCalculatorVariant,
      //   to: "/cultivation",
      // },
    ],
  },
  {
    to: "/land",
    label: "Lahan",
    icon: mdiLandPlots,
  },
  {
    to: "/measurement",
    label: "Pengukuran",
    icon: mdiCalculatorVariant,
  },
  {
    to: "/device",
    label: "Perangkat",
    icon: mdiDevices,
  },
  // {
  //   to: "/record",
  //   label: "Record",
  //   icon: mdiRecord,
  // },
  {
    to: "/user",
    label: "Pengguna",
    icon: mdiAccountGroup,
  },
  {
    to: "/admin",
    label: "Admin",
    icon: mdiShieldAccount,
  },
  {
    label: "UI",
    icon: mdiMenuDown,
    menu: [
      {
        to: "/login",
        label: "Login",
        icon: mdiLock,
      },
      {
        to: "/error",
        label: "Error",
        icon: mdiAlertCircle,
      },
      {
        to: "/forms",
        label: "Forms",
        icon: mdiSquareEditOutline,
      },
      {
        to: "/ui",
        label: "UI",
        icon: mdiTelevisionGuide,
      },
      {
        href: "https://github.com/justboil/admin-one-vue-tailwind",
        label: "GitHub",
        icon: mdiGithub,
        target: "_blank",
      },
    ],
  },
];
