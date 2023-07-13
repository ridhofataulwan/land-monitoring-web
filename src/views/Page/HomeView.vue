<script setup>
import { ref, onMounted } from "vue";
import {
  mdiAccountMultiple,
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiLandPlots,
  mdiDevices,
  mdiCompost,
  mdiBarley,
  mdiCalculatorVariant,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import api from "@/services/axios.js";
import UserTable from "@/components/UserView/UserTable.vue";

const user = ref([]);
const count = ref({
  land: null,
  device: null,
  user: null,
  plant: null,
  variety: null,
  measurement: null,
});

onMounted(() => {
  getCountData();
});
const getCountData = async () => {
  try {
    const [
      landResponse,
      deviceResponse,
      userResponse,
      plantResponse,
      varietyResponse,
      measurementResponse,
    ] = await Promise.all([
      api.get("/land"),
      api.get("/device"),
      api.get("/user?role=USER"),
      api.get("/plant"),
      api.get("/variety"),
      api.get("/measurement"),
    ]);
    count.value = {
      land: landResponse.data.count,
      device: deviceResponse.data.count,
      user: userResponse.data.count,
      plant: plantResponse.data.count,
      variety: varietyResponse.data.count,
      measurement: measurementResponse.data.count,
    };
    user.value = userResponse.data.data;
  } catch (error) {
    console.log(error.message);
  }
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Dashboard"
        main
      >
        <BaseButton
          href="https://wa.me/6285700999812"
          target="_blank"
          :icon="mdiWhatsapp"
          label="Hubungi Kami"
          color="contrast"
          rounded-full
          small
        />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trend-type="up"
          color="text-teal-500"
          :icon="mdiAccountMultiple"
          :number="count.user"
          label="Pengguna"
        />
        <CardBoxWidget
          trend-type="alert"
          color="text-teal-500"
          :icon="mdiDevices"
          :number="count.device"
          label="Perangkat"
        />
        <CardBoxWidget
          trend-type="alert"
          color="text-teal-500"
          :icon="mdiCalculatorVariant"
          :number="count.measurement"
          label="Pengukuran"
        />
        <CardBoxWidget
          trend-type="down"
          color="text-teal-500"
          :icon="mdiLandPlots"
          :number="count.land"
          label="Lahan"
        />
        <CardBoxWidget
          trend-type="alert"
          color="text-teal-500"
          :icon="mdiBarley"
          :number="count.plant"
          label="Tanaman"
        />
        <CardBoxWidget
          trend-type="alert"
          color="text-teal-500"
          :icon="mdiCompost"
          :number="count.variety"
          label="Varietas"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Pengguna" />

      <CardBox has-table class="mb-2">
        <UserTable :users="user" :users-count="count.user" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
