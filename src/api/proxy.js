export default async (request) => {
	const url = request.query.url

	if (!url) {
		return new Response('Missing URL', { status: 400 })
	}

	try {
		const proxied = await fetch(url)

		// Forward headers (especially content-type for audio)
		const headers = new Headers()
		proxied.headers.forEach((value, key) => {
			headers.set(key, value)
		})

		return new Response(proxied.body, {
			status: proxied.status,
			headers
		})
	} catch (err) {
		return new Response('Proxy error: ' + err.message, { status: 500 })
	}
}
