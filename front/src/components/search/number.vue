<script setup lang="ts">
import { useAttrs } from 'vue';
import FormNumber from '@/components/form/number.vue';
defineOptions({ name: 'hcm-search-number' });

const model = defineModel<number | string>();
const attrs = useAttrs();
</script>

<template>
  <form-number v-model="model" v-bind="attrs" />
</template>
