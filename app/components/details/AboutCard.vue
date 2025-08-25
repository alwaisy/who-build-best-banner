<script setup lang="ts">
const props = defineProps<{ about: string }>()
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>About</CardTitle>
    </CardHeader>
    <Separator decorative />
    <CardContent>
      <p class="whitespace-pre-line leading-relaxed text-muted-foreground">
        {{ props.about }}
      </p>
    </CardContent>
  </Card>
</template>
