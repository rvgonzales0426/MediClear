<script setup>
const model = defineModel()
const props = defineProps(['totalPage'])
</script>

<template>
  <v-pagination v-model="model" :length="props.totalPage" rounded="circle"></v-pagination>
</template>
