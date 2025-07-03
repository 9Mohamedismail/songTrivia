import { useRef, useEffect } from 'react'
import styled from 'styled-components'
import { IoSearchOutline } from 'react-icons/io5'

const StyledContainter = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 12px;
	padding: 0 8px;
`
const InputWrapper = styled.div`
	position: relative;
	width: 100%;
	max-width: 640px;
`

const StyledIcon = styled(IoSearchOutline)`
	position: absolute;
	top: 50%;
	left: 12px;
	transform: translateY(-50%);
	color: black;
	font-size: 20px;
	pointer-events: none;

	@media (max-width: 479px) {
		font-size: 20px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`

const StyledInput = styled.input`
	font-size: 20px;
	width: 100%;
	border-radius: 11px;
	border: solid #383838;
	padding: 12px 16px 12px 36px;
	box-sizing: border-box;

	@media (max-width: 479px) {
		padding: 8px 12px 8px 36px;
		font-size: 20px;
	}

	@media (min-width: 480px) and (max-width: 1023px) {
	}
`
const SuggestionsList = styled.ul`
	position: absolute;
	bottom: 100%;
	left: 0;
	width: 100%;
	background: white;
	border: 1px solid #d1d5db;
	border-bottom: none;
	bborder-radius: 8px 8px 0 0;
	max-height: 160px;
	overflow-y: auto;
	list-style: none;
	padding: 0;
	margin: 0;
	z-index: 50;
	box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
`

const SuggestionItem = styled.li`
	padding: 12px;
	cursor: pointer;
	font-size: 14px;
	border-bottom: 1px solid #f3f4f6;
	transition: background-color 0.15s ease;

	&:hover {
		background: #f9fafb;
	}

	&:active {
		background: #f3f4f6;
	}

	&:last-child {
		border-bottom: none;
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
