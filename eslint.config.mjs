// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here
  {
    ignores: ["./dev-docs/**"],
    rules: {
      "vue/require-default-prop": "off",
      "vue/html-self-closing": "off",
    },
  }
);
