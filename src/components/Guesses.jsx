import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`
const GuessContainter = styled.div`
	display: flex;
	border: 1px solid;
	width: 50%;
`

function Guesses() {
	return (
		<StyledContainter>
			<GuessContainter>
				<h1> Hello World</h1>
			</GuessContainter>
			<GuessContainter>
				<h1> Hello World</h1>
			</GuessContainter>
			<GuessContainter>
				<h1> Hello World</h1>
			</GuessContainter>
			<GuessContainter>
				<h1> Hello World</h1>
			</GuessContainter>
			<GuessContainter>
				<h1> Hello World</h1>
			</GuessContainter>
		</StyledContainter>
	)
}

export default Guesses
