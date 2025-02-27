<template>
  <v-container class="fill-height text-center" fluid>
    <v-row justify="center" align="center" class="h-100">
      <v-col>
        <h1 class="text-h1 font-weight-bold">404</h1>
        <p class="text-h5 mb-4">Page not found</p>
        <router-link :to="{ name: 'home' }">Get back to the site</router-link>
      </v-col>
    </v-row>
  </v-container>
</template>
