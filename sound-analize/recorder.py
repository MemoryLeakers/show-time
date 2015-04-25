
import pyaudio
import wave
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

    def rms(self, data):
        squares = sum([n*n for n in data])
        return math.sqrt(squares / data.__len__())
if __name__ == '__main__':

    pass
'''
    r = Recorder()

    import matplotlib.pyplot as pl
    print ()

    # decibles 20 * log 10 ( rms )

    pl.plot(data)
    pl.show()



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
