import { useRef, useEffect } from 'react'
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
const SuggestionsList = styled.ul`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;
	background: white;
	border: 1px solid #ccc;
	border-top: none;
	max-height: 200px;
	overflow-y: auto;
	list-style: none;
	padding: 0;
	margin: 0;
	z-index: 10;
`

const SuggestionItem = styled.li`
	padding: 10px;
	cursor: pointer;
	&:hover {
		background: #eee;
	}
`

function SearchBar({
	value,
	onChange,
	onSubmit,
	filteredSuggestions = [],
	showSuggestions = false,
	setShowSuggestions,
	onSuggestionClick
}) {
	const wrapperRef = useRef(null)

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setShowSuggestions(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onSuggestionClick])

	return (
		<StyledContainter ref={wrapperRef}>
			<InputWrapper>
				<StyledIcon />
				<StyledInput
					type="search"
					placeholder="Search for the title"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault()
							onSubmit()
						}
					}}
				/>
				{showSuggestions && (
					<SuggestionsList>
						{filteredSuggestions.map((suggestion, index) => (
							<SuggestionItem key={index} onClick={() => onSuggestionClick(suggestion)}>
								{suggestion}
							</SuggestionItem>
						))}
					</SuggestionsList>
				)}
			</InputWrapper>
		</StyledContainter>
	)
}
export default SearchBar
