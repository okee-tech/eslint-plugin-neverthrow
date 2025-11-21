import node from "./configs/node";
import nuxt from "./configs/nuxt";
import expo from "./configs/expo";
import plugin from "./plugin";

export = { ...plugin, configs: { node, nuxt, expo } };
