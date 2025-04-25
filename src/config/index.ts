import rateLimiter from "@/config/rateLimiter";
import xss from "@/config/xss";
import db from "@/config/db";
import {
  consoleOptions as loggerConsoleOptions,
  options as loggerOptions,
} from "@/config/logger";

export default {
  rateLimiter,
  xss,
  db,
  loggerOptions,
  loggerConsoleOptions,
};
