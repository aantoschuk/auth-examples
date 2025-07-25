import { defineConfig } from "drizzle-kit";

import configuration from "src/config/configuration";

export default defineConfig(
    {
        out: "./drizzle",
        schema: "./src/db/schema/schema.ts",
        dialect: "postgresql",
        dbCredentials: {
            url: configuration().database.url
        }
    }
)
