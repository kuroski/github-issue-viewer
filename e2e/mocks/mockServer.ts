import { setupServer } from "msw/lib/node"

import handlers from "@/e2e/mocks/handlers"

const mockServer = setupServer(...handlers)
export default mockServer
