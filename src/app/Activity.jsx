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

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: -webkit-fill-available;
	width: 100%;
	padding-top: env(safe-area-inset-top);
	padding-left: env(safe-area-inset-left);
	padding-right: env(safe-area-inset-right);
	padding-bottom: env(safe-area-inset-bottom);
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
		setIsGameOver(songGuesses.findIndex((guesses) => guesses === null) === -1 ? true : false)
	}, [songGuesses])

	useEffect(() => {
		if (!song) return

		const loadAudio = async () => {
			try {
				const clipUrl = await getDownloadURL(ref(storage, `audio-clips/${song.id}.mp3`))
				const audioObj = new Audio(clipUrl)
				audioObj.addEventListener('timeupdate', () => {
					setSongProgress(audioObj.currentTime)

					if (audioObj.currentTime >= songDuration && !isGameOver) {
						audioObj.pause()
						setIsPlaying(false)
						setSongProgress(songDuration)
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

	const { authenticated, discordSdk, status } = useDiscordSdk()
	const [channelName, setChannelName] = useState()

	useEffect(() => {
		// Requesting the channel in GDMs (when the guild ID is null) requires
		// the dm_channels.read scope which requires Discord approval.
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		// Collect channel info over RPC
		// Enable authentication to see it! (App.jsx)
		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})
	}, [authenticated, discordSdk])

	return (
		<AppContainer>
			<NavBar />
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
