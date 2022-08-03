import { setupServer } from "msw/lib/node"

import handlers from "@/e2e/mocks/handlers"

function bootstrap() {
  return setupServer(...handlers)
}

export default bootstrap
