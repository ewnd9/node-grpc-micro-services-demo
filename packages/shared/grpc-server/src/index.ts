import { createServer as createGrpcServer } from 'nice-grpc';
import { ServerReflectionService, ServerReflection } from 'nice-grpc-server-reflection';
import fs from 'fs';

export function createServer({
  definition,
  implementation,
  binPath,
}: {
  definition: any;
  implementation: any;
  binPath: string;
}) {
  const server = createGrpcServer();
  server.add(definition, implementation);
  server.add(ServerReflectionService, ServerReflection(fs.readFileSync(binPath), [definition.fullName]));

  return server;
}
