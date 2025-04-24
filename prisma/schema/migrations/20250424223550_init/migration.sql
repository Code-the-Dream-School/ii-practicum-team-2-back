-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('string', 'integer', 'boolean', 'dropdown');

-- CreateEnum
CREATE TYPE "Frequency" AS ENUM ('Daily', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays');

-- CreateTable
CREATE TABLE "daily_quest"
(
    "id"            UUID         NOT NULL,
    "user_id"       UUID         NOT NULL,
    "goal_id"       UUID,
    "suggestion_id" UUID,
    "title"         TEXT         NOT NULL,
    "icon"          TEXT         NOT NULL,
    "frequency"     "Frequency"[],
    "created_at"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_quest_completion"
(
    "id"             UUID         NOT NULL,
    "daily_quest_id" UUID         NOT NULL,
    "user_id"        UUID         NOT NULL,
    "date"           DATE         NOT NULL,
    "completed_at"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_quest_completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_quest_suggestion"
(
    "id"         UUID         NOT NULL,
    "title"      TEXT         NOT NULL,
    "icon"       TEXT         NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_quest_suggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_progress"
(
    "id"                 UUID         NOT NULL,
    "goal_id"            UUID         NOT NULL,
    "goal_type_field_id" UUID         NOT NULL,
    "user_id"            UUID         NOT NULL,
    "progress_value"     INTEGER      NOT NULL,
    "created_at"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_type"
(
    "id"          UUID NOT NULL,
    "name"        TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "goal_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_type_field"
(
    "id"           UUID        NOT NULL,
    "goal_type_id" UUID        NOT NULL,
    "field_name"   TEXT        NOT NULL,
    "field_type"   "FieldType" NOT NULL,
    "required"     BOOLEAN     NOT NULL,
    "options"      JSONB,
    "trackable"    BOOLEAN     NOT NULL,

    CONSTRAINT "goal_type_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal"
(
    "id"           UUID         NOT NULL,
    "name"         TEXT         NOT NULL,
    "description"  TEXT         NOT NULL,
    "user_id"      UUID         NOT NULL,
    "goal_type_id" UUID         NOT NULL,
    "created_at"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_field_value"
(
    "id"                 UUID NOT NULL,
    "goal_type_field_id" UUID NOT NULL,
    "goal_id"            UUID NOT NULL,
    "user_id"            UUID NOT NULL,
    "value"              TEXT NOT NULL,

    CONSTRAINT "goal_field_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "goal_board_images"
(
    "id"             UUID         NOT NULL,
    "user_id"        UUID         NOT NULL,
    "file_path"      TEXT         NOT NULL,
    "thumbnail_path" TEXT         NOT NULL,
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_board_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"
(
    "id"         UUID         NOT NULL,
    "name"       TEXT         NOT NULL,
    "email"      TEXT         NOT NULL,
    "password"   TEXT         NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_auth_provider"
(
    "id"               UUID         NOT NULL,
    "user_id"          UUID         NOT NULL,
    "provider"         TEXT         NOT NULL,
    "provider_user_id" UUID         NOT NULL,
    "created_at"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_auth_provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_reset_token"
(
    "id"         UUID         NOT NULL,
    "user_id"    UUID         NOT NULL,
    "token"      TEXT         NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used"       BOOLEAN      NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token"
(
    "id"         UUID         NOT NULL,
    "user_id"    UUID         NOT NULL,
    "token"      TEXT         NOT NULL,
    "revoked"    BOOLEAN      NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_quest_user_id_title_key" ON "daily_quest" ("user_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "daily_quest_completion_daily_quest_id_user_id_date_key" ON "daily_quest_completion" ("daily_quest_id", "user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_quest_suggestion_title_icon_key" ON "daily_quest_suggestion" ("title", "icon");

-- CreateIndex
CREATE UNIQUE INDEX "goal_type_name_key" ON "goal_type" ("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user" ("email");

-- CreateIndex
CREATE INDEX "user_auth_provider_provider_provider_user_id_idx" ON "user_auth_provider" ("provider", "provider_user_id");

-- CreateIndex
CREATE INDEX "password_reset_token_user_id_idx" ON "password_reset_token" ("user_id");

-- CreateIndex
CREATE INDEX "password_reset_token_token_idx" ON "password_reset_token" ("token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token" ("token");

-- CreateIndex
CREATE INDEX "refresh_token_user_id_idx" ON "refresh_token" ("user_id");

-- AddForeignKey
ALTER TABLE "daily_quest"
    ADD CONSTRAINT "daily_quest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quest"
    ADD CONSTRAINT "daily_quest_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goal" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quest"
    ADD CONSTRAINT "daily_quest_suggestion_id_fkey" FOREIGN KEY ("suggestion_id") REFERENCES "daily_quest_suggestion" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quest_completion"
    ADD CONSTRAINT "daily_quest_completion_daily_quest_id_fkey" FOREIGN KEY ("daily_quest_id") REFERENCES "daily_quest" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_quest_completion"
    ADD CONSTRAINT "daily_quest_completion_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_progress"
    ADD CONSTRAINT "goal_progress_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_progress"
    ADD CONSTRAINT "goal_progress_goal_type_field_id_fkey" FOREIGN KEY ("goal_type_field_id") REFERENCES "goal_type_field" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_progress"
    ADD CONSTRAINT "goal_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_type_field"
    ADD CONSTRAINT "goal_type_field_goal_type_id_fkey" FOREIGN KEY ("goal_type_id") REFERENCES "goal_type" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal"
    ADD CONSTRAINT "goal_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal"
    ADD CONSTRAINT "goal_goal_type_id_fkey" FOREIGN KEY ("goal_type_id") REFERENCES "goal_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_field_value"
    ADD CONSTRAINT "goal_field_value_goal_type_field_id_fkey" FOREIGN KEY ("goal_type_field_id") REFERENCES "goal_type_field" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_field_value"
    ADD CONSTRAINT "goal_field_value_goal_id_fkey" FOREIGN KEY ("goal_id") REFERENCES "goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_field_value"
    ADD CONSTRAINT "goal_field_value_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_board_images"
    ADD CONSTRAINT "goal_board_images_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_auth_provider"
    ADD CONSTRAINT "user_auth_provider_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_reset_token"
    ADD CONSTRAINT "password_reset_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token"
    ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
