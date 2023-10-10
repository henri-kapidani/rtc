const searchParams = new URLSearchParams(window.location.search);
const btnShare = document.querySelector('.invite');
const btnStart = document.querySelector('.start');
const eleCode = document.querySelector('.code');

const options = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const pc = new RTCPeerConnection(options);
const channel = pc.createDataChannel('moves', {negotiated: true, id: 0});
channel.onopen = e => channel.send('open');
channel.onmessage = e => console.log(e.data);

if (searchParams.has('o')) {
    btnShare.style.display = 'none';
    const offer = JSON.parse(searchParams.get('o'));

    // pc.ondatachannel = e => {
    //     e.channel.onopen = e => console.log("open");
    //     e.channel.onmessage = e => console.log(e.data);
    //     e.channel.onclose = e => console.log("closed");
    //     pc.channel = e.channel;
    // }

    pc.setRemoteDescription(offer)
        .then(a => console.log("done"));

    //create answer
    pc.createAnswer()
        .then(a => pc.setLocalDescription(a))
        .then(a => console.log(JSON.stringify(pc.localDescription)));
    //send the anser to the client 
} else {
    btnShare.addEventListener('click', share);
}



function share() {
    // channel = pc.createDataChannel('moves');
    // channel.onopen = e => console.log("open");
    // channel.onmessage = e => console.log(e.data)
    // channel.onclose = e => console.log("closed");

    pc.createOffer()
        .then(o => {
            console.log(window.location.origin + window.location.pathname + '?o=' + encodeURIComponent(JSON.stringify(o)));
            pc.setLocalDescription(o);
        });
    
    btnShare.style.display = 'none';
    
    btnStart.addEventListener('click', function() {
        pc.setRemoteDescription(JSON.parse(eleCode.value))
            .then(a => console.log("done"));
        btnStart.style.display = 'none';
        eleCode.style.display = 'none';
    })
}
