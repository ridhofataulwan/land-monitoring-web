<script setup>
import { ref, onMounted } from "vue";
import {
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiPlus,
  mdiDevices,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import DeviceTable from "@/components/DeviceView/DeviceTable.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import api from "@/services/axios.js";

const form = ref({ name: "" });
let deviceCount = ref(0);
let device = ref([]);

const isModalAdd = ref(false);
const isModalResponse = ref(false);
const alertMessage = ref(null);

onMounted(() => {
  getDeviceData();
});

const getDeviceData = () => {
  api
    .get("/device")
    .then((response) => {
      device.value = response.data.data;
      deviceCount.value = response.data.count;
    })
    .catch((error) => {
      console.log(error);
    });
};

const addDevice = () => {
  isModalAdd.value = true;
};

const submitDevice = () => {
  const formData = {
    name: form.value.name,
  };

  api
    .post("/device", formData)
    .then((response) => {
      getDeviceData();
      alertMessage.value = response.data.message;
      isModalResponse.value = true;
      setTimeout(() => {
        isModalResponse.value = false;
      }, 500);
      isModalAdd.value = false;
      form.value = {
        name: "",
      };
    })
    .catch((error) => {
      isModalAdd.value = false;
      console.error("Failed to submit device data:", error);
    });
};
</script>

<template>
  <LayoutAuthenticated>
    <!-- Modal Add -->
    <CardBoxModal v-model="isModalAdd" title="Tambah Perangkat">
      <CardBox v-if="isModalAdd" is-form @submit.prevent="submitDevice">
        <FormField label="Nama" help="Isi dengan nama perangkat">
          <FormControl
            v-model="form.name"
            :icon="mdiDevices"
            name="name"
            required
            autocomplete="name"
          />
        </FormField>

        <BaseButtons>
          <BaseButton color="info" type="submit" label="Submit" />
        </BaseButtons>
      </CardBox>
    </CardBoxModal>

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
        title="Perangkat"
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
          :icon="mdiDevices"
          :number="deviceCount"
          label="Perangkat"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiDevices" title="Perangkat">
        <BaseButton :icon="mdiPlus" @click="addDevice()"> </BaseButton>
      </SectionTitleLineWithButton>

      <CardBox has-table class="mb-2">
        <DeviceTable
          :devices="device"
          :devices-count="deviceCount"
          @device-updated="getDeviceData"
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
