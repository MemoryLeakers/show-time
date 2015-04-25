from tornado import websocket, web, ioloop
import json, threading

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


app = web.Application([
    (r'/', IndexHandler),
    (r'/ws', SocketHandler),
])

if __name__ == '__main__':
    app.listen(8888)

    t = threading.Thread(target=ioloop.IOLoop.instance().start)
    t.start()

def sendValue(value):
    for client in clients:
        client.write_message(value.__str__())
