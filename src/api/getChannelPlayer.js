import { collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { logPlayerToChannel } from './logPlayerToChannel'
import { db } from '../hooks/useFirebaseSdk'

export async function getChannelPlayers(channelId, userId, userInfo) {
	const collRef = collection(db, 'channelPlayers', channelId, 'players')
	const snap = await getDocs(collRef)
	const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

	if (!data.some((players) => players.id === userId)) {
		await logPlayerToChannel(channelId, userId, userInfo)
		return [...data, { id: userId, ...userInfo, playedAt: serverTimestamp() }]
	}

	return data
}
