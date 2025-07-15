
/**
 * @name StereoBeast
 * @author Aizen
 * @version 1.0.0
 * @description Boosts mic gain and adds stereo expansion to dominate VC with loud and wide voice.
 */

module.exports = class StereoBeast {
    start() {
        BdApi.showToast("🎧 StereoBeast Activated – Beast Mode On", { type: "success" });

        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.source = this.audioCtx.createMediaStreamSource(stream);

            this.gainNode = this.audioCtx.createGain();
            this.gainNode.gain.value = 3.16; // +10dB

            this.splitter = this.audioCtx.createChannelSplitter(2);
            this.merger = this.audioCtx.createChannelMerger(2);

            // Stereo phase trick: Left → Right, Right → Left
            this.splitter.connect(this.merger, 0, 1);
            this.splitter.connect(this.merger, 1, 0);

            this.source.connect(this.splitter);
            this.merger.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination); // Output to Discord

            console.log("[StereoBeast] Loud stereo mic injected.");
        }).catch(err => {
            console.error("[StereoBeast] Mic access failed:", err);
            BdApi.showToast("StereoBeast failed: Mic not allowed 🎙️", { type: "error" });
        });
    }

    stop() {
        if (this.audioCtx) {
            this.audioCtx.close();
            console.log("[StereoBeast] Audio context closed.");
        }
        BdApi.showToast("StereoBeast Deactivated 📴", { type: "info" });
    }
};
