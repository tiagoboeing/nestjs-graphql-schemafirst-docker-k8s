// eslint-disable-next-line @typescript-eslint/no-var-requires
const { loadTest } = require('loadtest');

const body = JSON.stringify({
  query:
    'mutation {\r\n  createIntegration(createIntegrationInput: {exampleField: 1}){\r\n    std\r\n    sat\r\n    status\r\n    __typename\r\n  }\r\n}',
  variables: {},
});

loadTest(
  {
    url: 'http://localhost:3000/graphql',
    contentType: 'application/json',
    maxRequests: 100,
    body,
    concurrency: 20,
    requestsPerSecond: 30,
    method: 'POST',
    statusCallback: (error, result, latency) => {
      // console.log(
      //   'Current latency %j, result %j, error %j',
      //   latency,
      //   result,
      //   error,
      // );

      console.log('Currents latency %j', latency);

      console.log('----');
      console.log('Request elapsed milliseconds: ', result.requestElapsed);
      console.log('Request index: ', result.requestIndex);
      console.log('Request loadtest() instance index: ', result.instanceIndex);
    },
  },
  function (error, result) {
    if (error) {
      return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully');
    console.dir(result);
  },
);
