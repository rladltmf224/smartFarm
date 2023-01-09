<template>
  <div>자식입니당</div>
</template>

<script>
export default {
  name: "MESFEGraphTest",
  graph: {
    type: [Array, Object],
    default: null,
  },
  data() {
    return {};
  },

  mounted() {
    console.log("부모한테받은거", this.graph);
  },

  methods: {},
};
</script>

<style lang="scss" scoped></style>
