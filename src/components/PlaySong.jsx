import { useRef, useState, useEffect } from 'react'
import { storage } from '../hooks/useFirebaseSdk'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import gachaDestinyData from '../util/gachaDestinyData.json'
import styled from 'styled-components'
import PlayButton from './PlayButton'

const StyledContainter = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 640px;
	padding: 12px;
	box-sizing: border-box;

	@media (max-width: 480px) {
		padding: 8px;
	}
`

const TimeDisplay = styled.h2`
	font-size: 18px;
	margin: 0;
	font-weight: 500;
	color: #374151;
	min-width: 50px;

	@media (max-width: 480px) {
		font-size: 16px;
		min-width: 45px;
	}
`

function PlaySong({
	songDuration,
	songProgress,
	setSongProgress,
	isPlaying,
	setIsPlaying,
	handleAudio,
	setAudio,
	song
}) {
	useEffect(() => {
		if (!song) return

		const loadAudio = async () => {
			try {
				const clipUrl = await getDownloadURL(ref(storage, `audio-clips/${song.id}.mp3`))
				const audioObj = new Audio(clipUrl)
				const handleTimeUpdate = () => {
					setSongProgress(audioObj.currentTime)
					if (audioObj.currentTime >= songDuration) {
						audioObj.pause()
						setIsPlaying(false)
						setSongProgress(songDuration)
					}
				}
				audioObj.addEventListener('timeupdate', handleTimeUpdate)
				setAudio(audioObj)
			} catch (e) {
				console.error('Failed to load audio:', e)
			}
		}

		loadAudio()
	}, [song, songDuration])

	return (
		<StyledContainter>
			<TimeDisplay>{`0:${String(Math.floor(songProgress)).padStart(2, '0')}`}</TimeDisplay>
			<PlayButton handleAudio={handleAudio} isPlaying={isPlaying} />
			<TimeDisplay>0:16</TimeDisplay>
		</StyledContainter>
	)
}

export default PlaySong
