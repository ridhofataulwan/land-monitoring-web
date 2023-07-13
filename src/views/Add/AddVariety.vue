<script setup>
import { onMounted, ref } from "vue";
import api from "@/services/axios";
import { mdiBallotOutline, mdiLeaf, mdiWhatsapp, mdiImage } from "@mdi/js";
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
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  getPlantData();
});

const selectOptions = ref([]);
const form = ref({
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

const getPlantData = () => {
  api
    .get("/plant")
    .then((response) => {
      plant.value = response.data.data;
      selectOptions.value = plant.value.map((plant) => ({
        id: plant.id,
        label: plant.name,
      }));
      console.log(selectOptions.value[0]);
    })
    .catch((error) => {
      console.log(error);
    });
};
const submit = () => {
  const formData = new FormData();
  formData.append("name", form.value.name);
  formData.append("plant_id", form.value.plant_id);
  formData.append(
    "optimal_condition",
    JSON.stringify(form.value.optimal_condition)
  );
  formData.append("image", form.value.image);
  console.log(JSON.stringify(form.value.optimal_condition));
  api
    .post("/variety", formData)
    .then((response) => {
      alertMessage.value = response.data.message;
      isModalResponse.value = true;
      setTimeout(() => {
        isModalResponse.value = false;
      }, 500);
      form.value = {
        name: "",
        plant_id: null,
        optimal_condition: {
          nitrogen: "",
          phosphorus: "",
          potassium: "",
          ph: "",
        },
        image: null,
      };
      router.push("/variety");
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
    form.value.image = file;
  };
};
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
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
        title="Tambah Varietas"
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
              v-model="form.plant_id"
              :options="selectOptions"
              :selectedOption="selectOptions[0]"
              placeholder="Jenis Tanaman"
              required
            />
          </FormField>
          <FormField label="Nama Varietas">
            <FormControl v-model="form.name" :icon="mdiLeaf" required />
          </FormField>
        </div>
        <label class="block font-bold mb-2"> Kondisi Optimal</label>
        <div class="grid grid-cols-4 gap-5 mb-6">
          <div>
            <label class="block mb-1">Nitrogen (N)</label>
            <FormControl
              v-model="form.optimal_condition.nitrogen"
              :icon="mdiLeaf"
              sufix="ppm"
              name="Nitrogen"
              type="number"
              required
            />
          </div>
          <div>
            <label class="block mb-1">Phosphorus (P)</label>
            <FormControl
              v-model="form.optimal_condition.phosphorus"
              :icon="mdiLeaf"
              sufix="ppm"
              name="Phosphorus"
              type="number"
              required
            />
          </div>
          <div>
            <label class="block mb-1">Potassium (K)</label>
            <FormControl
              v-model="form.optimal_condition.potassium"
              :icon="mdiLeaf"
              sufix="ppm"
              name="Potassium"
              type="number"
              required
            />
          </div>
          <div>
            <label class="block mb-1">pH</label>
            <FormControl
              v-model="form.optimal_condition.ph"
              :icon="mdiLeaf"
              sufix="pH"
              name="pH"
              type="number"
              required
            />
          </div>
        </div>

        <FormField label="Gambar" help="Maks 500kb">
          <FormFilePicker
            :icon="mdiImage"
            label="Upload"
            required
            @change="updateImage"
          />
        </FormField>
        <div class="py-3">
          <img
            v-if="isImageUpload"
            :src="imageUploaded"
            alt="Variety Image"
            required
          />
        </div>

        <BaseDivider />

        <BaseButtons>
          <BaseButton type="submit" color="info" label="Submit" />
        </BaseButtons>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
