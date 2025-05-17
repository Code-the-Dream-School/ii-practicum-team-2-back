-- DropIndex
DROP INDEX "user_auth_provider_provider_user_id_key";

-- AlterTable
ALTER TABLE "user_auth_provider" ALTER COLUMN "provider_user_id" SET DATA TYPE TEXT;
