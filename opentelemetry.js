/* eslint-disable @typescript-eslint/no-var-requires */
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const { AlwaysOnSampler } = require('@opentelemetry/core');

const sdk = new opentelemetry.NodeSDK({
  sampler: new AlwaysOnSampler(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
