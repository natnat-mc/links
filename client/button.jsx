import React from 'react'

export default function Button({onClick, children}) {
	return (
		<a
			href="#!"
			onClick={onClick}
			className="button"
		>
			{ children }
		</a>
	)
}
