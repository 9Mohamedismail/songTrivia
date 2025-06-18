import { useEffect, useState, useRef } from 'react'
import { storage } from '../hooks/useFirebaseSdk'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import NavBar from '../components/NavBar'
import Guesses from '../components/Guesses'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import PlaySong from '../components/PlaySong'
import SongProgressBar from '../components/SongProgressBar'
import styled from 'styled-components'
import gachaDestinyData from '../util/gachaDestinyData.json'
import GameEnd from '../components/GameEnd'

import { getChannelPlayers } from '../util/getChannelPlayer'
import { logPlayerToChannel } from '../util/logPlayerToChannel'
import { getUserResult } from '../util/getUserResult'

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

const GameWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: flex-end;

	flex: 1;
	width: 100%;
	padding: 0 8px;
	overflow: hidden;

	@media (max-width: 480px) {
		padding: 0 4px;
	}
`

const Game = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 640px;
	height: 100%;
	overflow: hidden;
`

const GuessesSection = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	width: 100%;
	min-height: 0;
	overflow: hidden;
`
const BottomUI = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	flex-shrink: 0;
	background: white;

	padding: 8px;
	gap: 4px;

	@media (max-width: 480px) {
		padding: 6px;
		gap: 2px;
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
	const [audio, setAudio] = useState(null)
	const [song, setSong] = useState(() => {
		const songIndex = Math.floor(Math.random() * gachaDestinyData.length)
		return gachaDestinyData[songIndex]
	})

	const timeoutRef = useRef(null)

	useEffect(() => {
		if (isGameOver) return

		const finishedGuesses = songGuesses.every((g) => g !== null)
		const guessedCorrectly = currentGuessInput === song?.suggestion

		if (finishedGuesses || guessedCorrectly) {
			setIsGameOver(true)
		}
	}, [songGuesses, currentGuessInput, song, isGameOver])

	useEffect(() => {
		if (!song) return

		const loadAudio = async () => {
			try {
				const clipUrl = await getDownloadURL(ref(storage, `audio-clips/${song.id}.mp3`))

				const rewrittenUrl = clipUrl.replace('https://firebasestorage.googleapis.com', '/firebase')
				const audioObj = new Audio(rewrittenUrl)
				audioObj.addEventListener('timeupdate', () => {
					setSongProgress(audioObj.currentTime)

					if (audioObj.currentTime >= songDuration && !isGameOver) {
						audioObj.pause()
						setIsPlaying(false)
						setSongProgress(songDuration)
					} else if (isGameOver && audioObj.currentTime >= audioObj.duration) {
						audioObj.pause()
						setIsPlaying(false)
					}
				})
				setAudio(audioObj)
			} catch (e) {
				console.error('Failed to load audio:', e)
			}
		}

		loadAudio()
	}, [song, songDuration, isGameOver])

	const handleGuesses = (userGuess) => {
		const findEmptyGuess = songGuesses.findIndex((guesses) => guesses === null)
		if (findEmptyGuess === -1) return
		const songObject =
			userGuess === 'Skipped'
				? {
						id: 'Skipped',
						title: 'Skipped',
						artist: '',
						genre: '',
						year: '',
						album: ''
					}
				: gachaDestinyData.find((item) => item.suggestion === userGuess)
		if (!songObject) return
		setSongGuesses(songGuesses.map((guess, index) => (index === findEmptyGuess ? songObject : guess)))
		setSongDuration(songDuration + findEmptyGuess + 1)
	}

	const handleSearchChange = (val) => {
		setCurrentGuessInput(val)

		const matches = gachaDestinyData
			.filter((item) => item.suggestion.toLowerCase().includes(val.toLowerCase()))
			.map((item) => item.suggestion)

		setFilteredSuggestions(matches)
		setShowSuggestions(val.trim() !== '' && matches.length > 0)
	}

	const handleSubmit = () => {
		handleGuesses(currentGuessInput)
		setCurrentGuessInput('')
	}

	const handleAudio = () => {
		if (!audio) return
		clearTimeout(timeoutRef.current)

		if (isPlaying) {
			audio.pause()
			audio.currentTime = 0
			setIsPlaying(false)
			setSongProgress(0)
		} else {
			audio.currentTime = 0
			audio
				.play()
				.then(() => setIsPlaying(true))
				.catch((e) => console.error('Playback error:', e))
		}
	}

	const { authenticated, discordSdk, session } = useDiscordSdk()
	const [channelName, setChannelName] = useState()
	const [avatarSrc, setAvatarSrc] = useState('')
	const [username, setUsername] = useState('')
	const [userComplete, setUserComplete] = useState('')

	useEffect(() => {
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})

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

	return (
		<AppContainer>
			<NavBar />
			{channelName && <p>Channel: #{channelName}</p>}
			{username && (
				<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<img src={avatarSrc} alt="avatar" width={40} height={40} style={{ borderRadius: '50%' }} />
					<span>{username}</span>
				</div>
			)}
			<GameWrapper>
				<Game>
					{!isGameOver ? (
						<>
							<GuessesSection>
								<Guesses songGuesses={songGuesses} song={song} />
							</GuessesSection>
							<BottomUI>
								<SongProgressBar songProgress={songProgress} />
								<PlaySong songProgress={songProgress} isPlaying={isPlaying} handleAudio={handleAudio} />
								<SearchBar
									value={currentGuessInput}
									onChange={handleSearchChange}
									onSubmit={handleSubmit}
									filteredSuggestions={filteredSuggestions}
									showSuggestions={showSuggestions}
									setShowSuggestions={setShowSuggestions}
									onSuggestionClick={(val) => {
										setCurrentGuessInput(val)
										setShowSuggestions(false)
									}}
								/>
								<Footer
									onSubmit={handleSubmit}
									handleSkip={() => {
										handleGuesses('Skipped')
									}}
									numberOfGuesses={songGuesses}
								/>
							</BottomUI>
						</>
					) : (
						<GameEnd isPlaying={isPlaying} handleAudio={handleAudio} song={song} />
					)}
				</Game>
			</GameWrapper>
		</AppContainer>
	)
}
