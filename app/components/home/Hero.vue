<script setup lang="ts">
import { Search } from "lucide-vue-next";
import { Input } from "~/components/ui/input";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits<{ (e: "update:modelValue", value: string): void }>();
</script>

<template>
  <Card class="py-12 md:py-16 bg-muted/30 mb-18">
    <div class="container mx-auto px-4 text-center space-y-4 md:space-y-6">
      <h1
        class="text-3xl md:text-5xl font-semibold tracking-tight text-foreground"
      >
        Who Made the Best Banner?
      </h1>
      <p
        class="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
      >
        Handpicked LinkedIn banners from top creators. Search by name, headline,
        or industry.
      </p>
    </div>

    <div class="mt-8 md:mt-10">
      <div class="container mx-auto px-4 max-w-xl">
        <label for="hero-search" class="sr-only">Search banners</label>
        <div class="relative">
          <Input
            id="hero-search"
            type="text"
            placeholder="Search by name, headline, or industry..."
            class="pr-12 py-3 text-base w-full"
            :model-value="props.modelValue"
            @update:model-value="(v) => emit('update:modelValue', v as string)"
          />
          <Search
            class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>
    </div>
  </Card>
</template>
