import Guesses from './Guesses'
import SongProgressBar from './SongProgressBar'
import PlaySong from './PlaySong'
import SearchBar from './SearchBar'
import Footer from './Footer'
import GameEnd from './GameEnd'
import PlayerGame from '../components/PlayerGame'
import styled from 'styled-components'

const GameWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex: 1;
	width: 100%;
	padding: 0 8px;
	overflow: hidden;

	@media (max-width: 479px) {
		flex-direction: column;
		padding: 0 4px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

const Game = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 640px;
	flex: 1;
`

const Spacer = styled.div`
	flex: 1;
`

const GuessesSection = styled.div`
	display: flex;
	flex-direction: column;
	flex: none;
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
`

function GameUI({
	songGuesses,
	songProgress,
	handleAudio,
	handleSearchChange,
	song,
	currentGuessInput,
	handleSubmit,
	handleGuesses,
	filteredSuggestions,
	showSuggestions,
	setShowSuggestions,
	setCurrentGuessInput,
	isPlaying,
	isGameOver,
	channelPlayers
}) {
	return (
		<GameWrapper>
			<PlayerGame song={song} channelPlayers={channelPlayers} />
			<Game>
				{!isGameOver ? (
					<>
						<Spacer />
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
					<>
						<GameEnd isPlaying={isPlaying} handleAudio={handleAudio} song={song} />
					</>
				)}
			</Game>
		</GameWrapper>
	)
}

export default GameUI
