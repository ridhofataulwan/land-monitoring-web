<script setup>
import { computed, ref, defineEmits } from "vue";
import { mdiEye, mdiPencil, mdiTrashCan, mdiLeaf, mdiImage } from "@mdi/js";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";

import api from "@/services/axios.js";
import FormFilePicker from "../Form/FormFilePicker.vue";
import FormField from "../Form/FormField.vue";
import FormControl from "../Form/FormControl.vue";

// 📌 Pagination
const perPage = ref(5);
const currentPage = ref(0);
const numPages = computed(() => Math.ceil(props.plantsCount / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const props = defineProps({
  plantsCount: {
    type: Number,
    required: true,
  },
  plants: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["plant-updated"]);

let selectedPlant = ref(null);

let isModalActive = ref(false);
let isModalUpdate = ref(false);
let isModalDangerActive = ref(false);
let isModalResponse = ref(false);

let alertMessage = ref(null);
let isImageUpload = ref(false);
let imageUploaded = ref(null);

const selectPlant = (plant) => {
  selectedPlant.value = plant;
  isModalActive.value = true;
};

const editPlant = (plant) => {
  selectedPlant.value = plant;
  isModalUpdate.value = true;
};
const updateImage = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    isImageUpload.value = true;
    imageUploaded.value = reader.result;
    selectedPlant.value.image = file;
  };
};

const handleUpdatePlant = async () => {
  try {
    const formData = new FormData();
    formData.append("name", selectedPlant.value.name);
    formData.append("image", selectedPlant.value.image);

    const response = await api.patch(
      `/plant/${selectedPlant.value.id}`,
      formData
    );
    alertMessage.value = response.data.message;
    isModalUpdate.value = false;
    isModalResponse.value = true;
    isImageUpload.value = false;
    emit("plant-updated");
    setTimeout(() => {
      isModalResponse.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
  }
};

const deletePlant = (plant) => {
  selectedPlant.value = plant;
  isModalDangerActive.value = true;
};

const handleDeletePlant = async () => {
  try {
    const response = await api.delete(`/plant/${selectedPlant.value.id}`);
    console.log(response);
    alertMessage.value = response.data.message;
    isModalDangerActive.value = false;
    isModalResponse.value = true;
    emit("plant-updated");
    setTimeout(() => {
      isModalResponse.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
    alertMessage.value = "Plant can't delete.";
    isModalDangerActive.value = false;
    isModalResponse.value = true;
    setTimeout(() => {
      isModalResponse.value = false;
    }, 1000);
  }
};

const no = 1;
</script>

<template>
  <!-- Modal Detail -->
  <CardBoxModal
    v-model="isModalActive"
    :title="selectedPlant ? selectedPlant.name : ''"
  >
    <template v-if="isModalActive">
      <img :src="selectedPlant.image.url" alt="Plant Image" />

      <p>
        <b>Dibuat pada :</b>
        {{ new Date(selectedPlant.created_at).toISOString().split("T")[0] }}
      </p>
      <p>
        <b>Diperbarui pada:</b>
        {{ new Date(selectedPlant.updated_at).toISOString().split("T")[0] }}
      </p>
    </template>
  </CardBoxModal>
  <!-- Modal Update -->
  <CardBoxModal v-model="isModalUpdate" title="Ubah Tanaman">
    <CardBox v-if="isModalUpdate" is-form @submit.prevent="handleUpdatePlant">
      <FormField label="Nama" help="Isi dengan nama tanaman">
        <FormControl
          v-model="selectedPlant.name"
          :icon="mdiLeaf"
          name="name"
          required
          autocomplete="name"
        />
      </FormField>
      <FormField label="Gambar" help="Maks 500kb">
        <FormFilePicker
          v-model="selectedPlant.image"
          :icon="mdiImage"
          label="Upload"
          @change="updateImage"
        />
      </FormField>
      <div class="py-3">
        <img v-if="isImageUpload" :src="imageUploaded" alt="Plant Image" />
        <img v-else :src="selectedPlant.image.url" alt="Plant Image" />
      </div>
      <BaseButtons>
        <BaseButton color="info" type="submit" label="Submit" />
      </BaseButtons>
    </CardBox>
  </CardBoxModal>
  <!-- Modal Delete -->
  <CardBoxModal
    v-model="isModalDangerActive"
    :title="selectedPlant ? selectedPlant.name : ''"
    button="danger"
    button-label="Confirm"
    has-cancel
  >
    <p v-if="isModalDangerActive">
      Apakah anda yakin akan menghapus
      <b>{{ selectedPlant.name }}</b> ?
    </p>
    <BaseButton
      label="Ya"
      color="danger"
      @click="handleDeletePlant(selectedPlant.id)"
    />
  </CardBoxModal>
  <!-- Modal Response -->
  <CardBoxModal
    v-model="isModalResponse"
    :title="selectedPlant ? selectedPlant.name : ''"
    button="danger"
    button-label="Ya"
    has-cancel
  >
    <p v-if="isModalResponse">
      {{ alertMessage }}
    </p>
  </CardBoxModal>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Nama</th>
        <th>Dibuat</th>
        <th>Diperbarui</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="plant in plants" :key="plant.id">
        <td>{{ no++ }}</td>
        <td>
          {{ plant.id }}
        </td>
        <td data-label="Name">
          {{ plant.name }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ new Date(plant.created_at).toISOString().split("T")[0] }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ new Date(plant.updated_at).toISOString().split("T")[0] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="selectPlant(plant)"
            />
            <BaseButton
              color="info"
              :icon="mdiPencil"
              small
              @click="editPlant(plant)"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="deletePlant(plant)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
