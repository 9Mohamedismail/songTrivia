import styled from 'styled-components'

const StyledNav = styled.div`
	border: 1px solid;
	display: flex;
`
const NavContent = styled.div`
	display: flex;
	justify-content: space-around;
	width: 100%;
`

const NavItems = styled.div`
	display: flex;
	justify-content: space-between;
	width: 200px;
`

function NavBar() {
	return (
		<StyledNav>
			<NavContent>
				<h1>!</h1>
				<h1> Hello World</h1>
				<NavItems>
					<h1>?</h1>
					<h1> leaderboard</h1>
				</NavItems>
			</NavContent>
		</StyledNav>
	)
}

export default NavBar
