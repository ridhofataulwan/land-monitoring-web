<script setup>
import { computed, ref } from "vue";
import { mdiEye } from "@mdi/js";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";

// 📌 Pagination
const perPage = ref(5);
const currentPage = ref(0);
const numPages = computed(() =>
  Math.ceil(props.measurementsCount / perPage.value)
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
  measurementsCount: {
    type: Number,
    required: true,
  },
  measurements: {
    type: Array,
    required: true,
  },
});

const no = 1;
</script>

<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>Lahan</th>
        <th>Perangkat</th>
        <th>Mulai</th>
        <th>Berakhir</th>
        <th>Aksi</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="measurements < 1">
        <td colspan="7" class="text-center">Belum ada pengukuran</td>
      </tr>
      <tr v-for="data in measurements" :key="data.id">
        <td>{{ no++ }}</td>
        <td data-label="measurement_id">
          {{ data.id }}
        </td>
        <td data-label="Name">
          {{ data.land.name }}
        </td>
        <td :v-if="data.device" data-label="State">
          {{ data.device ? data.device.id : "-" }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{
            data.start ? new Date(data.start).toISOString().split("T")[0] : "-"
          }}
        </td>
        <td class="lg:w-1 whitespace-nowrap">
          {{ data.end ? new Date(data.end).toISOString().split("T")[0] : "-" }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              :to="'/measurement/' + data.id"
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
