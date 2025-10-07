import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // ✅ ปรับให้ warning (หรือปิดเลยก็ได้)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // ✅ แก้ rule no-explicit-any (2 แบบเลือกได้)
      // ❗ แบบแนะนำ (เปลี่ยนจาก error → warning)
      "@typescript-eslint/no-explicit-any": "warn",

      // ❌ ถ้าอยากปิดไปเลย ใช้บรรทัดนี้แทน:
      // "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
