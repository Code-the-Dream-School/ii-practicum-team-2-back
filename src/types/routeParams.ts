import { z } from "zod";

export const RouteParamsRawSchema = z.object({
  id: z.string().uuid(),
});

type RouteParams = {
  id: string;
};

export default RouteParams;
