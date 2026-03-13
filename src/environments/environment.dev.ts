export const environment = {
    production: false,
    useKeycloak: true, // set to false only for development withou keycloak
    keycloak: {
      server: 'http://keycloak.orakuma.de',
      clientId: 'niasse',
      realm: 'kumpo'
    },
    //gatewayBaseUrl: `http://stoa-kumpo.orakuma.de`
    gatewayBaseUrl: `http://localhost:8094`
  };