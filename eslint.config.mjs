import { defineConfig } from "eslint/config"
import raycastConfig from "@raycast/eslint-config"

const config = defineConfig([
    ...raycastConfig,
])

export default config