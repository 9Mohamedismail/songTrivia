import { doc, collection, getDoc, getDocs } from 'firebase/firestore'
import { logPlayerToChannel } from './logPlayerToChannel'
import { db } from '../hooks/useFirebaseSdk'

export async function getChannelPlayers(channelId, userId, userInfo) {
	const collRef = collection(db, 'channelPlayers', channelId, 'players')
	const snap = await getDocs(collRef)
	const data = await Promise.all(
		snap.docs.map(async (docSnap) => {
			const base = docSnap.data()
			const resultSnap = await getDoc(base.resultRef)
			return {
				id: docSnap.id,
				...base,
				...resultSnap.data()
			}
		})
	)

	if (!data.some((players) => players.id === userId)) {
		await logPlayerToChannel(channelId, userId, userInfo)
		const newRef = doc(db, 'channelPlayers', channelId, 'players', userId)
		const newSnap = await getDoc(newRef)
		const base = newSnap.data()
		const resultSnap = await getDoc(base.resultRef)
		data.push({
			id: newSnap.id,
			...base,
			...resultSnap.data()
		})
	}
	return data
}
