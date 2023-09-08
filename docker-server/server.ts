import { OAuth2Server } from '../dist/index';


async function startServer() {
    const server = new OAuth2Server();


    const jwk = await server.issuer.keys.generate('RS256');
    console.log(`Generated new RSA key with kid "${jwk.kid}"`);

    await server.start(56817, '0.0.0.0');

    const addr = server.address();
    const hostname = addr.family === 'IPv6' ? `[${addr.address}]` : addr.address;

    console.log(`OAuth 2 server listening on http://${hostname}:${addr.port}`);

    console.log(`OAuth 2 issuer is ${server.issuer.url}`);

    process.once('SIGINT', () => {
        console.log('OAuth 2 server is stopping...');

        const handler = async () => {
            await server.stop();
        };

        handler().catch((e) => {
            throw e;
        });

        console.log('OAuth 2 server has been stopped.');
    });

    return server;
}


startServer();
