import { collection, getDocs } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

export async function getUserResult(userID) {
	const ref = collection(db, 'userResults', userID)
	const snap = await getDocs(ref)
	if (snap.exists()) {
		return snap.data()
	} else {
		return null
	}
}
