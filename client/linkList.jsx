import React from 'react'

import RemoveLinkButton from './removeLinkButton.jsx'
import EditLinkButton from './editLinkButton.jsx'
import AddLinkRow from './addLinkRow.jsx'

import useApiCall from './useApiCall.jsx'

export default function LinkList() {
	const links = useApiCall('/links')?.links
	const fixedUrl = useApiCall('/fixedUrl')?.url

	return (
		<table>
			<thead>
				<tr>
					<th>Source</th>
					<th>Destination</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{ links && Object.keys(links).sort().map(src =>
					<tr key={src}>
						<td><em>{ src }</em>{ fixedUrl }</td>
						<td>{ links[src] }</td>
						<td>
							<RemoveLinkButton name={src} />
							<EditLinkButton name={src} current={links[src]} />
						</td>
					</tr>
				) }
				<AddLinkRow links={links} fixedUrl={fixedUrl} />
			</tbody>
		</table>
	)
}
