import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	border: 1px solid;
	margin-bottom: 10px;
	height: 20px;
	position: relative;
`

const ProgressBar = styled.div`
	background-color: green;
	width: ${(props) => props.progress + '%'};
	transition: width 0.2s linear;
`
const Tick = styled.div`
	position: absolute;
	width: 2px;
	height: 100%;
	background-color: black;
	left: ${(props) => props.left}%;
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
