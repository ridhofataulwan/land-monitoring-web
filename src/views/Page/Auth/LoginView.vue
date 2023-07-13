<script setup>
import { ref } from "vue";
import router from "@/router";
import api from "@/services/axios.js";
import { setToken } from "@/services/jwt.js";

import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/Section/SectionFullScreen.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";

const form = ref({
  email: "",
  password: "",
});
const isModalActive = ref(false);
const alert = ref({
  message: "",
});

const login = async () => {
  try {
    const response = await api.post(
      "/auth/signin",
      {
        email: form.value.email,
        password: form.value.password,
      },
      {}
    );
    if (response.data.success) {
      setToken(response.data.token);
      router.push({ path: "/" });
    }
  } catch (error) {
    console.error(error);
    isModalActive.value = true;
    alert.value.message = "Email or password incorrect";
  }
};
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBoxModal
        v-model="isModalActive"
        :title="alert.message"
        class="text-center"
      >
      </CardBoxModal>
      <CardBox :class="cardClass" is-form @submit.prevent="login">
        <img
          :src="'/logo.png'"
          class="h-20 w-20 object-cover rounded-full mx-auto"
          alt="Logo"
        />
        <FormField label="Email" help="Please enter your email">
          <FormControl
            v-model="form.email"
            :icon="mdiAccount"
            name="email"
            autocomplete="username"
          />
        </FormField>
        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <BaseButtons class="flex justify-center p-5">
          <BaseButton type="submit" color="info" label="Login" />
        </BaseButtons>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
