import { useEffect, useState } from 'react'
import { useDiscordSdk } from '../hooks/useDiscordSdk'
import NavBar from '../components/NavBar'
import Guesses from '../components/Guesses'
import SearchBar from '../components/SearchBar'
import Footer from '../components/Footer'
import PlaySong from '../components/PlaySong'
import SongProgressBar from '../components/SongProgressBar'
import styled from 'styled-components'

const AppContainer = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100%;
`

const GameWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex: 1;
	width: 100%;
`

const Game = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	max-width: 640px;
	height: 100%;
`

const GuessesSection = styled.div`
	height: 300px;
	width: 100%;
	flex-shrink: 0;
`

const MiddleSection = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`

const BottomUI = styled.div`
	display: flex;
	flex-direction: column;
	height: 300px;
	width: 100%;
	flex-shrink: 0;
`

export const Activity = () => {
	const { authenticated, discordSdk, status } = useDiscordSdk()
	const [channelName, setChannelName] = useState()

	useEffect(() => {
		// Requesting the channel in GDMs (when the guild ID is null) requires
		// the dm_channels.read scope which requires Discord approval.
		if (!authenticated || !discordSdk.channelId || !discordSdk.guildId) {
			return
		}

		// Collect channel info over RPC
		// Enable authentication to see it! (App.jsx)
		discordSdk.commands.getChannel({ channel_id: discordSdk.channelId }).then((channel) => {
			if (channel.name) {
				setChannelName(channel.name)
			}
		})
	}, [authenticated, discordSdk])

	return (
		<AppContainer>
			<NavBar />
			<GameWrapper>
				<Game>
					<GuessesSection>
						<Guesses />
					</GuessesSection>
					<MiddleSection></MiddleSection>
					<BottomUI>
						<SongProgressBar />
						<PlaySong />
						<SearchBar />
						<Footer />
					</BottomUI>
				</Game>
			</GameWrapper>
		</AppContainer>
	)
}
