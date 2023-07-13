<script setup>
import SectionFullScreen from "@/components/Section/SectionFullScreen.vue";
import CardBox from "@/components/CardBox/CardBox.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass">
        <div class="logo-container">
          <div class="flex justify-center items-center">
            <img
              src="/logo.png"
              alt="Logo"
              class="h-20 w-20 object-cover rounded-full"
            />
          </div>
          <h1 class="company-name">IoTanic</h1>
          <p class="tagline">Connect with your plants</p>
          <p class="vision">Smart Precision Farming</p>
        </div>
        <BaseButtons class="flex justify-center pt-5">
          <BaseButton label="Login" color="info" href="/login"></BaseButton>
        </BaseButtons>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>

<style scoped>
.logo-container {
  text-align: center;
}

.logo {
  height: 100px;
  width: 100px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 16px;
}

.company-name {
  font-size: 24px;
  font-weight: bold;
}

.tagline {
  font-size: 18px;
  margin-bottom: 8px;
}

.vision {
  font-size: 16px;
  color: #888;
}
</style>
