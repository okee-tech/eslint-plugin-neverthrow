import node from "./configs/node";
import nuxt from "./configs/nuxt";
import plugin from "./plugin";

export = { ...plugin, configs: { node, nuxt } };
