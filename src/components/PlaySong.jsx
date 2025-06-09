import { useRef, useState, useEffect } from 'react'
import styled from 'styled-components'

const StyledContainter = styled.div`
	display: flex;
	justify-content: space-between;
	width: 100%;
`

function PlaySong({ songDuration }) {
	const [isPlaying, setIsPlaying] = useState(true)
	const [songProgress, setSongProgress] = useState(0)

	const audioRef = useRef(new Audio('/toodeep.mp3'))
	const timeoutRef = useRef(null)

	useEffect(() => {
		const audio = audioRef.current

		const handleTimeUpdate = () => {
			setSongProgress(audio.currentTime)
			if (audio.currentTime >= songDuration) {
				audio.pause()
				setIsPlaying(false)
				setSongProgress(songDuration)
			}
		}

		audio.addEventListener('timeupdate', handleTimeUpdate)

		return () => {
			audio.removeEventListener('timeupdate', handleTimeUpdate)
		}
	}, [songDuration])

	const handleAudio = () => {
		const audio = audioRef.current
		clearTimeout(timeoutRef.current)

		if (isPlaying) {
			audio.pause()
			setIsPlaying(false)
		} else {
			audio.currentTime = 0
			audio
				.play()
				.then(() => setIsPlaying(true))
				.catch((e) => console.error('Playback error:', e))
		}
	}

	return (
		<StyledContainter>
			<h1>{'0:0' + Math.floor(songProgress)} </h1>
			<button onClick={handleAudio}>Play Song</button>
			<h1> 0:16</h1>
		</StyledContainter>
	)
}

export default PlaySong
