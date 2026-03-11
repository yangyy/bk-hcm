<script setup lang="ts">
import { computed } from 'vue';
import { timeFormatter } from '@/common/util';
const props = withDefaults(defineProps<{ value: string | string[] | Date[]; format: string }>(), {
  format: 'YYYY-MM-DD HH:mm:ss',
});

const displayValue = computed(() => {
  if (Array.isArray(props.value)) {
    const [start, end] = props.value;
    const s = timeFormatter(start, props.format);
    const e = timeFormatter(end, props.format);
    return s && e ? `${s} ~ ${e}` : s || e || '--';
  }
  return timeFormatter(props.value, props.format);
});
</script>

<template>
  {{ displayValue || '--' }}
</template>
