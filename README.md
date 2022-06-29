
# Invoice App

[Apirone](https://apirone.com) invoices is a white label solution that can be integrated in any kind of projects.
 
![Apirone Invoice example](https://apirone.com/static/invoice.png)

## Manual setup

### Customize configuration

You can change the base path in [.env](https://github.com/Apirone/invoice-app/blob/main/.env) if you need.

### Install dependencies

```

npm install

```

> :warning: **If you are using node version 16 or earlier**: Remove ```export SET NODE_OPTIONS=--openssl-legacy-provider; ``` from [package.json](https://github.com/Apirone/invoice-app/blob/main/package.json#L7)

  

### Compiles and hot-reloads for development

```

npm run serve

```


  

### Compiles and minifies for production

```

npm run build

```

## Docker setup

You can use our [Dockerfile](https://github.com/Apirone/invoice-app/blob/main/Dockerfile) to setup this application. For example:

```

docker build -t invoiceapp:latest .

```
