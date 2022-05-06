import { ServiceImplementation, CallContext } from 'nice-grpc';
import {
  StarWarsServiceDefinition,
  GetPersonsListRequest,
  GetPersonsListResponse,
  DeepPartial,
} from '@internal/star-wars-gateway-api/dist/star-wars';
import axios from 'axios';
import { Type } from '@sinclair/typebox';
import { validate } from '@internal/schema-validator';
import { config } from './config';

const StarWarsApiPerson = Type.Object({
  name: Type.String(),
  height: Type.Number(),
  mass: Type.Number(),
});

const StarWarsApiPersonList = Type.Array(StarWarsApiPerson);

export const starWarsServiceImpl: ServiceImplementation<typeof StarWarsServiceDefinition> = {
  async getPersonsList(
    _request: GetPersonsListRequest,
    context: CallContext,
  ): Promise<DeepPartial<GetPersonsListResponse>> {
    const { data } = await axios.get(`${config.STAR_WARS_API_URL}/api/people`, {
      signal: context.signal,
    });

    const persons = data.results;
    validate(StarWarsApiPersonList, persons);

    return {
      persons,
    };
  },
};
