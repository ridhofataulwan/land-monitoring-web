<script setup>
import { ref, onMounted } from "vue";
import { useMainStore } from "@/stores/main";
import {
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiLandPlotsCircle,
  mdiLeaf,
} from "@mdi/js";
import * as chartConfig from "@/components/Charts/chart.config.js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import PlantTable from "@/components/PlantView/PlantTable.vue";
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
      plant: null,
    };
  },
  mounted() {
    axios
      .get("http://localhost:5000/plant")
      .then((response) => {
        this.plant = response.data.count;
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
          :icon="mdiLeaf"
          :number="plant"
          label="Tanaman"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiLandPlotsCircle" title="Plant" />

      <CardBox has-table class="mb-2">
        <PlantTable />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
