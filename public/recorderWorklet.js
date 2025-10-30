class PCMWorklet extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input && input[0]) {
        const channel = input[0]; // Float32Array mono channel
        const pcm16 = new Int16Array(channel.length);
  
        for (let i = 0; i < channel.length; i++) {
          const s = Math.max(-1, Math.min(1, channel[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
  
        // Send Int16Array buffer back to main thread
        this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
      }
      return true;
    }
  }
  
  registerProcessor("pcm-worklet", PCMWorklet);