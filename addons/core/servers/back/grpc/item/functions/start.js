import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

import onetype from '#framework/load.js';
import serversGRPC from '#servers/grpc/addon.js';

serversGRPC.Fn('item.start', async function(item)
{
    if(item.Get('instance'))
    {
        return;
    }

    try
    {
        const grpcModule = await import('@grpc/grpc-js');
        const protoLoaderModule = await import('@grpc/proto-loader');

        const grpc = grpcModule.default || grpcModule;
        const protoLoader = protoLoaderModule.default || protoLoaderModule;

        const protoPath = join(dirname(fileURLToPath(import.meta.url)), '/../../service.proto');
        
        const definition = protoLoader.loadSync(protoPath, 
        {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true
        });

        const universalPackage = grpc.loadPackageDefinition(definition).universal;
        
        const server = new grpc.Server({
            'grpc.max_send_message_length': 1024 * 1024 * 100,
            'grpc.max_receive_message_length': 1024 * 1024 * 100
        });
        
        server.addService(universalPackage.UniversalService.service, 
        {
            stream: (...data) => item.Fn('stream', ...data)
        });
        
        let credentials = grpc.ServerCredentials.createInsecure();

        if(item.Get('secure'))
        {
            const cert = item.Get('cert') || {};

            credentials = grpc.ServerCredentials.createSsl(cert.ca || null, [{
                private_key: cert.key,
                cert_chain: cert.cert
            }], cert.checkClientCertificate || false);
        }

        server.bindAsync(`${item.Get('host')}:${item.Get('port')}`, credentials, (error) =>
        {
            if(error) 
            {
                item.Get('onError') && item.Get('onError').call(item, error.message);
                return;
            }
            
            item.Set('instance', server);
            item.Get('onStart') && item.Get('onStart').call(item, server);
            
            onetype.Emit('@servers.grpc.start', server);
        });
    }
    catch(error)
    {
        item.Get('onError') && item.Get('onError').call(item, error.message);
    }
});