import { collection, getDocs } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function getChannelPlayers(channelId) {
	const ref = collection(db, 'channelPlayers', channelId, 'players')
	const snapshot = await getDocs(ref)
	return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
