/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
    remotePatterns: [{hostname: "utfs.io"}, {hostname: "2ryc0965uu.ufs.sh"}
      
    ],
  },
};

export default config;
