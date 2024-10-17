import { getDynappConfig } from './util.js';
// Function to get the dynamic proxy target
function getProxyTarget(config) {
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
export function DynappProxy() {
    const dynappConfig = getDynappConfig();
    var dynappInfo = {
        host: '',
        app: '',
        group: '',
        devTool: 'vite'
    };
    if (dynappConfig) {
        let baseUrl = dynappConfig.baseUrl;
        if (baseUrl) {
            dynappInfo.host = (baseUrl.split('://')[1] || '').split('/')[0];
        }
        dynappInfo.group = dynappConfig.rungroup || dynappConfig.group || '';
        dynappInfo.app = dynappConfig.runapp || dynappConfig.app || '';
    }
    process.env = { ...process.env, ...{ VITE_DYNAPP_INFO: JSON.stringify(dynappInfo) } };
    return {
        name: 'dynapp-vite-plugin',
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
                    rewrite: (path) => {
                        return path.replace(/^\/dynapp-server/, targetUrl);
                    }
                };
            }
        }
    };
}
