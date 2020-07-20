module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["plugin:@typescript-eslint/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    project: "./tsconfig.json",
  },

  rules: {
    "brace-style": "off",
    "@typescript-eslint/brace-style": ["warn", "allman"],
    "indent": "off",
    "@typescript-eslint/indent": ["warn", "tab"],
    "no-trailing-spaces": "warn",
    "space-before-function-paren": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/member-delimiter-style": ["warn", {
      "multiline": {
        "delimiter": "none",
        "requireLast": false,
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": true,
      },
      "overrides": {
        "interface": {
          "multiline": {
            "delimiter": "none",
            "requireLast": true,
          },
        },
      },
    }],
    "@typescript-eslint/interface-name-prefix": ["warn", "always"],
    "linebreak-style": "off",
    "quotes": ["warn", "double"],
    "semi": ["warn", "never"],
  },
  overrides: [
    {
      // Rules for tests.
      files: ["Test/**/*.spec.ts"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
};
