import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	border: 1px solid;
	margin-bottom: 12px;
	height: 24px;
	position: relative;
	border-radius: 4px;
	overflow: hidden;
	background: #f9fafb;

	@media only screen and (max-width: 719px) {
		height: 28px;
	}
`

const ProgressBar = styled.div`
	background: linear-gradient(90deg, #10b981, #059669);
	width: ${(props) => props.progress}%;
	transition: width 0.2s linear;
	position: relative;
`
const Tick = styled.div`
	position: absolute;
	width: 2px;
	height: 100%;
	background-color: #374151;
	left: ${(props) => props.left}%;
	z-index: 10;
`

function SongProgressBar({ songProgress }) {
	const totalSeconds = 16
	const progressBarTicks = [1, 2, 4, 7, 11, 16]
	return (
		<StyledContainter>
			<ProgressBar progress={(songProgress / totalSeconds) * 100}></ProgressBar>
			{progressBarTicks.map((left, i) => (
				<Tick key={i} left={(left / totalSeconds) * 100} />
			))}
		</StyledContainter>
	)
}

export default SongProgressBar
