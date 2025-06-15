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

	@media (max-width: 480px) {
		padding: 8px;
	}
`

const TimeDisplay = styled.h2`
	font-size: 18px;
	margin: 0;
	font-weight: 500;
	color: #374151;
	min-width: 50px;

	@media (max-width: 480px) {
		font-size: 16px;
		min-width: 45px;
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
