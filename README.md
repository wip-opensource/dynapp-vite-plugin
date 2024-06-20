### Installation

To install the plugin, use the following command:

```sh
pnpm install git+https://github.com/wip-opensource/dynapp-vite-plugin.git
```

### Update package.json

Add the following scripts to your package.json file:

```json
"scripts": {
  "d-publish": "dynapp-publish",
  "build": "vue-tsc --noEmit && vite build && dynapp-publish"
}
```

* "d-publish": "dynapp-publish" allows you to publish your app.
* "build": "vue-tsc --noEmit && vite build && dynapp-publish" allows you to build and publish at the same time.