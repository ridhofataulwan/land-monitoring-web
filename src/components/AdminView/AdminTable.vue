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
const numPages = computed(() => Math.ceil(props.adminsCount / perPage.value));
const currentPageHuman = computed(() => currentPage.value + 1);
const pagesList = computed(() => {
  const pagesList = [];
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i);
  }
  return pagesList;
});

const props = defineProps({
  adminsCount: {
    type: Number,
    required: true,
  },
  admins: {
    type: Array,
    required: true,
  },
});

let selectedAdmin = ref(null);
let isModalActive = ref(false);

const selectAdmin = (admin) => {
  selectedAdmin.value = admin;
  isModalActive.value = true;
};
const obfuscateEmail = (email) => {
  const [adminname, domain] = email.split("@");
  const obfuscatedAdminname =
    adminname.slice(0, 3) + "*".repeat(adminname.length - 3);
  return obfuscatedAdminname + "@" + domain;
};

const no = 1;
</script>
<template>
  <CardBoxModal
    v-model="isModalActive"
    :title="selectedAdmin ? selectedAdmin.name : ''"
  >
    <template v-if="selectedAdmin">
      <p><b>ID : </b>{{ selectedAdmin.id }}</p>
      <p>
        <b>Email : </b
        ><a :href="'mailto:' + selectedAdmin.email">{{
          selectedAdmin.email
        }}</a>
      </p>
      <p><b>No. HP : </b>{{ selectedAdmin.phone_number }}</p>
      <p>
        <b>Alamat :</b>
        {{ selectedAdmin.address.province }},
        {{ selectedAdmin.address.district }},
        {{ selectedAdmin.address.regency }},
        {{ selectedAdmin.address.village }}
      </p>
      <p>
        <b>Terdaftar pada : </b
        >{{ new Date(selectedAdmin.created_at).toISOString().split("T")[0] }}
      </p>
      <p>
        <b>Diperbarui pada : </b
        >{{ new Date(selectedAdmin.updated_at).toISOString().split("T")[0] }}
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
    <tbody>
      <tr v-for="admin in admins" :key="admin.id">
        <td>{{ no++ }}</td>
        <td data-label="Name">
          {{ admin.name }}
        </td>
        <td :title="admin.email">
          {{ obfuscateEmail(admin.email) }}
        </td>
        <td data-label="District">
          {{ admin.address.district }}
        </td>
        <td data-label="Phone Number" class="lg:w-32">
          {{ admin.phone_number }}
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          {{ new Date(admin.created_at).toISOString().split("T")[0] }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="selectAdmin(admin)"
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
