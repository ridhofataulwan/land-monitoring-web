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
const numPages = computed(() => Math.ceil(props.usersCount / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const props = defineProps({
  usersCount: {
    type: Number,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
});

let selectedUser = ref(null);
let isModalActive = ref(false);

const selectUser = (user) => {
  selectedUser.value = user;
  isModalActive.value = true;
};

const unselectUser = () => {
  selectedUser.value = null;
  isModalActive.value = false;
};

const no = 1;
</script>
<template>
  <CardBoxModal
    v-model="isModalActive"
    :title="selectedUser ? selectedUser.name : ''"
  >
    <template v-if="selectedUser">
      <p>
        <b>ID : </b><a>{{ selectedUser.id }}</a>
      </p>
      <p>
        <b>Email : </b
        ><a :href="'mailto:' + selectedUser.email">{{ selectedUser.email }}</a>
      </p>
      <p><b>No. HP : </b>{{ selectedUser.phone_number }}</p>
      <p>
        <b>Alamat :</b>
        {{ selectedUser.address.province }},
        {{ selectedUser.address.district }}, {{ selectedUser.address.regency }},
        {{ selectedUser.address.village }}
      </p>
      <p>
        <b>Terdaftar pada : </b
        >{{ new Date(selectedUser.created_at).toISOString().split("T")[0] }}
      </p>
      <p>
        <b>Diperbarui pada : </b
        >{{ new Date(selectedUser.updated_at).toISOString().split("T")[0] }}
      </p>
    </template>
  </CardBoxModal>
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
    <tbody @mouseover="unselectUser">
      <tr v-if="users.status">
        <td colspan="7">Data tidak ditemukan</td>
      </tr>
      <tr v-for="user in users" :key="user.id">
        <td>{{ no++ }}</td>
        <td data-label="Name" @mousedown="selectUser(user)">
          {{ user.name }}
        </td>
        <td :title="user.email">
          {{ user.email }}
        </td>
        <td data-label="District">
          {{ user.address.district }}
        </td>
        <td data-label="Phone Number" class="lg:w-32">
          {{ user.phone_number }}
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          {{ new Date(user.created_at).toISOString().split("T")[0] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              :to="'/user/' + user.id"
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
