import { patchUrlMappings } from '@discord/embedded-app-sdk'

patchUrlMappings([
	{ prefix: '/firebase', target: 'firebasestorage.googleapis.com' },
	{ prefix: '/firestore', target: 'firestore.googleapis.com' },
	{ prefix: '/gstatic', target: 'www.google.com' }
])
