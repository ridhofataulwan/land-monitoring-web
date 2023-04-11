<script setup>
import { useStyleStore } from "@/stores/style.js";

import { mdiAlertCircle } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
import CardBoxComponentTitle from "@/components/CardBox/CardBoxComponentTitle.vue";
import axios from "axios";
import ApexCharts from "apexcharts";

useStyleStore();
</script>

<script>
export default {
  name: "MeasurementDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      measurement: null,
      records: null,
      condition: null,
    };
  },
  mounted() {
    axios
      .get(`http://localhost:5000/measurement/${this.id}`)
      .then((response) => {
        this.measurement = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .get(`http://localhost:5000/record?measurementId=${this.id}`)
      .then((response) => {
        // Mendapatkan data records dari response
        this.records = response.data.records;
        console.log(this.records);

        let values = {
          Nitrogen: [],
          Phosphorus: [],
          Potassium: [],
          pH: [],
        };

        // Menambahkan nilai ke dalam array yang sesuai berdasarkan label
        this.records.forEach((record) => {
          values["Nitrogen"].push(
            parseInt(record.condition.nitrogen.replace(/\D/g, ""))
          );
          values["Phosphorus"].push(
            parseInt(record.condition.phosphorus.replace(/\D/g, ""))
          );
          values["Potassium"].push(
            parseInt(record.condition.potassium.replace(/\D/g, ""))
          );
          values["pH"].push(parseFloat(record.condition.ph.replace(",", ".")));
        });
        let averages = {};

        // Menghitung rata-rata untuk setiap label
        Object.keys(values).forEach((key) => {
          let total = values[key].reduce((acc, curr) => acc + curr);
          let average = total / values[key].length;
          averages[key] = average.toFixed(2);
        });

        let labels = Object.keys(averages);
        let data = Object.values(averages);
        // Membuat objek options untuk konfigurasi chart
        const options = {
          chart: {
            type: "radar",
          },
          series: [
            {
              name: "Kondisi Ideal",
              data: [20, 20, 20, 5],
            },
            {
              name: "Nilai Aktual",
              data: data,
            },
          ],
          labels: labels,
        };
        let percentage = 0;
        options.series[0].data.forEach((value, index) => {
          percentage +=
            1 - ((value - options.series[1].data[index]) * value) / 100;
        });
        this.condition = (percentage / 4) * 100;
        // document.querySelector("#percentage").innerHTML(percentage);
        // Membuat objek chart baru dengan menggunakan objek options
        const chart = new ApexCharts(document.querySelector("#chart"), options);

        // Menampilkan chart di dalam element dengan id "chart"
        chart.render();
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {},
};
</script>
<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiAlertCircle"
        :title="`Detail Pengukuran ID ${id}`"
      />

      <CardBox>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Nitrogen</th>
              <th>Phosphorus</th>
              <th>Potassium</th>
              <th>pH</th>
            </tr>
          </thead>
          <tbody>
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
              <td>{{ record.condition.nitrogen }}</td>
              <td>{{ record.condition.phosphorus }}</td>
              <td>{{ record.condition.potassium }}</td>
              <td>{{ record.condition.ph }}</td>
            </tr>
          </tbody>
        </table>
      </CardBox>
      <div class="grid grid-cols-1 gap-6 my-6 lg:grid-cols-2">
        <CardBox>
          <CardBoxComponentTitle title="Kondisi Tanah"></CardBoxComponentTitle>
          <div id="chart"></div>
        </CardBox>

        <CardBox>
          <CardBoxComponentTitle title="Grafik Tanah"></CardBoxComponentTitle>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
