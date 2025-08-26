// add to your plugins folder
export default defineNuxtPlugin({
  hooks: {
    "app:beforeMount": async function () {
      const query = useRoute().query;
      if ("bullshitt" in query) {
        const { bullshitt: _, ...otherParams } = query;
        navigateTo({ query: otherParams });
        window.localStorage.setItem("umami.disabled", "1");
        window.console.info(`Debug mode enabled.`);
        // now when visiting your live site for the first time
        // go to example.com?bullshitt
      }
    },
  },
});
