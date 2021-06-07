# Grafana Plugins for the Data-Centric Design Lab


## Data Source

Plugins connecting Bucket to Grafana

### Development

Enter folder grafana-source.

1. Install dependencies
```BASH
yarn install
```
2. Build plugin in development mode or run in watch mode
```BASH
yarn dev
```
or
```BASH
yarn watch
```

Back in the root folder:

3. Copy development.env into .env and adjust as you want

4. run the 'development' compose file, directly taking the dist folder from your plugin (instead of building them)

```BASH
docker-compose  -f docker-compose-dev.yml up -V
```


## Deployment

On your local machine, you can check for each plugin whether the build goes smoothly
```BASH
yarn build
```

Your deployment machine, copy development.env into .env and adjust for your deployment settings.

Build and run with docker-compose

```BASH
docker-compose up -d
```
