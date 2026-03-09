import app from "./src/app"
import { initSocket } from "./src/utils/socket"

const PORT = process.env.PORT || 5001
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

// Start socket server
initSocket(server);