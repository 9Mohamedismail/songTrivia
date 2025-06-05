import styled from 'styled-components'

const StyledFooter = styled.div`
	display: flex;
	margin-top: 10px;
`

const FooterContent = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
`

const StyledButton = styled.button`
	height: 25px;
`

function Footer() {
	return (
		<StyledFooter>
			<FooterContent>
				<StyledButton>Hello World</StyledButton>
				<StyledButton>Hello World</StyledButton>
			</FooterContent>
		</StyledFooter>
	)
}

export default Footer
