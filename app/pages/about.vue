<script setup lang="ts">
useHead({
  title: 'About',
})

useSeoMeta({
  title: 'About — Who Made Best Banner',
  description:
    'A simple, community-driven way to discover the best LinkedIn banner creators. Curate, like, and surface top profiles fast.',
})
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-10 sm:py-12">
    <header class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight">About this project</h1>
      <p class="mt-3 text-muted-foreground">
        Showcase the best LinkedIn banner creators and surface top profiles with community-driven likes.
      </p>
    </header>

    <div class="space-y-8">
      <section>
        <!-- <h2 class="text-lg font-medium">What it does</h2> -->
        <ul class="mt-3 list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Curates standout LinkedIn banner creators and profiles.</li>
          <li>Ranks profiles by community likes to highlight the best work.</li>
          <li>Keeps a clean, LinkedIn-inspired layout for quick scanning.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-medium">Why</h2>
        <p class="mt-3 text-muted-foreground">
          Finding great examples and the right creator takes time. This tool removes friction by putting quality
          front and center—so you can discover, evaluate, and reach out faster.
        </p>
      </section>

      <section>
        <h2 class="text-lg font-medium">What's next</h2>
        <ul class="mt-3 list-disc pl-5 space-y-1 text-muted-foreground">
          <li>Pagination and better browsing.</li>
          <li>Improved submissions and attribution.</li>
          <li>Richer profile details and filters.</li>
        </ul>
      </section>

      <section>
        <h2 class="text-lg font-medium">Ah, that's it</h2>
        <p class="mt-3 text-muted-foreground">
          I'm a frontend engineer shipping small, useful products. This is a scratch-my-own-itch project to make
          discovering great banner creators fast. Connect with me on
          <a
            href="https://www.linkedin.com/in/alwaisy"
            target="_blank"
            rel="noopener noreferrer"
            class="underline underline-offset-4 hover:text-primary"
          >LinkedIn</a>.
        </p>
      </section>
    </div>
  </section>
</template>