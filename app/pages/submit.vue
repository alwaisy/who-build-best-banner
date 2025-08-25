<script setup lang="ts">
useHead({
  title: "Submit",
})
</script>

<template>
  <div class="container mx-auto max-w-3xl px-4 py-10">
    <div class="space-y-3 text-center">
      <h1 class="text-2xl md:text-3xl font-semibold tracking-tight">Submit a LinkedIn Profile</h1>
      <p class="text-muted-foreground">Share a LinkedIn profile URL to feature their banner. We review and add the best ones.</p>
    </div>

    <div class="mt-8 flex justify-center">
      <Button as-child size="lg">
        <a href="https://tally.so/r/3jROx6" target="_blank" rel="noopener noreferrer">
          Open Submission Form
        </a>
      </Button>
    </div>

    <p class="mt-4 text-center text-xs text-muted-foreground">This opens an external Tally form in a new tab.</p>
  </div>
</template>
