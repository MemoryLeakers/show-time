from tornado import websocket, web, ioloop
import json, threading
import os
import tornado

from recorder import Recorder

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
        recorder = Recorder()
        data = recorder.read()
        vol = recorder.rms(data)* 50
        for client in clients:
            client.write_message(vol.__str__())
            #client.write_message(value.__str__())
    while 1:
        sendValue()
