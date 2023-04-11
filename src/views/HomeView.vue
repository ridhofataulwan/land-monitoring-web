<script setup>
import { ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiAccountMultiple,
  mdiChartTimelineVariant,
  mdiMonitorCellphone,
  mdiWhatsapp,
  mdiLandPlots,
  mdiDevices,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import TableSampleClients from "@/components/TableSampleClients.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import axios from "axios";

const chartData = ref(null);

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData();
};

onMounted(() => {
  fillChartData();
});

const mainStore = useMainStore();
console.log(mainStore.clients);
console.log(mainStore.clients.slice(0, 4));
</script>

<script>
export default {
  data() {
    return {
      pengguna: null,
      lahan: null,
      device: null,
      users: null,
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/user")
      .then((response) => {
        this.pengguna = response.data.count;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/land")
      .then((response) => {
        this.lahan = response.data.count;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/device")
      .then((response) => {
        this.device = response.data.count;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get("http://localhost:5000/user")
      .then((response) => {
        this.users = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Overview"
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
          :number="pengguna"
          label="Pengguna"
        />
        <CardBoxWidget
          trend-type="down"
          color="text-teal-500"
          :icon="mdiLandPlots"
          :number="lahan"
          label="Lahan"
        />
        <CardBoxWidget
          trend-type="alert"
          color="text-teal-500"
          :icon="mdiDevices"
          :number="device"
          label="Device"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Penguna" />

      <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar>

      <CardBox has-table class="mb-2">
        <TableSampleClients />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
