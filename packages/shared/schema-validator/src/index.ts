import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { Static, TSchema } from '@sinclair/typebox';
import AggregateError from 'aggregate-error';

const ajv = addFormats(
  new Ajv({
    allErrors: true,
    removeAdditional: true,
    coerceTypes: true,
  }),
  [
    'date-time',
    'time',
    'date',
    'email',
    'hostname',
    'ipv4',
    'ipv6',
    'uri',
    'uri-reference',
    'uuid',
    'uri-template',
    'json-pointer',
    'relative-json-pointer',
    'regex',
  ],
)
  .addKeyword('kind')
  .addKeyword('modifier');

export function validate<T extends TSchema>(schema: T, data: any): data is Static<T> {
  const ok = ajv.validate(schema, data);

  if (!ok) {
    throw new AggregateError(ajv.errors);
  }

  return true;
}
