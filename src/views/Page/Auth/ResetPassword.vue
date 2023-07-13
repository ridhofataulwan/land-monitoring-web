<script setup>
import { ref } from "vue";
import router from "@/router";
import api from "@/services/axios.js";

import { mdiKey } from "@mdi/js";
import SectionFullScreen from "@/components/Section/SectionFullScreen.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import CardBoxModal from "@/components/CardBox/CardBoxModal.vue";

const form = ref({
  password: "",
  passwordConf: "",
});
const alert = ref({
  message: "",
});

const isModalActive = ref(false);
const param = new URLSearchParams(window.location.search);

if (!param.has("token")) {
  alert.value.message = "Reset password token is missing";
  isModalActive.value = true;
  setTimeout(() => {
    router.replace({ path: "/login" });
  }, 2000);
}

const resetPassword = async () => {
  if (form.value.password !== form.value.passwordConf) {
    alert.value.message = "Password and confirmation password do not match.";
    isModalActive.value = true;
    return;
  }
  if ((form.value.password == "") & (form.value.passwordConf == "")) {
    alert.value.message = "Password can't be null.";
    isModalActive.value = true;
    return;
  }

  try {
    const response = await api.post(
      "/auth/reset-password/" + param.get("token"),
      {
        newPassword: form.value.password,
      },
      {}
    );
    if (response.data.success) {
      alert.value.message = "Password reset successful.";
      isModalActive.value = true;
      setTimeout(() => {
        router.replace({ path: "/index" });
      }, 2000);
    } else {
      isModalActive.value = true;
      alert.value.message = "Password reset failed.";
      setTimeout(() => {
        router.replace({ path: "/index" });
      }, 2000);
    }
  } catch (error) {
    console.error(error);
    isModalActive.value = true;
    alert.value.message = "An error occurred while resetting the password.";
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
      <CardBox :class="cardClass" is-form @submit.prevent="resetPassword">
        <img
          :src="'/logo.png'"
          class="h-20 w-20 object-cover rounded-full mx-auto"
          alt="Logo"
        />

        <h1 class="text-center text-lg">Reset Password</h1>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.password"
            :icon="mdiKey"
            type="password"
            name="password"
            autocomplete="username"
            required
          />
        </FormField>
        <FormField
          label="Password Confirmation"
          help="Please enter your confirmation password"
        >
          <FormControl
            v-model="form.passwordConf"
            :icon="mdiKey"
            type="password"
            name="password"
            autocomplete="current-password"
            required
          />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
