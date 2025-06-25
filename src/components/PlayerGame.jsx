import styled from 'styled-components'

const PlayersWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;

	@media only screen and (max-width: 719px) {
		flex-direction: row;
		width: 100%;
		overflow-x: auto;
		padding: 0 4px;
	}
`

const StyledContainter = styled.div`
	display: flex;
	justify-content: center;
	border: 1px solid;
	border-radius: 6px;
	box-sizing: border-box;
	align-items: center;
	margin-top: 20px;
	gap: 16px;
	max-width: 150px;
	min-height: 40px;
	padding: 12px;
`
const PlayerImage = styled.img`
	width: 50px;
	height: 50px;
`

const PlayerInfo = styled.div`
	display: flex;
	flex-direction: column;
`
const StyledResult = styled.td`
	background-color: ${
		(p) =>
			p.correct == null
				? 'blue' // no guess
				: p.correct === 'skipped'
					? '#1e293b' // skipped
					: p.correct
						? '#059669' // correct
						: '#dc2626' // wrong
	};
	padding: 4px;
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
								<table>
									<tbody>
										{player.guesses.map((guess, i) => (
											<tr key={i}>
												<StyledResult correct={getResult(guess, 'artist')}></StyledResult>
												<StyledResult correct={getResult(guess, 'title')}></StyledResult>
												<StyledResult correct={getResult(guess, 'genre')}></StyledResult>
												<StyledResult correct={getResult(guess, 'year')}></StyledResult>
											</tr>
										))}
									</tbody>
								</table>
							</PlayerInfo>
						</StyledContainter>
					)
				})}
		</PlayersWrapper>
	)
}

export default PlayerGame
