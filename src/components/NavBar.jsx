import styled from 'styled-components'
import { RxQuestionMarkCircled } from 'react-icons/rx'
import { MdOutlineLeaderboard } from 'react-icons/md'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

const StyledNav = styled.div`
	width: 100%;
	border-bottom: 4px solid #383838;
	padding: 16px 0;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	background: white;
	position: sticky;
	top: 0;
	z-index: 100;

	@media only screen and (max-width: 719px) {
		padding: 12px 0;
	}
`
const NavContent = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 1200px;
	padding: 0 24px;
	box-sizing: border-box;

	@media only screen and (max-width: 719px) {
		max-width: 640px;
		padding: 0 16px;
	}
`

const NavItems = styled.div`
	display: flex;
	gap: 16px;

	@media only screen and (max-width: 719px) {
		gap: 12px;
	}
`

const NavText = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36px;
	line-height: 1.5;
	letter-spacing: 8px;
	cursor: pointer;
	font-weight: 600;

	@media only screen and (max-width: 719px) {
		font-size: clamp(26px, 6vw, 40px);
	}
`

const Title = styled(NavText)`
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
`

function NavBar() {
	return (
		<StyledNav>
			<NavContent>
				<NavText>
					<AiOutlineExclamationCircle />
				</NavText>
				<Title>SONGTRIVIA</Title>
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
