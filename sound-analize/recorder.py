import pyaudio
# import wave
import math
import numpy as np


CHUNK = 1024
FORMAT = pyaudio.paFloat32
CHANNELS = 2
RATE = 44100
RECORD_SECONDS = 5
WAVE_OUTPUT_FILENAME = "output.wav"


class Recorder():

    def read(self):
        print("* recording")
        p = pyaudio.PyAudio()

        stream = p.open(format=FORMAT,
                        channels=CHANNELS,
                        rate=RATE,
                        input=True,
                        frames_per_buffer=CHUNK)
        data = stream.read(CHUNK)

        stream.stop_stream()
        stream.close()
        p.terminate()
        print("* done")

        return np.fromstring(data, 'Float32')
        # np.exp(2j * np.pi * np.arange(8) / 8)
        # return np.fft.fft(data)

    def rms(self, data):
        squares = sum([n * n for n in data])
        return math.sqrt(squares / data.__len__())

    def fft(self, data=None, trimBy=10, logScale=False, divBy=100):
        if data is None:
            data = self.audio.flatten()
        left, right = np.split(np.abs(np.fft.fft(data)), 2)
        ys = np.add(left, right[::-1])
        if logScale:
            ys = np.multiply(20, np.log10(ys))
        xs = np.arange(CHUNK / 2, dtype=float)
        if trimBy:
            i = int((CHUNK / 2) / trimBy)
            ys = ys[:i]
            xs = xs[:i] * RATE / CHUNK
        if divBy:
            ys = ys / float(divBy)
        return xs, ys


if __name__ == '__main__':
    pass
    # recorder = Recorder()

    # import matplotlib.pyplot as pl
    # # print ()
    # data = recorder.read()
    # # decibles 20 * log 10 ( rms )
    # # fft_data = recorder.fft(data)
    # vol = recorder.rms(data) * 50
    # print (vol)

    # print ("Vol:  ", vol)

    # bam = np.fft.fft(data)
    # print (list(bam)[10])
    # print (type(list(bam)[10]))
    # # print (type(bam))
    # # print (bam[10])
    # # print (bam)
    # # x1 = np.fft.rfft(data)
    # # x2 = sum(x1) / (len(x1)*2)
    # # y1 = np.fft.ifft(data)
    # # y2 = sum(y1) / (len(y1)*2)

    # # print (x1)
    # # print (x2)
    # # print (y1)
    # # print (y2)
    # # print (data)
    # # print (fft_data)
    # # pl.plot(fft_data)
    # pl.plot(vol)
    # # pl.plot(bam)
    # pl.show()


'''
frames = []

for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
    data = stream.read(CHUNK)
    decoder = numpy.fromstring(data, 'Float32')
    frames.append(data)

print("* done recording")

stream.stop_stream()
stream.close()
p.terminate()

wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
wf.setnchannels(CHANNELS)
wf.setsampwidth(p.get_sample_size(FORMAT))
wf.setframerate(RATE)
wf.writeframes(b''.join(frames))
wf.close()
'''
