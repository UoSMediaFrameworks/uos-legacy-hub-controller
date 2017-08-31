# uos-legacy-hub-controller
The first controller for legacy support of the media hub.  The media hub is designed to be an internal component and clients should communicate through controllers.

## Environment and running

Follow precedence of MF, .sh environment files can be used to export environment properties

Command to start the application

```./dev-env.sh node app.js```

## Testing and running



Take note of the integration-tests, they require configuration.

test/integration-tests/config/testing-config.js should be written with accepted configuration for a local testing environment.

Command to run all the tests

```mocha --recursive test```

## Using as a lib