import styled from 'styled-components'

const PlayersWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	@media only screen and (max-width: 719px) {
		flex-direction: row;
		width: 100%;
		padding: 0 4px;

		@media (max-height: 719px) {
			display: none;
		}
	}
`

const StyledContainter = styled.div`
	display: flex;
	justify-content: center;
	border-radius: 11px;
	border: solid #383838;
	box-sizing: border-box;
	align-items: center;
	margin-top: 20px;
	gap: 16px;
	max-width: 150px;
	min-height: 40px;
	padding: 12px;

	@media only screen and (max-width: 719px) {
		gap: 12px;
		padding: 8px;
		margin-top: 16px;
	}
`
const PlayerImage = styled.img`
	width: 50px;
	height: 50px;

	@media only screen and (max-width: 719px) {
		width: 40px;
		height: 40px;
	}
`

const PlayerInfo = styled.div`
	display: flex;
	flex-direction: column;
`

const GuessGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 1px;
	width: 100%;
`

const GuessCell = styled.div`
	background-color: ${(p) =>
		p.correct == null ? 'gray' : p.correct === 'skipped' ? '#1e293b' : p.correct ? '#059669' : '#dc2626'};
	min-height: 8px;
	min-width: 8px;
`
function PlayerGame({ song, channelPlayers }) {
	console.log(channelPlayers)

	const getResult = (guess, field) => {
		if (!guess) return null
		if (guess.id === 'Skipped') return 'skipped'
		return guess[field] === song[field]
	}

	return (
		<PlayersWrapper>
			{channelPlayers &&
				channelPlayers.map((player) => {
					return (
						<StyledContainter>
							<PlayerImage src={player.avatar} />
							<PlayerInfo>
								<GuessGrid>
									{player.guesses.flatMap((guess, i) => [
										<GuessCell key={`${i}-artist`} correct={getResult(guess, 'artist')} />,
										<GuessCell key={`${i}-title`} correct={getResult(guess, 'title')} />,
										<GuessCell key={`${i}-genre`} correct={getResult(guess, 'genre')} />,
										<GuessCell key={`${i}-year`} correct={getResult(guess, 'year')} />
									])}
								</GuessGrid>
							</PlayerInfo>
						</StyledContainter>
					)
				})}
		</PlayersWrapper>
	)
}

export default PlayerGame
