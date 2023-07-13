<script setup>
import { onUpdated, defineProps, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const props = defineProps({
  location: {
    type: Object,
    required: true,
  },
  land: {
    type: Object,
    required: true,
  },
});

const mapContainer = ref(null);

onUpdated(() => {
  const map = L.map(mapContainer.value).setView(
    [props.location.lat, props.location.lon],
    13
  );

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker([props.location.lat, props.location.lon])
    .addTo(map)
    .bindPopup(props.land.name)
    .openPopup();
});
</script>

<template>
  <div>
    <div id="leaflet-map" ref="mapContainer"></div>
  </div>
</template>

<style>
#leaflet-map {
  height: 400px;
}
</style>
