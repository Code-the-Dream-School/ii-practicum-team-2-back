/**
 * @see https://www.prisma.io/docs/orm/reference/error-reference#prisma-client-query-engine
 */
const UNIQUE_CONSTRAINT_FAILED_CODE = "P2002";
const FOREIGN_KEY_CONSTRAINT_FAILED_CODE = "P2003";
const INCONSISTENT_COLUMN_DATA = "P2023";
const NOT_FOUND_CODE = "P2025";

const prismaErrorCodes = {
  UNIQUE_CONSTRAINT_FAILED_CODE,
  FOREIGN_KEY_CONSTRAINT_FAILED_CODE,
  INCONSISTENT_COLUMN_DATA,
  NOT_FOUND_CODE,
};

export default prismaErrorCodes;
