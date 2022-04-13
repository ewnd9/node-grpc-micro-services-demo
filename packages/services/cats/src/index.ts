import { createServer } from '@internal/grpc-server';
import { CatsServiceDefinition } from '@internal/cats-api/dist/cats';
import { catsServiceImpl } from './cats-service';

const { PORT = '8080' } = process.env;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main() {
  const server = createServer({
    definition: CatsServiceDefinition,
    binPath: require.resolve('@internal/cats-api/dist/cats.proto.bin'),
    implementation: catsServiceImpl,
  });

  await server.listen(`0.0.0.0:${PORT}`);
  console.log(`listening ${PORT}`);
}
