import styled from 'styled-components'
import PlayButton from './PlayButton'

const StyledContainter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 640px;
	padding: 12px;
	box-sizing: border-box;

	@media (max-width: 479px) {
		padding: 12px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

const TimeDisplay = styled.h2`
	font-size: 36px;
	margin: 0;
	font-weight: 500;
	color: #374151;
	min-width: 50px;

	@media (max-width: 479px) {
		font-size: 40px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

function PlaySong({ songProgress, isPlaying, handleAudio }) {
	return (
		<StyledContainter>
			<TimeDisplay>{`0:${String(Math.floor(songProgress)).padStart(2, '0')}`}</TimeDisplay>
			<PlayButton handleAudio={handleAudio} isPlaying={isPlaying} />
			<TimeDisplay>0:16</TimeDisplay>
		</StyledContainter>
	)
}

export default PlaySong
