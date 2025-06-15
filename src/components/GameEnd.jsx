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
	max-width: 640px;
	min-height: 40px;
	padding: 12px;

	@media (max-width: 480px) {
		min-height: 36px;
		padding: 4px;
	}
`
const SongImage = styled.img`
	width: 100px;
	height: 100px;
`

const SongInfo = styled.div`
	display: flex;
	flex-direction: column;
`

const StyledButton = styled.div`
	display: flex;
	margin-left: auto;
`

const Text = styled.h1`
	display: flex;
	align-items: center;
	font-size: 20px;
	margin: 0;
	font-weight: 500;
	line-height: 1.5;
	min-width: 50px;

	@media (max-width: 480px) {
		font-size: 16px;
		min-width: 45px;
	}
`

function GameEnd({ isPlaying, handleAudio, song }) {
	return (
		<StyledSongContainter>
			<SongImage src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" />
			<SongInfo>
				<Text> {song.title}</Text>
				<Text> {song.artist} </Text>
			</SongInfo>
			<StyledButton>
				<PlayButton isPlaying={isPlaying} handleAudio={handleAudio} />
			</StyledButton>
		</StyledSongContainter>
	)
}

export default GameEnd
