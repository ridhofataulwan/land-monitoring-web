<script setup>
import { computed, ref } from "vue";
import { mdiEye } from "@mdi/js";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";

// 📌 Pagination
const perPage = ref(5);
const currentPage = ref(0);
const numPages = computed(() => Math.ceil(props.landsCount / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const props = defineProps({
  landsCount: {
    type: Number,
    required: true,
  },
  lands: {
    type: Array,
    required: true,
  },
});

let selectedLand = ref(null);
let isModalActive = ref(false);
const urlEmbeded = ref(null);
const selectLand = (land) => {
  selectedLand.value = land;
  urlEmbeded.value = `https://www.openstreetmap.org/export/embed.html?bbox=${land.location.lon},${land.location.lat},${land.location.lon},${land.location.lat}&amp;layer=mapnik`;
  isModalActive.value = true;
};

const no = 1;
</script>

<template>
  <!-- Modal Detail -->
  <CardBoxModal
    v-model="isModalActive"
    :title="selectedLand ? selectedLand.name : ''"
  >
    <template v-if="isModalActive">
      <p>
        <b>Pemilik :</b>
        {{ selectedLand.user.name }}
      </p>
      <p>
        <b>Alamat :</b>
        {{ selectedLand.address.province }},
        {{ selectedLand.address.district }}, {{ selectedLand.address.regency }},
        {{ selectedLand.address.village }}
      </p>

      <p>
        <b>Lokasi :</b>
        Lon: {{ selectedLand.location.lon }}, Lat:
        {{ selectedLand.location.lat }}
      </p>
      <div>
        <BaseButton
          small="true"
          :href="
            'https://www.openstreetmap.org/?mlat=' +
            selectedLand.location.lat +
            '&mlon=' +
            selectedLand.location.lon +
            '&zoom=15'
          "
          label="Lihat di OpenStreetMap"
        />
      </div>
      <p>
        <b>Dibuat :</b>
        {{ new Date(selectedLand.created_at).toISOString().split("T")[0] }}
      </p>
      <p>
        <b>Diperbarui :</b>
        {{ new Date(selectedLand.updated_at).toISOString().split("T")[0] }}
      </p>
    </template>
  </CardBoxModal>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Nama Lahan</th>
        <th>Pemilik</th>
        <th>Alamat</th>
        <th>Dibuat</th>
        <th>Diperbarui</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="lands < 1">
        <td colspan="8" class="text-center">Belum ada lahan</td>
      </tr>
      <tr v-for="land in lands" :key="land.id">
        <td>{{ no++ }}</td>
        <td data-label="ID" @mousedown="selectLand(land)">
          {{ land.id }}
        </td>
        <td data-label="Name">
          {{ land.name }}
        </td>
        <td data-label="Pemilik" @mousedown="selectUser(land.user.id)">
          {{ land.user.name }}
        </td>
        <td data-label="Address">
          {{ land.address.district }}
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          {{ new Date(land.created_at).toISOString().split("T")[0] }}
        </td>
        <td data-label="Updated" class="lg:w-1 whitespace-nowrap">
          {{ new Date(land.updated_at).toISOString().split("T")[0] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              :to="'/land/' + land.id"
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
