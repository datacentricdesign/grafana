# stage 1 as builder
FROM node:12.5-alpine as builder

# copy the package.json to install dependencies
COPY package.json yarn.lock ./

# Install the dependencies and make the folder
RUN yarn install && mkdir /dcd-datasource && mv ./node_modules ./dcd-datasource

WORKDIR /dcd-datasource

COPY . .

# Build the project and copy the files
RUN yarn run build

FROM grafana/grafana:7.1.1

# Copy from the stage 1
COPY --from=builder /dcd-datasource/dist /var/lib/grafana/plugins/dcd-datasource

ENTRYPOINT ["/run.sh"]