import Guesses from './Guesses'
import SongProgressBar from './SongProgressBar'
import PlaySong from './PlaySong'
import SearchBar from './SearchBar'
import Footer from './Footer'
import GameEnd from './GameEnd'
import styled from 'styled-components'

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

function GameUI({
	songGuesses,
	songProgress,
	song,
	currentGuessInput,
	handleSearchChange,
	handleSubmit,
	filteredSuggestions,
	showSuggestions,
	setShowSuggestions,
	setCurrentGuessInput,
	handleGuesses,
	isPlaying,
	handleAudio,
	isGameOver
}) {
	return (
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
	)
}

export default GameUI
