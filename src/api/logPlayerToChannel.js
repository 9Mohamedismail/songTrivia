import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function logPlayerToChannel(channelId, userId, userInfo) {
	const ref = doc(db, 'channelPlayers', channelId, 'players', userId)
	const snapshot = await getDoc(ref)

	if (!snapshot.exists()) {
		await setDoc(ref, {
			...userInfo,
			playedAt: Date.now()
		})
	}
}
