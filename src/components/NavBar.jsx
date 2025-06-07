import styled from 'styled-components'
import { RxQuestionMarkCircled } from 'react-icons/rx'
import { MdOutlineLeaderboard } from 'react-icons/md'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

const StyledNav = styled.div`
	width: 100%;
	border-bottom: 2px solid black;
	padding: 0.25rem 0;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
`
const NavContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 0 1rem;
	box-sizing: border-box;
`

const NavItems = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100px;
`

const NavText = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36px;
	line-height: 1.5;
`

function NavBar() {
	return (
		<StyledNav>
			<NavContent>
				<NavText>
					<AiOutlineExclamationCircle />
				</NavText>
				<NavText> SongTrivia</NavText>
				<NavItems>
					<NavText>
						<RxQuestionMarkCircled />
					</NavText>
					<NavText>
						<MdOutlineLeaderboard />
					</NavText>
				</NavItems>
			</NavContent>
		</StyledNav>
	)
}

export default NavBar
