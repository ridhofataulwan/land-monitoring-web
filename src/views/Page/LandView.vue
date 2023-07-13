<script setup>
import { ref, onMounted } from "vue";
import {
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiLandPlots,
  mdiLandPlotsCircle,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import LandTable from "@/components/LandView/LandTable.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import api from "@/services/axios.js";

let land = ref({
  count: "",
  data: "",
});

onMounted(() => {
  getLandData();
});

const getLandData = () => {
  api
    .get("/land")
    .then((response) => {
      land.value.count = response.data.count;
      land.value.data = response.data.data;
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
        title="Lahan"
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
          :icon="mdiLandPlots"
          :number="land.count"
          label="Lahan"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiLandPlotsCircle" title="Lahan" />

      <CardBox has-table class="mb-2">
        <LandTable :lands="land.data" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
