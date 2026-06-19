import {
    type RouteConfig,
    route,
} from "@react-router/dev/routes";

export default [
    route("csr", "./routes/csr.tsx"), // client-side render
    route("ssr", "./routes/ssr.tsx"), // server-side render
] satisfies RouteConfig;