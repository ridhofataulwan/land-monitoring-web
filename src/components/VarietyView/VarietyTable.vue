<script setup>
import { computed, ref, defineEmits } from "vue";
import { mdiEye, mdiPencil, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import api from "@/services/axios.js";

// 📌 Pagination
const perPage = ref(5);
const currentPage = ref(0);
const numPages = computed(() =>
  Math.ceil(props.varietiesCount / perPage.value)
);
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const props = defineProps({
  varietiesCount: {
    type: Number,
    required: true,
  },
  varieties: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["variety-updated"]);

let selectedVariety = ref(null);

let isModalDangerActive = ref(false);
let isModalResponse = ref(false);

let alertMessage = ref(null);

const deleteVariety = (variety) => {
  selectedVariety.value = variety;
  isModalDangerActive.value = true;
};

const handleDeleteVariety = async () => {
  try {
    const response = await api.delete(`/variety/${selectedVariety.value.id}`);
    console.log(response);
    alertMessage.value = response.data.message;
    isModalDangerActive.value = false;
    isModalResponse.value = true;
    emit("variety-updated");
    setTimeout(() => {
      isModalResponse.value = false;
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

const no = 1;
</script>

<template>
  <!-- Modal Delete -->
  <CardBoxModal
    v-model="isModalDangerActive"
    :title="selectedVariety ? selectedVariety.name : ''"
    button="danger"
    button-label="Confirm"
    has-cancel
  >
    <p v-if="isModalDangerActive">
      Apakah anda yakin akan menghapus
      {{ selectedVariety.name }} ?
    </p>
    <BaseButton
      label="Confirm"
      color="danger"
      @click="handleDeleteVariety(selectedVariety.id)"
    />
  </CardBoxModal>

  <!-- Modal Response -->
  <CardBoxModal
    v-model="isModalResponse"
    :title="selectedVariety ? selectedVariety.name : ''"
    button="danger"
    button-label="Confirm"
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
        <th>Jenis Tanaman</th>
        <th>Dibuat</th>
        <th>Diperbarui</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="variety in varieties" :key="variety.id">
        <td>{{ no++ }}</td>
        <td>
          {{ variety.id }}
        </td>
        <td data-label="Name">
          {{ variety.name }}
        </td>
        <td data-label="Name">
          {{ variety.plant.name }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ new Date(variety.created_at).toISOString().split("T")[0] }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ new Date(variety.updated_at).toISOString().split("T")[0] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              :to="'/variety/' + variety.id"
            />
            <BaseButton
              color="info"
              :icon="mdiPencil"
              small
              :to="'/variety/' + variety.id"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="deleteVariety(variety)"
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
