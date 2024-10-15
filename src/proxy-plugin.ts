import { Plugin } from 'vite';
import { getDynappConfig } from './util.js';
import { DynappConfig } from './interface.js';

// Function to get the dynamic proxy target
function getProxyTarget(config : DynappConfig): string {
  // Extract the necessary values
  const group = config.group;
  const app = config.app;
  const rungroup = config.rungroup;
  const runapp = config.runapp;

  // Construct the target URL based on the JSON values

  const targetUrl = rungroup && runapp
  ? `/dynapp-server/public/${rungroup}/${runapp}`
  : `/dynapp-server/public/${group}/${app}`;

  console.log('Proxy Target URL:', targetUrl);

  return targetUrl;
}

export function DynappProxy(): Plugin {
  const dynappConfig = getDynappConfig();

  return {
    name: 'dynamic-proxy-plugin',
    config(config, { command }) {
      // Check if we are in serve mode
      if (command === 'serve') {
        const targetUrl = getProxyTarget(dynappConfig);
        // Update Vite config
        config.server = config.server || {};
        config.server.proxy = config.server.proxy || {};

        config.server.proxy['/dynapp-server'] = {
          target: dynappConfig.baseUrl || 'https://dynappbeta.wip.se',
          changeOrigin: true,
          rewrite: (path: string) => {
            return path.replace(/^\/dynapp-server/, targetUrl);
          }
        };
      }
    }
  };
}
