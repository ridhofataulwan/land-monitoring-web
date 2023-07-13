<script setup>
import { ref, onMounted } from "vue";
import {
  mdiAccountMultiple,
  mdiCalculatorVariantOutline,
  mdiChartTimelineVariant,
  mdiWhatsapp,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import api from "@/services/axios.js";
import MeasurementTable from "@/components/MeasurementView/MeasurementTable.vue";

onMounted(() => {
  getMeasurementData();
});

let measurement = ref([]);
let measurementCount = ref(null);

const getMeasurementData = () => {
  api
    .get("/measurement")
    .then((response) => {
      measurementCount.value = response.data.count;
      measurement.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Pengukuran"
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
          :icon="mdiCalculatorVariantOutline"
          :number="measurementCount"
          label="Pengukuran"
        />
      </div>

      <SectionTitleLineWithButton
        :icon="mdiAccountMultiple"
        title="Pengukuran"
      />

      <CardBox has-table class="mb-2">
        <MeasurementTable
          :measurements="measurement"
          :measurements-count="measurementCount"
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
