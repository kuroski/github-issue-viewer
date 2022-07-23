async function initMocks() {
  if (typeof window === 'undefined') {
    const { server } = await import('./server')
    console.log('------------ SERVER')

    server.listen({ onUnhandledRequest: 'error' })
  } else {
    const { worker } = await import('./browser')
    worker.start({ onUnhandledRequest: 'error' })
  }
}

export default initMocks()
