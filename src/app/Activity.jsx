import { useEffect, useState, useRef } from 'react'
import { storage } from '../hooks/useFirebaseSdk'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import NavBar from '../components/NavBar'
import styled from 'styled-components'
import gachaDestinyData from '../util/gachaDestinyData.json'
import PlayerGame from '../components/PlayerGame'
import GameUI from '../components/GameUI'
import { onSnapshot, collection, getDoc } from 'firebase/firestore'
import { db } from '../hooks/useFirebaseSdk'

import { getChannelPlayers } from '../api/getChannelPlayer'
import { logPlayerToChannel } from '../api/logPlayerToChannel'
import { getUserResult } from '../api/getUserResult'
import { createGameLogic } from '../util/gameLogic'
import { logUserResult } from '../api/logUserResult'

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: var(--sait) var(--sair) var(--saib) var(--sail);
	overflow: hidden;
	background: white;

	@media (min-width: 720px) {
		height: -webkit-fill-available;
		max-width: 1280px;
		margin: 0 auto;
		aspect-ratio: 16 / 9;
		height: 100vh;
	}
`

export const Activity = () => {
	const [currentGuessInput, setCurrentGuessInput] = useState('')
	const [songDuration, setSongDuration] = useState(1)
	const [songProgress, setSongProgress] = useState(0)
	const [songGuesses, setSongGuesses] = useState(Array(6).fill(null))
	const [filteredSuggestions, setFilteredSuggestions] = useState([])
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [isPlaying, setIsPlaying] = useState(false)
	const [isGameOver, setIsGameOver] = useState(false)
	const [audioObj, setAudioObj] = useState(null)
	const [channelName, setChannelName] = useState()
	const [channelPlayers, setChannelPlayers] = useState([])
	const [avatarSrc, setAvatarSrc] = useState('')
	const [username, setUsername] = useState('')
	const [userComplete, setUserComplete] = useState('')
	const [song, setSong] = useState(() => {
		const songIndex = Math.floor(Math.random() * gachaDestinyData.length)
		return gachaDestinyData[songIndex]
	})
	const [loading, setLoading] = useState(true)
	const [audioReady, setAudioReady] = useState(false)
	const [userDataReady, setUserDataReady] = useState(false)

	const timeoutRef = useRef(null)

	const { authenticated, discordSdk, status, session } = useDiscordSdk()

	// Fetch and prepare the audio for the current song
	useEffect(() => {
		setAudioReady(false)
		const fetchAudio = async () => {
			try {
				const clipUrl = await getDownloadURL(ref(storage, `audio-clips/${song.id}.mp3`))
				const discordProxyURL = clipUrl.replace('https://firebasestorage.googleapis.com', '/firebase')
				const audio = new Audio(discordProxyURL)
				setAudioObj(audio)
				audio.load()
			} catch (e) {
				console.error('Failed to load audio:', e)
			}
		}
		fetchAudio()
	}, [song])

	// Wire up playback progress & ready events on the Audio object
	useEffect(() => {
		if (!audioObj) return

		const onTime = () => {
			setSongProgress(audioObj.currentTime)

			// Stop at snippet length or end of full file if game over
			if (audioObj.currentTime >= songDuration && !isGameOver) {
				audioObj.pause()
				setIsPlaying(false)
				setSongProgress(songDuration)
			} else if (isGameOver && audioObj.currentTime >= audioObj.duration) {
				audioObj.pause()
				setIsPlaying(false)
			}
		}

		const onReady = () => {
			setAudioReady(true)
		}

		audioObj.addEventListener('timeupdate', onTime)
		audioObj.addEventListener('canplaythrough', onReady)

		return () => {
			audioObj.removeEventListener('timeupdate', onTime)
			audioObj.removeEventListener('canplaythrough', onReady)
		}
	}, [audioObj, status, songDuration, isGameOver])

	// When the session/status is ready, fetch Discord user info & game state
	useEffect(() => {
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})

		const fetchData = async () => {
			const user = session?.user
			if (user) {
				// Set avatar URL (custom or default)
				if (user.avatar) {
					setAvatarSrc(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`)
				} else {
					const defaultAvatarIndex = (BigInt(user.id) >> 22n) % 6n
					setAvatarSrc(`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`)
				}
				setUsername(user.global_name ?? `${user.username}#${user.discriminator}`)
			}

			// Pull this user’s previous game result
			const userData = await getUserResult(user.id)
			if (userData) {
				setIsGameOver(userData.completed)
				setSongGuesses(userData.guesses)
			}

			setChannelPlayers(
				await getChannelPlayers(discordSdk.channelId, user.id, {
					avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`,
					discriminator: user.discriminator,
					username: user.username
				})
			)

			setUserDataReady(true)
		}

		fetchData()
	}, [status])

	useEffect(() => {
		if (!authenticated || !discordSdk.channelId) return
		setChannelPlayers([])
		const unsubscribe = onSnapshot(collection(db, 'channelPlayers', discordSdk.channelId, 'players'), (snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const docSnap = change.doc
				const base = docSnap.data()
				getDoc(base.resultRef).then((resultSnap) => {
					const newEntry = { id: docSnap.id, ...base, ...resultSnap.data() }

					if (change.type === 'added') {
						setChannelPlayers((prev) => [...prev, newEntry])
					} else if (change.type === 'modified') {
						setChannelPlayers((prev) => prev.map((p) => (p.id === newEntry.id ? newEntry : p)))
					}
				})
			})
		})

		return () => unsubscribe()
	}, [authenticated, discordSdk.channelId])

	// Turn off the loading spinner once everything critical is ready
	useEffect(() => {
		if (audioReady && status === 'ready' && userDataReady) {
			setLoading(false)
		}
	}, [audioReady, status, userDataReady])

	// Watch the guesses array to detect game completion & persist progress
	useEffect(() => {
		if (status !== 'ready' || !userDataReady) return
		if (isGameOver) return

		const finished = songGuesses.every((g) => g !== null)
		const correct = songGuesses.some((g) => g?.suggestion === song?.suggestion)
		const completed = finished || correct

		if (completed) setIsGameOver(true)
		logUserResult(session?.user.id, { completed, guesses: songGuesses })
	}, [songGuesses, status, userDataReady])

	const { handleAudio, handleGuesses, handleSearchChange, handleSubmit } = createGameLogic({
		audioObj,
		timeoutRef,
		isPlaying,
		setIsPlaying,
		setSongProgress,
		currentGuessInput,
		setCurrentGuessInput,
		setFilteredSuggestions,
		setShowSuggestions,
		songGuesses,
		setSongGuesses,
		songDuration,
		setSongDuration
	})

	return (
		<AppContainer>
			{loading ? (
				<h1> Loading... </h1>
			) : (
				<>
					<NavBar />
					<GameUI
						timeoutRef={timeoutRef}
						audioObj={audioObj}
						songGuesses={songGuesses}
						songProgress={songProgress}
						setSongProgress={setSongProgress}
						songDuration={songDuration}
						handleAudio={handleAudio}
						handleSearchChange={handleSearchChange}
						handleGuesses={handleGuesses}
						setFilteredSuggestions={setFilteredSuggestions}
						setIsPlaying={setIsPlaying}
						song={song}
						currentGuessInput={currentGuessInput}
						handleSubmit={handleSubmit}
						filteredSuggestions={filteredSuggestions}
						showSuggestions={showSuggestions}
						setShowSuggestions={setShowSuggestions}
						setCurrentGuessInput={setCurrentGuessInput}
						isPlaying={isPlaying}
						isGameOver={isGameOver}
						channelPlayers={channelPlayers}
					/>
				</>
			)}
		</AppContainer>
	)
}
