import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function logPlayerToChannel(channelId, userId, userInfo) {
	const ref = doc(db, 'channelPlayers', channelId, 'players', userId)
	const snapshot = await getDoc(ref)

	if (!snapshot.exists()) {
		const resultRef = doc(db, 'userResults', userId)
		await setDoc(ref, {
			...userInfo,
			resultRef,
			joinedAt: serverTimestamp()
		})
	}
}
