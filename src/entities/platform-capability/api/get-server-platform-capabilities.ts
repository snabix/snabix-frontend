import "server-only";

import { platformCapabilitiesSchema } from "@/src/entities/platform-capability/model/schema";
import { serverGetData } from "@/src/shared/api/server-request";

export function getServerPlatformCapabilities() {
  return serverGetData(platformCapabilitiesSchema, "/capabilities", {
    errorMessage: "Не удалось проверить доступные возможности платформы.",
    revalidate: 300,
    tags: ["platform-capabilities"],
  });
}
