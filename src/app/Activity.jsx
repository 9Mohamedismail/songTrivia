import { useEffect, useState, useRef } from 'react'
import { storage } from '../hooks/useFirebaseSdk'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import NavBar from '../components/NavBar'
import styled from 'styled-components'
import gachaDestinyData from '../util/gachaDestinyData.json'
import GameEnd from '../components/GameEnd'
import GameUI from '../components/GameUI'

import { getChannelPlayers } from '../api/getChannelPlayer'
import { logPlayerToChannel } from '../api/logPlayerToChannel'
import { getUserResult } from '../api/getUserResult'
import { createGameLogic } from '../util/gameLogic'
import { logUserResult } from '../api/logUserResult'

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: -webkit-fill-available;
	width: 100%;
	padding-left: var(--sail);
	padding-right: var(--sair);
	padding-top: var(--sait);
	padding-bottom: var(--saib);
	overflow: hidden;
	background: #f9fafb;
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

	useEffect(() => {
		if (!audioObj) return

		const onTime = () => {
			setSongProgress(audioObj.currentTime)

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

	useEffect(() => {
		if (status !== 'ready') return

		const fetchData = async () => {
			const user = session?.user
			if (user) {
				if (user.avatar) {
					setAvatarSrc(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`)
				} else {
					const defaultAvatarIndex = (BigInt(user.id) >> 22n) % 6n
					setAvatarSrc(`https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`)
				}
				setUsername(user.global_name ?? `${user.username}#${user.discriminator}`)
			}

			const userData = await getUserResult(user.id)

			if (userData) {
				setIsGameOver(userData.completed)
				setSongGuesses(userData.guesses)
			}
			setUserDataReady(true)
		}
		fetchData()
	}, [status])

	useEffect(() => {
		if (audioReady && status === 'ready' && userDataReady) {
			setLoading(false)
		}
	}, [audioReady, status, , userDataReady])

	useEffect(() => {
		if (status !== 'ready' || !userDataReady) return
		if (isGameOver) return

		const finishedGuesses = songGuesses.every((g) => g !== null)
		const guessedCorrectly = songGuesses.some((guess) => guess?.suggestion === song?.suggestion)

		if (finishedGuesses) {
			setIsGameOver(true)
			logUserResult(session?.user.id, { completed: true, guesses: songGuesses }, true)
		} else if (guessedCorrectly) {
			setIsGameOver(true)
			logUserResult(session?.user.id, { completed: true, guesses: songGuesses }, true)
		} else {
			logUserResult(session?.user.id, { completed: false, guesses: songGuesses }, true)
		}
	}, [songGuesses, status, userDataReady])

	useEffect(() => {
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})

		const logPlayerChannel = async () => {
			try {
				await logPlayerToChannel(discordSdk.channelId, user.id, {
					avatar: 'https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256',
					discriminator: user.discriminator,
					username: user.username
				})
			} catch (err) {
				console.error('Failed to log player to channel:', err)
			}
		}

		const fetchPlayers = async () => {
			try {
				const players = await getChannelPlayers(discordSdk.channelId)
				console.log(players)
				console.log(discordSdk.channelId)
				setUserComplete(players)
			} catch (err) {
				console.error('Failed to fetch channel players:', err)
			}
		}

		fetchPlayers()
		logPlayerChannel()
	}, [authenticated, discordSdk])

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
		<>
			{loading ? (
				<h1> Loading... </h1>
			) : (
				<AppContainer>
					<NavBar />
					{channelName && <p>Channel: #{channelName}</p>}
					{username && (
						<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
							<img src={avatarSrc} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
							<span>{username}</span>
						</div>
					)}
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
					/>
				</AppContainer>
			)}
		</>
	)
}
