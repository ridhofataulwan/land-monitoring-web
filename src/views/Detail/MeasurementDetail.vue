<script setup>
import { onMounted, ref, onUnmounted } from "vue";
import { mdiChartTimelineVariant, mdiReload, mdiMapMarker } from "@mdi/js";
import { useStyleStore } from "@/stores/style.js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentTitle from "@/components/CardBox/CardBoxComponentTitle.vue";
import api from "@/services/axios.js";
import ApexCharts from "apexcharts";
import BaseButton from "@/components/BaseButton.vue";
import FormField from "@/components/Form/FormField.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
useStyleStore();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

onMounted(() => {
  getMeasurementByID();
  getRecordByMeasurementID();
});

const measurement = ref(null);
const records = ref(null);
const condition = ref(null);
const chartInstance = ref(null);
const isChartReady = ref(false);
const isFetching = ref(false);

const fetching = () => {
  isFetching.value = true;
  getRecordByMeasurementID();
};

const getMeasurementByID = () => {
  api
    .get(`/measurement/${props.id}`)
    .then((response) => {
      measurement.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const getRecordByMeasurementID = () => {
  api
    .get(`/record?measurementId=${props.id}`)
    .then((response) => {
      records.value = response.data.records;
      console.log(records.value);
      let values = {
        Nitrogen: [],
        Phosphorus: [],
        Potassium: [],
        pH: [],
      };

      records.value.forEach((record) => {
        values["Nitrogen"].push(parseFloat(record.condition.nitrogen));
        values["Phosphorus"].push(parseFloat(record.condition.phosphorus));
        values["Potassium"].push(parseFloat(record.condition.potassium));
        values["pH"].push(parseFloat(record.condition.ph));
      });

      let averages = {};

      Object.keys(values).forEach((key) => {
        let total = values[key].reduce((acc, curr) => acc + curr);
        let average = total / values[key].length;
        averages[key] = average.toFixed(2);
      });

      let labels = Object.keys(averages);
      let data = Object.values(averages);
      const optimal_condition = measurement.value.variety.optimal_condition;

      const options = {
        chart: {
          type: "radar",
        },
        series: [
          {
            name: "Kondisi Ideal",
            data: [
              optimal_condition.nitrogen,
              optimal_condition.phosphorus,
              optimal_condition.potassium,
              optimal_condition.ph,
            ],
          },
          { name: "Nilai Aktual", data: data },
        ],
        labels: labels,
      };

      let percentage = 0;
      options.series[0].data.forEach((value, index) => {
        percentage +=
          1 - ((value - options.series[1].data[index]) * value) / 100;
      });
      condition.value = (percentage / 4) * 100;
      condition.value = averages;

      if (chartInstance.value) {
        chartInstance.value.updateOptions(options);
      } else {
        chartInstance.value = new ApexCharts(
          document.querySelector("#chart"),
          options
        );
        chartInstance.value.render();
        isChartReady.value = true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal v-model="isFetching" title="Memuat..." class="text-center"
      ><div
        class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      ></div>
    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiChartTimelineVariant"
        :title="`Detail Pengukuran ID ${id}`"
      >
        <BaseButton
          :icon="mdiReload"
          label="Perbarui"
          color="contrast"
          rounded-full
          small
          @click="fetching"
        />
      </SectionTitleLineWithButton>
      <CardBox class="mb-5">
        <CardBoxComponentTitle title="Informasi Pengukuran" />
        <div class="grid grid-cols-1 gap-1 my-1 lg:grid-cols-3">
          <FormField label="ID Lahan">
            {{ measurement && measurement.land ? measurement.land.id : "N/A" }}
          </FormField>
          <FormField label="Nama Lahan">
            {{
              measurement && measurement.land ? measurement.land.name : "N/A"
            }}
          </FormField>
          <FormField label="Lokasi">
            Longitude:
            {{
              measurement && measurement.land
                ? measurement.land.location.lon
                : "N/A"
            }}, Latitude:
            {{
              measurement && measurement.land
                ? measurement.land.location.lat
                : "N/A"
            }}
          </FormField>
          <FormField label="Perangkat Tertaut">
            {{
              measurement && measurement.device
                ? measurement.device.id + " - " + measurement.device.name
                : "N/A"
            }}
          </FormField>
          <FormField label="Tanaman">
            {{
              measurement && measurement.plant
                ? measurement.plant.id + " - " + measurement.plant.name
                : "N/A"
            }}
          </FormField>
          <FormField label="Varietas">
            {{
              measurement && measurement.variety
                ? measurement.variety.id + " - " + measurement.variety.name
                : "N/A"
            }}
          </FormField>
        </div>
      </CardBox>

      <CardBox>
        <table>
          <thead>
            <tr>
              <th>Tanggal - Waktu</th>
              <th>Nitrogen</th>
              <th>Phosphorus</th>
              <th>Potassium</th>
              <th>pH</th>
              <th>Lokasi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="records < 1">
              <td class="text-center" colspan="7">Belum ada data record</td>
            </tr>
            <tr v-for="(record, index) in records" :key="index">
              <td>
                {{
                  new Date(record.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  }) +
                  " - " +
                  new Date(record.createdAt).toLocaleTimeString("id-ID", {
                    hour: "numeric",
                    minute: "numeric",
                  })
                }}
              </td>
              <td>{{ record.condition.nitrogen }} ppm</td>
              <td>{{ record.condition.phosphorus }} ppm</td>
              <td>{{ record.condition.potassium }} ppm</td>
              <td>{{ record.condition.ph }}</td>
              <td>
                Lon:{{ record.location.lon }}, Lat: {{ record.location.lat }}
                <BaseButton
                  v-if="record.location"
                  :href="
                    'https://www.openstreetmap.org/?mlat=' +
                    record.location.lat +
                    '&mlon=' +
                    record.location.lon
                  "
                  target="_blank"
                  color="info"
                  :icon="mdiMapMarker"
                >
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </CardBox>
      <div class="grid grid-cols-1 gap-6 my-6 lg:grid-cols-2">
        <CardBox>
          <CardBoxComponentTitle title="Grafik Tanah"></CardBoxComponentTitle>
          <p v-if="!condition" class="text-center">Belum ada data record</p>
          <div id="chart"></div>
        </CardBox>

        <CardBox>
          <CardBoxComponentTitle title="Kondisi Tanah"></CardBoxComponentTitle>
          <p v-if="!condition" class="text-center">Belum ada data record</p>
          <table v-if="condition">
            <thead>
              <th>Parameter</th>
              <th>Kondisi Ideal</th>
              <th>Kondisi Aktual</th>
            </thead>
            <tbody>
              <tr>
                <td>Nitrogen</td>
                <td>
                  {{
                    measurement
                      ? measurement.variety.optimal_condition.nitrogen
                      : ""
                  }}
                  ppm
                </td>
                <td>{{ condition ? condition.Nitrogen : "" }} ppm</td>
              </tr>
              <tr>
                <td>Phosphorus</td>
                <td>
                  {{
                    measurement
                      ? measurement.variety.optimal_condition.phosphorus
                      : ""
                  }}
                  ppm
                </td>
                <td>{{ condition ? condition.Phosphorus : "" }} ppm</td>
              </tr>
              <tr>
                <td>Potassium</td>
                <td>
                  {{
                    measurement
                      ? measurement.variety.optimal_condition.potassium
                      : ""
                  }}
                  ppm
                </td>
                <td>{{ condition ? condition.Potassium : "" }} ppm</td>
              </tr>
              <tr>
                <td>pH</td>
                <td>
                  {{
                    measurement ? measurement.variety.optimal_condition.ph : ""
                  }}
                </td>
                <td>{{ condition ? condition.pH : "" }}</td>
              </tr>
            </tbody>
          </table>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
