import styled from 'styled-components'
import { IoSearchOutline } from 'react-icons/io5'

const StyledContainter = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 16px;
`
const InputWrapper = styled.div`
	position: relative;
	width: 100%;
`

const StyledIcon = styled(IoSearchOutline)`
	position: absolute;
	top: 50%;
	left: 12px;
	transform: translateY(-50%);
	color: #888;
	font-size: 20px;
	pointer-events: none;
`

const StyledInput = styled.input`
	font-size: 16px;
	width: 100%;
	border-radius: 11px;
	border: 1px solid #383838;
	padding: 12px 16px 12px 40px;
`

function SearchBar({ value, onChange }) {
	return (
		<StyledContainter>
			<InputWrapper>
				<StyledIcon />
				<StyledInput
					type="search"
					placeholder="Search for the title"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</InputWrapper>
		</StyledContainter>
	)
}

export default SearchBar
