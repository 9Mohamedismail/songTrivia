import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 10px;
`

const StyledInput = styled.input`
	width: 50%;
	height: 50px;
`

function SearchBar() {
	return (
		<StyledContainter>
			<StyledInput type="text" placeholder="Search for the title"></StyledInput>
		</StyledContainter>
	)
}

export default SearchBar
