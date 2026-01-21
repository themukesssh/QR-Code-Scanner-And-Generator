// QR Code Scanner and Generator functionality
$(document).ready(function() {
    const qrCanvas = document.getElementById('canvas');
    const qr = new QRious({ element: qrCanvas });
    let scanning = false;

    $('#generate-qr').click(function() {
        const inputText = $('#qr-input').val();
        qr.set({ value: inputText });
    });

    $('#start-scan').click(function() {
        $('#canvas').addClass('scanning'); // Add scanning class for dynamic styling
        $('#scan-result').text('Scanning...').removeClass('detected');

        const video = document.getElementById('video');
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                video.srcObject = stream;
                video.play();
                scanning = true;
                $('#start-scan').hide();
                $('#stop-scan').show();
                requestAnimationFrame(scan);
            });

    function scan() {
        const context = qrCanvas.getContext('2d');
        context.drawImage(video, 0, 0, qrCanvas.width, qrCanvas.height);
        const imageData = context.getImageData(0, 0, qrCanvas.width, qrCanvas.height);
        const code = jsQR(imageData.data, qrCanvas.width, qrCanvas.height);
        if (code) {
            displayResult(code);
        } else {
            $('#scan-result').removeClass('detected');
            $('#scan-result').html('<strong>No QR code detected.</strong> Please try again.');
        }
        requestAnimationFrame(scan);
    }

    function displayResult(code) {
        $('#scan-result').html('<strong>QR Code Data:</strong> ' + code.data).addClass('detected');
        const context = qrCanvas.getContext('2d');
        context.strokeStyle = 'red';
        context.lineWidth = 4;
        context.strokeRect(code.location.topLeftCorner.x, code.location.topLeftCorner.y, 
                          code.location.bottomRightCorner.x - code.location.topLeftCorner.x, 
                          code.location.bottomRightCorner.y - code.location.topLeftCorner.y);
    }

    });

    $('#stop-scan').click(function() {
        $('#canvas').removeClass('scanning'); // Remove scanning class when stopped
        $('#scan-result').text('Scanning stopped.').removeClass('detected');

        scanning = false;
        $('#start-scan').show();
        $('#stop-scan').hide();
        const video = document.getElementById('video');
        video.srcObject.getTracks().forEach(track => track.stop());
    });
});
