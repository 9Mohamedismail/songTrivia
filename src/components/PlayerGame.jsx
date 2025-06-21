import styled from 'styled-components'
import PlayButton from './PlayButton'

const StyledSongContainter = styled.div`
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

	@media (max-width: 480px) {
		min-height: 36px;
		padding: 4px;
	}
`
const SongImage = styled.img`
	width: 50px;
	height: 50px;
`

const SongInfo = styled.div`
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

function PlayerGame({ isPlaying, handleAudio, song, channelPlayers }) {
	console.log(channelPlayers)

	const getResult = (guess, field) => {
		if (!guess) return null
		if (guess.id === 'Skipped') return 'skipped'
		return guess[field] === song[field]
	}

	return (
		<>
			{channelPlayers &&
				channelPlayers.map((player) => {
					return (
						<StyledSongContainter>
							<SongImage src={player.avatar} />
							<SongInfo>
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
							</SongInfo>
						</StyledSongContainter>
					)
				})}
		</>
	)
}

export default PlayerGame
