import styled from 'styled-components'
import PlayButton from './PlayButton'

const StyledSongContainter = styled.div`
	display: flex;
`
const SongInfo = styled.div`
	display: flex;
	flex-direction: column;
`

const SongImage = styled.img`
	width: 250px;
	height: 250px;
`

function GameEnd({ isPlaying, setIsPlaying }) {
	return (
		<StyledSongContainter>
			<SongImage src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg" />
			<SongInfo>
				<h1> song title</h1>
				<h1> Artist </h1>
			</SongInfo>
			<PlayButton />
		</StyledSongContainter>
	)
}

export default GameEnd
