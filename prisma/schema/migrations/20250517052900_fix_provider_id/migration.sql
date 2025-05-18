/*
  Warnings:

  - A unique constraint covering the columns `[provider_user_id]` on the table `user_auth_provider` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_auth_provider_provider_user_id_key" ON "user_auth_provider"("provider_user_id");
