from tornado import websocket, web, ioloop, escape
import json
import threading
import os
import tornado
import numpy as np
import socket


from recorder import Recorder, CHUNK

clients = []


class IndexHandler(web.RequestHandler):

    def get(self):
        ip = ([(s.connect(('8.8.8.8', 80)), s.getsockname()[0], s.close()) for s in [socket.socket(socket.AF_INET, socket.SOCK_DGRAM)]][0][1])

        self.render("index.html", ip=ip)

class TunerHandler(web.RequestHandler):

    def get(self):
        self.render("tuner.html")

class SocketHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def open(self):
        if self not in clients:
            clients.append(self)

    def on_close(self):
        if self in clients:
            clients.remove(self)

PATH = os.path.dirname(os.path.realpath(__file__))
css_path = os.path.join(PATH, 'css')
js_path = os.path.join(PATH, 'js')
print(css_path)
app = web.Application([
    (r'/', IndexHandler),
    (r'/tuner', TunerHandler),
    (r'/ws', SocketHandler),
    (r'/css/(.*)', tornado.web.StaticFileHandler, {'path': css_path}),
    (r'/js/(.*)', tornado.web.StaticFileHandler, {'path': js_path}),
])

if __name__ == '__main__':
    app.listen(8888)
    t = threading.Thread(target=ioloop.IOLoop.instance().start)
    t.start()

    def sendValue():
        rec = Recorder()
        data = rec.read()
        vol = rec.rms(data) * 50
        # bam = np.fft.rfft(data)
        bam = rec.prepare_fft(data, CHUNK)
        note = rec.prepare_note(bam)

        result_dict = {"volume": vol, "frequency": bam, "note": note}
        for client in clients:
            # client.write_message(vol.__str__())
            # client.write_message(bam.__str__())
            # client.write_message(value.__str__())
            client.write_message(tornado.escape.json_encode(result_dict))
    while 1:
        sendValue()
