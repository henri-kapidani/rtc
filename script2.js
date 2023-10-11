const searchParams = new URLSearchParams(window.location.search);
const btnShare = document.querySelector('.invite');
const btnStart = document.querySelector('.start');
const eleCode = document.querySelector('.code');

const options = {
	iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const pc = new RTCPeerConnection(options);
const channelData = pc.createDataChannel('channelData', {
	negotiated: true,
	id: 1,
});

// let channel;
channelData.onopen = e => console.log('open');
channelData.onmessage = e => console.log(e.data);

// channelData.send('message');

if (searchParams.has('o')) {
	const offer = JSON.parse(searchParams.get('o'));

	// pc.ondatachannel = e => {
	// 	console.log('ondatachannel');
	// 	channelData = e.channelData;
	// 	channelData.onopen = e => console.log('open');
	// 	channelData.onmessage = e => console.log(e.data);
	// 	channelData.onclose = e => console.log('closed');
	// };

	pc.setRemoteDescription(offer).then(a => console.log('done'));

	//create answer
	pc.createAnswer()
		.then(answer => pc.setLocalDescription(answer))
		.then(answer => console.log(JSON.stringify(pc.localDescription)));
	//send the answer to the client
} else {
	btnShare.addEventListener('click', share);
}

function share() {
	// channelData = pc.createDataChannel('channelData');
	// channelData.onopen = e => console.log('open');
	// channelData.onmessage = e => console.log(e.data);
	// channelData.onclose = e => console.log('closed');

	// pc.onicecandidate = e => console.log(pc.localDescription);

	pc.createOffer().then(offer => {
		pc.setLocalDescription(offer);
		console.log(
			window.location.origin +
				window.location.pathname +
				'?o=' +
				encodeURIComponent(JSON.stringify(offer))
		);
	});

	btnStart.addEventListener('click', function () {
		pc.setRemoteDescription(JSON.parse(eleCode.value)).then(a =>
			console.log('done')
		);
	});
}
