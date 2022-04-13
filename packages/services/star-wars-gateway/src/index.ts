import { createServer } from '@internal/grpc-server';
import { StarWarsServiceDefinition } from '@internal/star-wars-gateway-api/dist/star-wars';
import { starWarsServiceImpl } from './star-wars-service';

const { PORT = '8080' } = process.env;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const server = createServer({
    definition: StarWarsServiceDefinition,
    binPath: require.resolve('@internal/star-wars-gateway-api/dist/star-wars.proto.bin'),
    implementation: starWarsServiceImpl,
  });

  await server.listen(`0.0.0.0:${PORT}`);
  console.log(`listening ${PORT}`);
}
