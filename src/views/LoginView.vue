<script setup>
import { reactive } from "vue";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import router from "@/router";
import axios from "axios";
import SectionFullScreen from "@/components/Section/SectionFullScreen.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import FormField from "@/components/Form/FormField.vue";
import FormControl from "@/components/Form/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
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

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<script>
const form = reactive({
  email: "",
  password: "",
  remember: false,
});

const login = async () => {
  try {
    const response = await axios.post("http://localhost:5000/auth/signin", {
      email: form.email,
      password: form.password,
    });
    if (response.data.success) {
      localStorage.setItem("isAuthenticated", true);
      if (form.remember) {
        localStorage.setItem("email", form.email);
        localStorage.setItem("password", form.password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }
      localStorage.setItem("token", response.data.token);
      // set authentication token to local storage or cookie
      router.push({ path: "/" });
    }
  } catch (error) {
    console.error(error);
    // handle error
  }
};

export default {
  data() {
    return {
      form,
    };
  },
  methods: {
    login,
  },
};
</script>
