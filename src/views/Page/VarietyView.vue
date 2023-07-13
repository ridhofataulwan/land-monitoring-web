<script setup>
import { ref, onMounted } from "vue";
import {
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiLandPlotsCircle,
  mdiLeaf,
  mdiPlus,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import VarietyTable from "@/components/VarietyView/VarietyTable.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";

import api from "@/services/axios.js";

let variety = ref({});
let plant = ref({});
let dropdownPlant = ref([]);
let isModalResponse = ref(false);
let alertMessage = ref(null);

onMounted(() => {
  getVarietyData();
  getPlantData();
});

const getVarietyData = () => {
  api
    .get("/variety")
    .then((response) => {
      variety.value.data = response.data.data;
      variety.value.count = response.data.count;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getPlantData = () => {
  api
    .get("/plant")
    .then((response) => {
      plant.value = response.data.data;
      dropdownPlant.value = plant.value.map((plant) => ({
        id: plant.id,
        label: plant.name,
      }));
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<template>
  <LayoutAuthenticated>
    <!-- Modal Response -->
    <CardBoxModal
      v-model="isModalResponse"
      :title="alertMessage ? alertMessage : ''"
      button="danger"
      button-label="Confirm"
      has-cancel
    >
    </CardBoxModal>

    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Varietas"
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
          :number="variety.count"
          label="Varietas"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiLandPlotsCircle" title="Varietas">
        <BaseButton :icon="mdiPlus" to="/variety/add"> </BaseButton>
      </SectionTitleLineWithButton>

      <CardBox has-table class="mb-2">
        <VarietyTable
          :varieties="variety.data"
          :varieties-count="variety.count"
          @variety-updated="getVarietyData"
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
