import styled from 'styled-components'

const StyledFooter = styled.div`
	display: flex;
	margin-top: 10px;
`

const FooterContent = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`

const StyledButton = styled.button`
	height: 25px;
`

function Footer({ onSubmit, handleSkip, numberOfGuesses }) {
	return (
		<StyledFooter>
			<FooterContent>
				<StyledButton onClick={handleSkip}>
					Skip ( + {numberOfGuesses.findIndex((guesses) => guesses === '') + 1} s)
				</StyledButton>
				<StyledButton onClick={onSubmit}>Submit</StyledButton>
			</FooterContent>
		</StyledFooter>
	)
}

export default Footer
