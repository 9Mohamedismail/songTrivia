import styled from 'styled-components'
import { RxQuestionMarkCircled } from 'react-icons/rx'
import { MdOutlineLeaderboard } from 'react-icons/md'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

const StyledNav = styled.div`
	width: 100%;
	border-bottom: 2px solid #e5e5e5;
	padding: 8px 0;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	background: white;
	position: sticky;
	top: 0;
	z-index: 100;

	@media (max-width: 480px) {
		padding: 6px 0;
	}
`
const NavContent = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 640px;
	padding: 0 16px;
	box-sizing: border-box;

	@media (max-width: 480px) {
		padding: 0 12px;
	}
`

const NavItems = styled.div`
	display: flex;
	gap: 12px;

	@media (max-width: 480px) {
		gap: 8px;
	}
`

const NavText = styled.span`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: clamp(18px, 6vw, 36px);
	line-height: 1.5;
	font-weight: 600;
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
