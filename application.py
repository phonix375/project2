import os
import json
from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgresql://postgres:fuckyou375@localhost/chat'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

rooms = {'main':[]}
users =[]
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
    with app.app_context():
        main()

@app.route("/")
def index():
    return render_template('index.html') 


@socketio.on("send message")
def send_message(data):
    room  = data['room']
    message = data['message']
    user = data['user']
    time = data['time']
    rooms[room].append({'user':user,'message':message,'time':time})
    emit("new message", {'room':str(room),'message':str(message),'user':str(user),'time':str(time)} , broadcast=True)

@socketio.on('add room')
def add_room(data) :
    if data in rooms : 
        emit('new room','error',broadcast=True)
    else:
        rooms[data] = []
        emit("new room", list(rooms.keys()), broadcast=True)


@app.route('/room_change/<room>')
def change_room (room):
    return str(rooms[room])


@app.route('/test')
def test():
    return jsonify({'allRooms':list(rooms.keys())})


@app.route('/allRooms',methods=['POST'])
def allRooms():
    return jsonify({'allRooms':list(rooms.keys())})


@app.route('/newMessages', methods=['POST'])
def allMessages() :
    newRoom = request.form.get('newRoom')
    return jsonify({'newMessages':rooms[newRoom]})

@app.route('/chekUser', methods=['POST'])
def checkUser() :
    user_select = request.form.get('userName')
    if user_select in users:
        return jsonify({'succses' : 'no', 'error':'User alrady exsist, please select difrent user name'+str(users)})
    else :
        users.append(user_select)
        return jsonify({'succses':'yes','error':'no error'})


