import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function logUserResult(userId, updateFields) {
	const ref = doc(db, 'userResults', userId)
	await updateDoc(ref, {
		...updateFields,
		lastPlayedAt: serverTimestamp()
	})
}
