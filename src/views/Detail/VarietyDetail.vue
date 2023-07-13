<script setup>
import { onMounted, ref } from "vue";
import api from "@/services/axios";
import { mdiBallotOutline, mdiLeaf, mdiImage, mdiWhatsapp } from "@mdi/js";
import SectionMain from "@/components/Section/SectionMain.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";
import FormFilePicker from "@/components/Form/FormFilePicker.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import SectionTitleLineWithButton from "@/components/Section/SectionTitleLineWithButton.vue";
onMounted(() => {
  getPlantData();
  getVarietyByID();
});

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const selectOptions = ref([]);

let variety = ref({
  plant_id: "",
  name: "",
  optimal_condition: {
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
  },
  image: null,
});
let plant = ref(null);
let isModalResponse = ref(false);
let alertMessage = ref(null);
let isImageUpload = ref(false);
let imageUploaded = ref("");

const getVarietyByID = () => {
  api
    .get("/variety/" + props.id)
    .then((response) => {
      variety.value.plant_id = response.data.plant.id;
      variety.value.name = response.data.name;
      isImageUpload.value = true;
      imageUploaded.value = response.data.image.url;
      variety.value.optimal_condition.nitrogen =
        response.data.optimal_condition.nitrogen;
      variety.value.optimal_condition.phosphorus =
        response.data.optimal_condition.phosphorus;
      variety.value.optimal_condition.potassium =
        response.data.optimal_condition.potassium;
      variety.value.optimal_condition.ph = response.data.optimal_condition.ph;
    })
    .catch((error) => {
      console.log(error);
      variety.value = null;
    });
};

const getPlantData = () => {
  api
    .get("/plant")
    .then((response) => {
      plant.value = response.data.data;
      selectOptions.value = plant.value.map((plant) => ({
        id: plant.id,
        label: plant.name,
      }));
    })
    .catch((error) => {
      console.log(error);
    });
};
const submit = () => {
  const formData = new FormData();
  formData.append("name", variety.value.name);
  formData.append("plant_id", variety.value.plant_id);
  formData.append(
    "optimal_condition",
    JSON.stringify(variety.value.optimal_condition)
  );
  formData.append("image", variety.value.image);
  console.log(JSON.stringify(variety.value.optimal_condition));
  api
    .patch("/variety/" + props.id, formData)
    .then((response) => {
      alertMessage.value = response.data.message;
      isModalResponse.value = true;
      setTimeout(() => {
        isModalResponse.value = false;
      }, 500);
    })
    .catch((error) => {
      alertMessage.value = error.message;
      isModalResponse.value = true;
      setTimeout(() => {
        isModalResponse.value = false;
      }, 500);
      console.error("Failed to submit variety data:", error);
    });
};

const updateImage = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    isImageUpload.value = true;
    imageUploaded.value = reader.result;
    variety.value.image = file;
  };
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain v-if="variety == null">
      <SectionTitleLineWithButton title="Data varietas tidak ditemukan" />
    </SectionMain>
    <SectionMain v-else>
      <!-- Modal Response -->
      <CardBoxModal
        v-model="isModalResponse"
        :title="alertMessage ? alertMessage : ''"
        button="danger"
        button-label="Confirm"
        has-cancel
      >
      </CardBoxModal>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        title="Detail Varietas"
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
      <CardBox form is-form @submit.prevent="submit">
        <div class="grid grid-cols-2 gap-3">
          <FormField label="Jenis Tanaman">
            <FormControl
              v-model="variety.plant_id"
              :options="selectOptions"
              :selectedOption="variety.plant_id"
              placeholder="Jenis Tanaman"
              required
            />
          </FormField>
          <FormField label="Nama Varietas">
            <FormControl
              v-model="variety.name"
              :icon="mdiLeaf"
              required
              :model-value="variety.name"
            />
          </FormField>
        </div>
        <label class="block font-bold mb-2"> Kondisi Optimal</label>
        <div class="grid grid-cols-4 gap-5 mb-6">
          <div>
            <label class="block mb-1">Nitrogen (N)</label>
            <FormControl
              v-model="variety.optimal_condition.nitrogen"
              :icon="mdiLeaf"
              sufix="ppm"
              placeholder="Nitrogen"
              name="Nitrogen"
              type="number"
              required
            />
          </div>
          <div>
            <label class="block mb-1">Phosphorus (P)</label>
            <FormControl
              v-model="variety.optimal_condition.phosphorus"
              :icon="mdiLeaf"
              sufix="ppm"
              placeholder="Phosphorus"
              name="Phosphorus"
              type="number"
              required
            />
          </div>
          <div>
            <label class="block mb-1">Pottasium (K)</label>
            <FormControl
              v-model="variety.optimal_condition.potassium"
              :icon="mdiLeaf"
              sufix="ppm"
              placeholder="Potasium"
              name="Potasium"
              type="number"
              required
            />
          </div>
          <div>
            <label class="block mb-1">pH</label>
            <FormControl
              v-model="variety.optimal_condition.ph"
              :icon="mdiLeaf"
              sufix="pH"
              placeholder="pH"
              name="pH"
              type="number"
              required
            />
          </div>
        </div>
        <FormField label="Gambar" help="Maks 500kb">
          <FormFilePicker
            aria-disabled="true"
            :icon="mdiImage"
            label="Upload"
            @change="updateImage"
          />
        </FormField>
        <div class="py-3">
          <img :src="imageUploaded" alt="Variety Image" required />
        </div>

        <BaseDivider />

        <BaseButtons>
          <BaseButton type="submit" color="info" label="Submit" />
        </BaseButtons>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
