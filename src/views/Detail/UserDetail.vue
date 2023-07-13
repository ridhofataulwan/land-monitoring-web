<script setup>
import { onMounted, ref } from "vue";
import {
  mdiAccount,
  mdiLandPlots,
  mdiCalculatorVariant,
  mdiLandPlotsCircle,
  mdiLeaf,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import api from "@/services/axios";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBoxComponentTitle from "@/components/CardBox/CardBoxComponentTitle.vue";
import FormField from "@/components/Form/FormField.vue";
import LandTable from "@/components/LandView/LandTable.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const user = ref({
  count: 0,
  data: [],
});
const land = ref([]);
const count = ref({
  land: null,
  measurement: null,
});

onMounted(() => {
  getUser();
  getLands();
  // getMeasurements();
});

async function getUser() {
  try {
    const userResponse = await api.get(`/user/${props.id}`);
    user.value = userResponse.data;
  } catch (error) {
    console.log(error);
  }
}

async function getLands() {
  try {
    const landResponse = await api.get(`/land?user_id=${props.id}`);
    land.value = landResponse.data.data;
    count.value.land = landResponse.data.count;
  } catch (error) {
    console.log(error);
  }
}

// async function getMeasurements() {
//   try {
//     const measurementResponse = await api.get(
//       `/measurement?user_id=${props.id}`
//     );
//     measurement.value = measurementResponse.data.data;
//     count.value.measurement = measurementResponse.data.count;
//   } catch (error) {
//     console.log(error);
//   }
// }
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Detail User" main>
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
      <CardBox>
        <div class="lg:mx-2">
          <h1 class="text-2xl">
            <b>{{ user ? user.name : "" }}</b>
          </h1>
          <h1>
            {{ user ? user.email : "" }}
          </h1>
          <p></p>
        </div>
      </CardBox>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 my-5">
        <CardBox>
          <FormField label="Alamat">
            {{
              user.address
                ? `${user.address.province}, ${user.address.district}`
                : ""
            }}
            <br />
            {{
              user.address
                ? `${user.address.regency}, ${user.address.village}`
                : ""
            }}
          </FormField>
          <FormField label="Phone Number">
            {{ user ? `${user.phone_number}` : "" }}
          </FormField>
        </CardBox>

        <CardBox>
          <CardBoxComponentTitle title="Statistik"></CardBoxComponentTitle>
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CardBoxWidget
              trend-type="up"
              color="text-teal-500"
              :icon="mdiLandPlots"
              :number="count.land"
              label="Lahan"
            />
            <CardBoxWidget
              trend-type="up"
              color="text-teal-500"
              :icon="mdiLeaf"
              :number="count.measurement"
              label="Tanaman"
            />
          </div>
        </CardBox>
      </div>
      <SectionTitleLineWithButton :icon="mdiLandPlotsCircle" title="Lahan" />

      <CardBox v-if="land" has-table class="mb-2">
        <LandTable :lands="land" />
      </CardBox>
      <SectionTitleLineWithButton
        :icon="mdiCalculatorVariant"
        title="Pengukuran"
      />

      <!-- <CardBox v-if="measurement" has-table class="mb-2">
        <MeasurementTable :measurements="measurement" />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
