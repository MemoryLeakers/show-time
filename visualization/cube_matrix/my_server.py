from tornado import websocket, web, ioloop, escape
import json
import threading
import os
import tornado
import numpy as np

from recorder import Recorder, CHUNK

clients = []


class IndexHandler(web.RequestHandler):

    def get(self):
        self.render("index.html")


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
        bam = np.fft.fft(data)




        bam = rec.prepare_fft(data, CHUNK)

        result_dict = {"volume": vol, "frequency": bam}
        for client in clients:
            # client.write_message(vol.__str__())
            # client.write_message(bam.__str__())
            # client.write_message(value.__str__())
            client.write_message(tornado.escape.json_encode(result_dict))
            #client.write_message(bam)
    while 1:
        sendValue()
