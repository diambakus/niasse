export const environment = {
    production: false,
    useKeycloak: false, // set to false only for development withou keycloak
    keycloak: {
      server: 'http://localhost:8080',
      clientId: 'Niasse',
      realm: 'kumpo'
    },
    //gatewayBaseUrl: `http://91.98.90.152`
    gatewayBaseUrl: `http://localhost:8094`
  };