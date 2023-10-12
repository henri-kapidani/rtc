const options = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};
const pc = new RTCPeerConnection(options);
// pc.onicecandidate = e => console.log(e.candidate);
pc.onicegatheringstatechange = e => {
	if (e.target.iceGatheringState === 'complete') {
		console.log(pc.localDescription);

		if (isOfferSide) {
			const shareUrl = window.location.origin +
				window.location.pathname +
				'?o=' +
				encodeURIComponent(JSON.stringify(pc.localDescription));
			document.body.innerHTML = `<a href="${shareUrl}" target="_blank" rel="noreferrer noopener">Open other peer tab</a><br><br><br><button>complete Connection</button><div>` + JSON.stringify(pc.localDescription) + `</div>`;
			document.querySelector('button').addEventListener('click', e => {
				const answer = JSON.parse(prompt('Answer: '));
				completeConnection(answer);
			});
		} else {
			document.body.innerHTML = '<div>' + JSON.stringify(pc.localDescription) + '</div>';
		}
	}
}

const channelData = pc.createDataChannel('channelData', {
	negotiated: true,
	id: 1,
});
channelData.onopen = e => console.log('open');
channelData.onmessage = e => console.log(e.data);
// channelData.send('message');

const searchParams = new URLSearchParams(window.location.search);
const isOfferSide = !searchParams.has('o');
if (isOfferSide) {
	offer();
} else {
	const offer = JSON.parse(searchParams.get('o'));
	answer(offer);
}



function offer() {
	pc.createOffer()
		.then(offer => pc.setLocalDescription(offer))

	// send the offer to the other peer via the signaling

	// completeConnection
}

function answer(offer) {
	pc.setRemoteDescription(offer)
		.then(() => pc.createAnswer())
		.then(answer => pc.setLocalDescription(answer))

	//send the answer to the other peer via the signaling
}

function completeConnection(answer) {
	pc.setRemoteDescription(answer).then(e => {
		console.log('done');
	});
}
