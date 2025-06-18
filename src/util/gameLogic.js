import gachaDestinyData from '../util/gachaDestinyData.json'

export const createGameLogic = ({
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
}) => {
	// Sets the Audio player to play or pause
	const handleAudio = () => {
		if (!audioObj) return
		clearTimeout(timeoutRef.current)

		if (isPlaying) {
			audioObj.pause()
			audioObj.currentTime = 0
			setIsPlaying(false)
			setSongProgress(0)
		} else {
			audioObj.currentTime = 0
			audioObj
				.play()
				.then(() => setIsPlaying(true))
				.catch((e) => console.error('Playback error:', e))
		}
	}

	// Everytime the user types it updates the current guess. If it matches one of the valid guesses it will filter all possible results to the user and shows it to them.
	const handleSearchChange = (val) => {
		setCurrentGuessInput(val)

		const matches = gachaDestinyData
			.filter((item) => item.suggestion.toLowerCase().includes(val.toLowerCase()))
			.map((item) => item.suggestion)

		setFilteredSuggestions(matches)
		setShowSuggestions(val.trim() !== '' && matches.length > 0)
	}

	// 1. Checks if the user can still make a guess.
	// 2. Checks if the user skipped instead of making a guess OR if their guess is a valid guess.
	// 3. Sets the user's guess/skip to be rendered into the correct position AND uses the index to know the song duration the user has.
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

	// Runs when the user clicks the submit button
	const handleSubmit = () => {
		handleGuesses(currentGuessInput)
		setCurrentGuessInput('')
	}

	return { handleAudio, handleSearchChange, handleGuesses, handleSubmit }
}
