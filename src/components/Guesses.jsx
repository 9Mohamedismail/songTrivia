import { useEffect } from 'react'
import styled from 'styled-components'
import { FaCircleXmark } from 'react-icons/fa6'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import gachaDestinyData from '../util/gachaDestinyData.json'

const StyledContainter = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 20px;
	gap: 16px;
	width: 100%;
`
const GuessContainter = styled.div`
	display: flex;
	border: 1px solid;
	width: 100%;
	min-width: 640px;
	min-height: 48px;
	padding: 8px;
	border-radius: 6px;
	align-items: center;
	box-sizing: border-box;
	gap: 16px;
`

const GuessText = styled.h1`
	display: flex;
	font-size: 20px;
	margin: 0;
	line-height: 1.5;
	gap: 8px;
	color: ${(props) => (props.correct ? 'green' : 'red')};
`

function Guesses({ songGuesses }) {
	const correctAnswerObj = {
		id: 'J. Cole - Middle Child',
		title: 'Middle Child',
		artist: 'J. Cole',
		genre: 'Hip-Hop',
		year: 2019,
		album: 'Single'
	}

	const getFeedback = (correct, guess) => {
		const feedback = {
			artist: guess.artist === correct.artist,
			title: guess.title === correct.title,
			genre: guess.genre === correct.genre,
			year: Math.abs(guess.year - correct.year) <= 1
		}
		return feedback
	}

	return (
		<StyledContainter>
			{songGuesses.map((guess, i) => {
				if (!guess) {
					return (
						<GuessContainter key={i}>
							<GuessText />
						</GuessContainter>
					)
				}

				const feedback = getFeedback(correctAnswerObj, guess)

				return (
					<GuessContainter key={guess.id}>
						<GuessText correct={feedback.artist}>
							{feedback.artist ? <IoIosCheckmarkCircle /> : <FaCircleXmark />}
							{guess.artist}
						</GuessText>
						<GuessText correct={feedback.title}>
							{feedback.title ? <IoIosCheckmarkCircle /> : <FaCircleXmark />}
							{guess.title}
						</GuessText>
						<GuessText correct={feedback.genre}>
							{feedback.genre ? <IoIosCheckmarkCircle /> : <FaCircleXmark />}
							{guess.genre}
						</GuessText>
						<GuessText correct={feedback.year}>
							{feedback.year ? <IoIosCheckmarkCircle /> : <FaCircleXmark />}
							{guess.year}
						</GuessText>
					</GuessContainter>
				)
			})}
		</StyledContainter>
	)
}

export default Guesses
