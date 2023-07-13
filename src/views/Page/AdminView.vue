<script setup>
import { ref, onMounted, computed } from "vue";
import { mdiShieldAccount, mdiWhatsapp, mdiEye, mdiSearchWeb } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import FormControl from "@/components/Form/FormControl.vue";
import api from "@/services/axios.js";

onMounted(fecthData);

const admin = ref({
  data: [],
  count: null,
});

const query = ref(null);
const filter = ref("name");

const selectedData = ref(null);
const isModalActive = ref(false);
const isFetching = ref(false);
const optionSelect = [
  { id: "name", label: "Nama" },
  { id: "email", label: "Email" },
];

// Pagination
const perPage = ref(10);
const currentPage = ref(0);
const numPages = computed(() => Math.ceil(admin.value.count / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() =>
  Array.from({ length: numPages.value }, (_, i) => i)
);

function fecthData() {
  isFetching.value = true;
  api
    .get("/user?role=USER")
    .then((response) => {
      admin.value = response.data;
      isFetching.value = false;
    })
    .catch((error) => {
      isFetching.value = false;
      console.log(error);
    });
}

function selectData(data) {
  selectedData.value = data;
  isModalActive.value = true;
}

function search() {
  api
    .get(`/user?role=USER&${filter.value}=${query.value}`)
    .then((response) => {
      admin.value.data = response.data.data;
    })
    .catch((error) => {
      admin.value.data = [];
      console.log(error);
    });
}

const getRowNumber = computed(
  () => admin.value.data?.map((_, index) => index + 1) || []
);

const paginatedData = computed(() => {
  const start = currentPage.value * perPage.value;
  const end = start + perPage.value;
  return admin.value.data?.slice(start, end) || [];
});
</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal
      v-model="isModalActive"
      :title="selectedData ? selectedData.name : ''"
    >
      <template v-if="selectedData">
        <p><b>ID : </b>{{ selectedData.id }}</p>
        <p>
          <b>Email : </b
          ><a :href="'mailto:' + selectedData.email">{{
            selectedData.email
          }}</a>
        </p>
        <p><b>No. HP : </b>{{ selectedData.phone_number }}</p>
        <p>
          <b>Alamat :</b>
          {{ selectedData.address.province }},
          {{ selectedData.address.district }},
          {{ selectedData.address.regency }},
          {{ selectedData.address.village }}
        </p>
        <p>
          <b>Terdaftar pada : </b
          >{{ new Date(selectedData.created_at).toISOString().split("T")[0] }}
        </p>
        <p>
          <b>Diperbarui pada : </b
          >{{ new Date(selectedData.updated_at).toISOString().split("T")[0] }}
        </p>
      </template>
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiShieldAccount" title="Admin" main>
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
          :icon="mdiShieldAccount"
          :number="admin.count"
          label="Admin"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiShieldAccount" title="Admin">
        <div class="flex">
          <FormControl
            v-model="filter"
            class="mx-4 w-40"
            type="select"
            :options="optionSelect"
          ></FormControl>
          <FormControl
            v-model="query"
            placeholder="Pencarian"
            :icon="mdiSearchWeb"
            @input="search"
          ></FormControl>
        </div>
      </SectionTitleLineWithButton>

      <CardBox has-table class="mb-2">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Email</th>
              <th>Alamat</th>
              <th>No. HP</th>
              <th>Terdaftar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-if="isFetching" colspan="7" class="text-center">
                <div
                  class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                ></div>
              </td>
            </tr>
            <tr v-if="(!admin.data || admin.data.length == 0) && !isFetching">
              <td colspan="7" class="text-center">
                Data dengan pencarian "{{ filter }}" dan keyword "{{ query }}"
                tidak ditemukan
              </td>
            </tr>
            <tr v-for="(data, index) in paginatedData" :key="data.id">
              <td>{{ getRowNumber[index] }}</td>
              <td data-label="Name">
                {{ data.name }}
              </td>
              <td :title="data.email">
                {{ data.email }}
              </td>
              <td data-label="District">
                {{ data.address.district }}
              </td>
              <td data-label="Phone Number" class="lg:w-32">
                {{ data.phone_number }}
              </td>
              <td data-label="Created" class="lg:w-1 whitespace-nowrap">
                {{ new Date(data.created_at).toISOString().split("T")[0] }}
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton
                    color="info"
                    :icon="mdiEye"
                    small
                    @click="selectData(data)"
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
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
