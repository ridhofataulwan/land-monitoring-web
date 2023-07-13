<script setup>
import { ref, onMounted } from "vue";
import {
  mdiAccountMultiple,
  mdiChartTimelineVariant,
  mdiWhatsapp,
  mdiSearchWeb,
} from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBoxWidget from "@/components/CardBox/CardBoxWidget.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import BaseButton from "@/components/BaseButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import FormControl from "@/components/Form/FormControl.vue";

import api from "@/services/axios.js";
import UserTable from "@/components/UserView/UserTable.vue";

let user = ref({
  data: "",
  count: "",
});
let query = ref(null);
let filter = ref("name");

onMounted(() => {
  getUser();
});

const getUser = () => {
  api
    .get("/user?role=USER")
    .then((response) => {
      user.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const search = () => {
  api
    .get(`/user?role=USER&${filter.value}=${query.value}`)
    .then((response) => {
      user.value = response.data;
    })
    .catch((error) => {
      user.value.status = false;
      console.log(error);
    });
};

let optionSelect = [
  { id: "name", label: "Nama" },
  { id: "email", label: "Email" },
];
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        title="Pengguna"
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
          :icon="mdiAccountMultiple"
          :number="user.count"
          label="Pengguna"
        />
      </div>

      <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Penguna">
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

      <CardBox has-table class="mt-5">
        <UserTable :users="user.data" :users-count="user.count" />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
