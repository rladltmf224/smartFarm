module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
    "@vue/typescript",
    "prettier",
  ],

  parserOptions: {
    parser: "@typescript-eslint/parser",
  },

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "import/prefer-default-export": "off",
    "import/extensions": ["off"],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "vue/multi-word-component-names": [
      "error",
      {
        ignores: [
          "Login",
          "Home",
          "Layout",
          "Sidebar",
          "Membermng",
          "Monitoring",
        ],
      },
    ],
  },
};
