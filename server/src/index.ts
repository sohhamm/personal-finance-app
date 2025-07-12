import app from '@/app'
import {env} from '@/utils/env'
import {Logger} from '@/utils/logger'

const PORT = env.PORT || 3000

const startServer = async (): Promise<void> => {
  try {
    // Start the server
    app.listen(PORT, () => {
      Logger.info(`Server running on port ${PORT}`)
      Logger.info(`Environment: ${env.NODE_ENV}`)
      Logger.info(`Health check: http://localhost:${PORT}/health`)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      Logger.info('SIGTERM received, shutting down gracefully')
      process.exit(0)
    })

    process.on('SIGINT', () => {
      Logger.info('SIGINT received, shutting down gracefully')
      process.exit(0)
    })

    process.on('uncaughtException', error => {
      Logger.error('Uncaught Exception', {error: error.message, stack: error.stack})
      process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
      Logger.error('Unhandled Rejection', {reason, promise})
      process.exit(1)
    })
  } catch (error) {
    const err = error as any
    Logger.error('Failed to start server', {error: err.message})
    process.exit(1)
  }
}

startServer()
