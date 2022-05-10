if ("serial" in navigator) {

    navigator.serial.addEventListener("connect", (event) => {
        // TODO: Automatically open event.target or warn user a port is available.
    });

    navigator.serial.addEventListener("disconnect", (event) => {
        // TODO: Remove |event.target| from the UI.
        // If the serial port was opened, a stream error would be observed as well.
    });
    // The Web Serial API is supported.
}


async function connectSerial() {
    // Prompt user to select any serial port.
    const port = await navigator.serial.requestPort().then((port) => {
        // Connect to `port` or add it to the list of available ports.
        port.open({ baudRate: 115200 }).then(() => {
            log('Port Open');
            const textEncoder = new TextEncoderStream();
            const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
            writer = textEncoder.writable.getWriter();

            let decoder = new TextDecoderStream();
            inputDone = port.readable.pipeTo(decoder.writable);
            inputStream = decoder.readable;
            reader = inputStream.getReader();
            readLoop();

            StateConnect(true);
        }).catch((e) => {
           // port.close();
            log(e);
            // The user didn't select a port.
        });
    }).catch((e) => {
        log(e);
        // The user didn't select a port.
    });
    //const ports = await navigator.serial.getPorts();

    // Wait for the serial port to open.
};



async function readLoop(){
 let readBuffer = '';   
    while (true) {
        const { value, done } = await reader.read();
        if (value) {
          for (let c of value) {
            if (c === '\n') {
              let data = readBuffer.trim();
              readBuffer = '';
        
              if (data) {
                receive(data);
                receiveData(data);
              }
            }
            else {
              readBuffer += c;
            }
          }
        }
        if (done) {
          console.log('[readLoop] DONE', done);
          reader.releaseLock();
          break;
        }
      }
      
}

async function sendSerial(data) {
    await writer.write(data);
}