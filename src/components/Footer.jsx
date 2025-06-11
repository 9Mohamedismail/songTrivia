import styled from 'styled-components'

const StyledFooter = styled.div`
	display: flex;
	margin-top: 10px;
	padding: 0 4px;
`

const FooterContent = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
	gap: 8px;
`

const StyledButton = styled.button`
	height: 44px;
	min-height: 44px;
	padding: 8px 12px;
	border-radius: 8px;
	border: 1px solid #383838;
	background: white;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease;
	flex: 1;
`

function Footer({ onSubmit, handleSkip, numberOfGuesses }) {
	return (
		<StyledFooter>
			<FooterContent>
				<StyledButton onClick={handleSkip}>
					Skip (+{numberOfGuesses.findIndex((guesses) => guesses === null) + 1}s)
				</StyledButton>
				<StyledButton onClick={onSubmit}>Submit</StyledButton>
			</FooterContent>
		</StyledFooter>
	)
}

export default Footer
