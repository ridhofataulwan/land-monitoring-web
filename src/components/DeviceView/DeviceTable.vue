<script setup>
import { computed, ref, defineEmits } from "vue";
import { mdiEye, mdiPencil, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import CardBox from "../CardBox/CardBox.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import api from "@/services/axios.js";
import FormControl from "../Form/FormControl.vue";
import FormField from "../Form/FormField.vue";

// 📌 Pagination
const perPage = ref(5);
const currentPage = ref(0);
const numPages = computed(() => Math.ceil(props.devicesCount / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const props = defineProps({
  devicesCount: {
    type: Number,
    required: true,
  },
  devices: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["device-updated"]);

let selectedDevice = ref(null);

let isModalActive = ref(false);
let isModalUpdate = ref(false);
let isModalDangerActive = ref(false);
let isModalResponse = ref(false);

let alertMessage = ref(null);

let optionSelect = [
  { id: "ON", label: "ON" },
  { id: "OFF", label: "OFF" },
  { id: "DISABLED", label: "DISABLED" },
];

const selectDevice = (device) => {
  selectedDevice.value = device;
  isModalActive.value = true;
};

const editDevice = (device) => {
  selectedDevice.value = device;
  isModalUpdate.value = true;
};
const deleteDevice = (device) => {
  selectedDevice.value = device;
  isModalDangerActive.value = true;
};

const handleDeleteDevice = async () => {
  try {
    const response = await api.delete(`/device/${selectedDevice.value.id}`);
    alertMessage.value = response.data.message;
    isModalDangerActive.value = false;
    isModalResponse.value = true;
    emit("device-updated");
    setTimeout(() => {
      isModalResponse.value = false;
    }, 500);
  } catch (error) {
    console.error(error);
  }
};

const handleUpdateDevice = async () => {
  try {
    const formData = {
      name: selectedDevice.value.name,
      state: selectedDevice.value.state,
    };
    const response = await api.patch(
      `/device/${selectedDevice.value.id}`,
      formData
    );

    alertMessage.value = response.data.message;
    isModalUpdate.value = false;
    isModalResponse.value = true;
    emit("device-updated");
    setTimeout(() => {
      isModalResponse.value = false;
    }, 1000);
  } catch (error) {
    console.error(error);
  }
};

const no = 1;
</script>

<template>
  <!-- Modal Detail -->
  <CardBoxModal
    v-model="isModalActive"
    :title="selectedDevice ? selectedDevice.name : ''"
  >
    <template v-if="isModalActive">
      <p>
        <b>Nama:</b>
        {{ selectedDevice.name }}
      </p>
      <p>
        <b>Status:</b>
        {{ selectedDevice.state }}
      </p>
      <p>
        <b>Dibuat:</b>
        {{ new Date(selectedDevice.created_at).toISOString().split("T")[0] }}
      </p>
      <p>
        <b>Diperbarui:</b>
        {{ new Date(selectedDevice.updated_at).toISOString().split("T")[0] }}
      </p>
    </template>
  </CardBoxModal>
  <!-- Modal Update -->
  <CardBoxModal v-model="isModalUpdate" title="Ubah Perangkat">
    <CardBox v-if="isModalUpdate" is-form @submit.prevent="handleUpdateDevice">
      <FormField label="Nama">
        <FormControl
          v-model="selectedDevice.name"
          :icon="mdiLeaf"
          name="name"
          required
        />
      </FormField>
      <FormField label="Status">
        <FormControl
          v-model="selectedDevice.state"
          :icon="mdiLeaf"
          :options="optionSelect"
          name="state"
          required
        />
      </FormField>

      <BaseButtons>
        <BaseButton color="info" type="submit" label="Submit" />
      </BaseButtons>
    </CardBox>
  </CardBoxModal>
  <!-- Modal Delete -->
  <CardBoxModal
    v-model="isModalDangerActive"
    :title="selectedDevice ? selectedDevice.name : ''"
    button="danger"
    button-label="Confirm"
    has-cancel
  >
    <p v-if="isModalDangerActive">
      Apakah anda yakin akan menghapus
      {{ selectedDevice.name }} ?
    </p>
    <BaseButton
      label="Confirm"
      color="danger"
      @click="handleDeleteDevice(selectedDevice.id)"
    />
  </CardBoxModal>

  <!-- Modal Response -->
  <CardBoxModal
    v-model="isModalResponse"
    :title="selectedDevice ? selectedDevice.name : ''"
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
        <th>ID Perangkat</th>
        <th>Nama</th>
        <th>Status</th>
        <th>Dibuat</th>
        <th>Diperbarui</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="device in devices" :key="device.id">
        <td>{{ no++ }}</td>
        <td data-label="ID">
          {{ device.id }}
        </td>
        <td data-label="Nama">
          {{ device.name }}
        </td>
        <td data-label="Status">
          {{ device.state }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ new Date(device.created_at).toISOString().split("T")[0] }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ new Date(device.updated_at).toISOString().split("T")[0] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="selectDevice(device)"
            />
            <BaseButton
              color="info"
              :icon="mdiPencil"
              small
              @click="editDevice(device)"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="deleteDevice(device)"
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
