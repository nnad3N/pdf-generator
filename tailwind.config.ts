import { type Config } from "tailwindcss";
import { type Config as DaisyUIConfig } from "daisyui";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: ["class", '[data-theme="dark"]'],
  plugins: [require("daisyui"), require("@headlessui/tailwindcss")],
  daisyui: {
    themes: ["light", "business"],
    darkTheme: "business",
  },
} satisfies Config & { daisyui: DaisyUIConfig };
