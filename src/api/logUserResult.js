import { doc, setDoc } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function logUserResult(userId, guessesUsed, result) {
	const ref = doc(db, 'userResults', userId)
	await setDoc(ref, {
		guessesUsed: guessesUsed,
		completed: result,
		lastPlayedAt: Date.now()
	})
}
