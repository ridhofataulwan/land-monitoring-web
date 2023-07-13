<script setup>
import { ref, onMounted } from "vue";
import {
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiLeaf,
  mdiPlus,
  mdiImage,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import PlantTable from "@/components/PlantView/PlantTable.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";

import api from "@/services/axios.js";

const plant = ref({});
const form = ref({ name: "", image: null });

const isImageUpload = ref(false);
const imageUploaded = ref("");
const isModalAdd = ref(false);
const isModalResponse = ref(false);
const alertMessage = ref(null);

onMounted(() => {
  getPlantData();
});

// Fetch plant data from the API
const getPlantData = () => {
  api
    .get("/plant")
    .then((response) => {
      plant.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });
};

// Show the "Add Plant" modal
const addPlant = () => {
  isModalAdd.value = true;
};

// Submit new plant data
const submitPlant = () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("image", form.value.image);

  api
    .post("/plant", formData)
    .then((response) => {
      console.log("Plant data submitted successfully");
      console.log("Server response:", response.data);

      // Refresh plant data and show success message
      getPlantData();
      alertMessage.value = response.data.message;
      isModalResponse.value = true;
      setTimeout(() => {
        isModalResponse.value = false;
      }, 500);

      // Reset form values and image preview
      isModalAdd.value = false;
      form.value = { name: "", image: null };
      isImageUpload.value = false;
      imageUploaded.value = "";
    })
    .catch((error) => {
      isModalAdd.value = false;
      console.error("Failed to submit plant data:", error);
    });
};

// Update the selected image
const updateImage = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    isImageUpload.value = true;
    imageUploaded.value = reader.result;
    form.value.image = file;
  };
};
</script>

<template>
  <LayoutAuthenticated>
    <!-- Modal Response -->
    <CardBoxModal
      v-model="isModalResponse"
      :title="alertMessage || ''"
      button="danger"
      button-label="Confirm"
      has-cancel
    ></CardBoxModal>

    <!-- Modal Add -->
    <CardBoxModal v-model="isModalAdd" title="Tambah Tanaman">
      <CardBox v-if="isModalAdd" is-form @submit.prevent="submitPlant">
        <FormField label="Nama" help="Isi dengan nama tanaman">
          <FormControl
            v-model="form.name"
            :icon="mdiLeaf"
            name="name"
            required
            autocomplete="name"
          />
        </FormField>
        <FormField label="Gambar" help="Maks 500kb">
          <FormFilePicker
            :icon="mdiImage"
            label="Upload"
            @change="updateImage"
          />
        </FormField>
        <div v-if="isImageUpload" class="py-3">
          <img :src="imageUploaded" alt="Plant Image" />
        </div>
        <BaseButtons>
          <BaseButton color="info" type="submit" label="Submit" />
        </BaseButtons>
      </CardBox>
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Tanaman"
        main
      >
        <BaseButton
          href="https://wa.me/6285700999812"
          target="_blank"
          :icon="mdiWhatsapp"
          label="Hubungi kami"
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
          :number="plant.count"
          label="Tanaman"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiLeaf" title="Tanaman">
        <BaseButton :icon="mdiPlus" @click="addPlant()" />
      </SectionTitleLineWithButton>

      <CardBox has-table class="mb-2">
        <PlantTable
          :plants="plant.data"
          :plants-count="plant.count"
          @plant-updated="getPlantData"
        />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
