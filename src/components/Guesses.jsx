import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
	gap: 16px;
	width: 100%;
`
const GuessContainter = styled.div`
	display: flex;
	border: 1px solid;
	width: 100%;
	padding: 8px;
	border-radius: 6px;
	align-items: center;
	box-sizing: border-box;
`

const GuessText = styled.h1`
	font-size: 20px;
	margin: 0;
	line-height: 1.5;
`

function Guesses() {
	return (
		<StyledContainter>
			<GuessContainter>
				<GuessText> Hello World</GuessText>
			</GuessContainter>
			<GuessContainter>
				<GuessText> Hello World</GuessText>
			</GuessContainter>
			<GuessContainter>
				<GuessText> Hello World</GuessText>
			</GuessContainter>
			<GuessContainter>
				<GuessText> Hello World</GuessText>
			</GuessContainter>
			<GuessContainter>
				<GuessText> Hello World</GuessText>
			</GuessContainter>
		</StyledContainter>
	)
}

export default Guesses
