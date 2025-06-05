import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	justify-content: space-around;
`

function PlaySong() {
	return (
		<StyledContainter>
			<h1> 0:00</h1>
			<h1> Hello World</h1>
			<h1> 0:16</h1>
		</StyledContainter>
	)
}

export default PlaySong
