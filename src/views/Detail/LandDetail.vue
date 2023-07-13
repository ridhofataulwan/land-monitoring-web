<script setup>
import { onMounted, ref } from "vue";
import { mdiEye, mdiLandPlots, mdiMapMarker } from "@mdi/js";
import { useStyleStore } from "@/stores/style.js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentTitle from "@/components/CardBox/CardBoxComponentTitle.vue";
import api from "@/services/axios.js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import MapLeaflet from "@/components/MapLeaflet.vue";
useStyleStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const land = ref({
  id: "",
  name: "",
  address: {
    province: "",
    district: "",
    regency: "",
    village: "",
  },
  location: {
    lon: 0,
    lat: 0,
  },
});
const measurements = ref([]);

onMounted(() => {
  getLandByID();
  getMeasurementByLandID();
});

const getLandByID = () => {
  api
    .get(`/land/${props.id}`)
    .then((response) => {
      land.value = response.data;
    })
    .catch((error) => {
      land.value = null;
      console.log(error);
    });
};

const getMeasurementByLandID = () => {
  api
    .get(`/measurement?land_id=${props.id}`)
    .then((response) => {
      measurements.value = response.data.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

let i = 1;
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain v-if="land == null">
      <SectionTitleLineWithButton title="Data lahan tidak ditemukan" />
    </SectionMain>
    <SectionMain v-else>
      <SectionTitleLineWithButton
        :icon="mdiLandPlots"
        :title="`Detail Lahan ${land.name}`"
      />
      <div class="grid grid-cols-1 gap-6 my-6 lg:grid-cols-2">
        <CardBox>
          <CardBoxComponentTitle title="Data Lahan" />
          <div class="flex mb-4">
            <div class="font-bold w-24">ID</div>
            <div class="w-2">:</div>
            <div class="flex-grow">{{ land.id }}</div>
          </div>
          <div class="flex mb-4">
            <div class="font-bold w-24">Nama</div>
            <div class="w-2">:</div>
            <div class="flex-grow">{{ land.name }}</div>
          </div>
          <div class="flex mb-4">
            <div class="font-bold w-24">Alamat</div>
            <div class="w-2">:</div>
            <div class="flex-grow">
              {{
                `${land.address.province}, ${land.address.district}, ${land.address.regency}, ${land.address.village}`
              }}
            </div>
          </div>
          <div class="flex mb-4">
            <div class="font-bold w-24">Pemilik</div>
            <div class="w-2">:</div>
            <div class="flex-grow">
              {{ land && land.user ? land.user.name : "-" }}
            </div>
          </div>
          <div class="flex mb-4">
            <div class="font-bold w-24">Luas</div>
            <div class="w-2">:</div>
            <div class="flex-grow">
              {{ land && land.user ? land.area + " ha" : "-" }}
            </div>
          </div>
          <div class="flex mb-4">
            <div class="font-bold w-24">Lokasi</div>
            <div class="w-2">:</div>
            <div class="flex-grow">
              <div>
                <span>Longitude:</span>
                <span>{{
                  land && land.location ? land.location.lon : "-"
                }}</span>
              </div>
              <div>
                <span>Latitude:</span>
                <span>{{
                  land && land.location ? land.location.lat : "-"
                }}</span>
              </div>
            </div>
            <BaseButton
              v-if="land.location"
              small="true"
              :href="
                'https://www.openstreetmap.org/?mlat=' +
                land.location.lat +
                '&mlon=' +
                land.location.lon
              "
              color="info"
              :icon="mdiMapMarker"
            ></BaseButton>
          </div>
          <CardBoxComponentTitle
            title="Kondisi Lahan Terkini"
          ></CardBoxComponentTitle>
        </CardBox>

        <CardBox>
          <CardBoxComponentTitle title="Peta" />
          <MapLeaflet :location="land.location" :land="land" />
        </CardBox>
      </div>
      <CardBox>
        <CardBoxComponentTitle title="Daftar Pengukuran" />
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>ID Pengukuran</th>
              <th>Perangkat</th>
              <th>Mulai</th>
              <th>Berakhir</th>
              <th>Dibuat</th>
              <th>Diperbarui</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-if="measurements < 1">
              <td colspan="10" class="text-center">Belum ada pengukuran</td>
            </tr>
            <tr v-for="data in measurements" :key="data.id">
              <td class="width-auto">{{ i++ }}</td>
              <td data-label="measurement_id">
                <router-link :to="'/measurement/' + data.id">
                  {{ data.id }}
                </router-link>
              </td>
              <td :v-if="data.device" data-label="State">
                {{ data.device ? data.device.id : "-" }}
              </td>
              <td class="lg:w-1 whitespace-nowrap">
                {{
                  data.start
                    ? new Date(data.start).toISOString().split("T")[0]
                    : "-"
                }}
              </td>
              <td class="lg:w-1 whitespace-nowrap">
                {{
                  data.end
                    ? new Date(data.end).toISOString().split("T")[0]
                    : "-"
                }}
              </td>
              <td>
                {{
                  new Date(data.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  }) +
                  " - " +
                  new Date(data.created_at).toLocaleTimeString("id-ID", {
                    hour: "numeric",
                    minute: "numeric",
                  })
                }}
              </td>
              <td>
                {{
                  new Date(data.updated_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  }) +
                  " - " +
                  new Date(data.updated_at).toLocaleTimeString("id-ID", {
                    hour: "numeric",
                    minute: "numeric",
                  })
                }}
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
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
