import { ServiceImplementation } from 'nice-grpc';
import {
  CatsServiceDefinition,
  GetCatsListRequest,
  GetCatsListResponse,
  DeepPartial,
} from '@internal/cats-api/dist/cats';

export const catsServiceImpl: ServiceImplementation<typeof CatsServiceDefinition> = {
  async getCatsList(_request: GetCatsListRequest): Promise<DeepPartial<GetCatsListResponse>> {
    return {
      cats: [{ name: 'cat1' }, { name: 'cat2' }],
    };
  },
};
