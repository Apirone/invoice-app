
# Invoice App

[Apirone](https://apirone.com) invoices is a white label solution that can be integrated in any kind of projects.
 
![Apirone Invoice example](https://apirone.com/static/invoice.png)

## Project setup

```bash
yarn
```

### Compiles and hot-reloads for development

```bash
yarn serve
```

### Compiles and minifies for production

```bash
yarn build
```

### Lints and fixes files

```bash
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Post configuration

You can change the default behavior of the application by configuring some settings even the application has already been built. Create a script that runs before the application starts and set `window.invoice_app_config` object.
For example, you can add the following to your html:

```html
<html>
    <head>
        ...
        <script>
            window.invoice_app_config = {
              service_url: 'https://apirone.com/api/v2/',
              wallets_ep: 'wallets',
              invoices_ep: 'invoices/%s',
              images_relative_path: 'img',
              invoice_id_key: 'id',
              embed: true,
              logo: true,
              qr_only: true,
              mount_point: '.my-mount-point-for-app',
            };
        </script>
        <script type="module" crossorigin defer src="./script.min.js"></script>
        <link rel="stylesheet" crossorigin href="./style.min.css">
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
```

- `service_url` Defines the URL prefix for requests to the Apirone API RESTful service. The fallback value can be seen in the example above.

- `wallets_ep` Defines the URL suffix endpoint for querying wallets in the Apirone API RESTful service. The fallback value can be seen in the example above.

- `invoices_ep` Defines a URL suffix endpoint for requesting invoice information from the Apirone API RESTful service. Use the `%s` placeholder for the invoice ID. The fallback value can be seen in the example above. For example, you could define it as `invoices&id=%s`, and for the default service URL and the invoice ID `ABC123`, the full URL would be: `https://apirone.com/api/v2/invoices&id=ABC123`

- `images_relative_path` Specifies the relative path to images used by the application, `img` by default.

- `invoice_id_key` Overrides the invoice id query parameter key if `id` (the default) is already used for other purposes in the target system.

- `embed` The Embed parameter set to `true` disables the linkback handler and disables the display of the Apirone logo, `false` by default.

- `logo` The `true` value always displays the Apirone logo. You can also specify a custom logo as a string of HTML code. The `false` value disables the logo entirely. If this value is not specified, the logo is displayed according to the `embed` parameter.

- `qr_only` The value can be used if you want to see only a QR code on app page `false` by default.

- `mount_point` The value of CSS selector that can be used if you want to mount the application into an HTML element with a selector other than `#app`. The default is `#app`.

All of these settings are not required.

So, you can embed the application to any environment.

## To run built app in docker container

### Build

docker build -t invoice-app ./

### Run

docker run -it -p 80:80 -d invoice-app
