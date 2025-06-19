import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function getUserResult(userID) {
	const docRef = doc(db, 'userResults', userID)
	const snap = await getDoc(docRef)
	if (!snap.exists()) {
		const initialData = {
			guesses: Array(6).fill(null),
			completed: false,
			lastPlayedAt: serverTimestamp()
		}
		await setDoc(docRef, initialData)
		return initialData
	}

	return snap.data()
}
