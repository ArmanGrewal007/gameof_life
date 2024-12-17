1. `npm create vite@latest . -- --template react-ts`
1. `npm install -D tailwindcss postcss autoprefixer`
1. `npx tailwindcss init -p`
1. Populate **tailwind.config.js** with this -

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

4. In **Index.css**, add this on top -

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Install prettier and husky `npm install -D husky prettier`
6. Create a **.prettierignore\***, and a **.prettierrc.config.js**, and this to the latter

```js
export default {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};
```
8. `husky init`
9. In the **.husky/pre-commit** Add these lines :

```
npm run format
npm run build
```

10. Install gh-pages plugin `npm install -D vite-plugin-gh-pages`
11. Change **vite.config.ts** with this (MAKE SURE TO CHANGE THE REPO NAME) -

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ghPages } from "vite-plugin-gh-pages";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), ghPages()],
    base: mode == "production" ? "/repo_name/" : "/",
  };
});
```

12. Add this to the **package.json** 
```js
  "scripts": {
    "dev": "vite --host=0.0.0.0",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier . --write",
    "prepare": "husky",
    "deploy": "vite build && vite-gh-pages"
  },
```
