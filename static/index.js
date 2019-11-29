//currenr user room
if (localStorage.getItem('room') == null){
  var room = 'main'
}
else {
  var room = localStorage.getItem('room');
};



document.addEventListener('DOMContentLoaded', () => {

//load all existing rooms  

const request = new XMLHttpRequest();
request.open('POST', '/allRooms');

request.onload = () => {

  const data = JSON.parse(request.responseText);
  data['allRooms'].forEach(element => {
    var a = document.createElement('BUTTON');
    a.setAttribute(`data-room`,`${element}`);
    a.setAttribute('class','roomB');
    var  tableRow =document.createElement('tr');
    var tableCell = document.createElement('td');
    a.textContent = element;
    a.setAttribute('onclick',`changeRoom("${element}")`)
    a.setAttribute('href',`/room_change/${element}`);
    tableRow.appendChild(tableCell);
    tableCell.appendChild(a);
    document.querySelector('#list_of_rooms').appendChild(tableRow);

  });
};
request.send();


//load all messages in current room 
console.log(`changing to ${room}`)
changeRoom(room);

  //check if a user was loged in 
  if (localStorage.getItem('name')){
    document.querySelector('#user_select').style.display = 'none' ; 
    document.querySelector('#chat').style.display = 'block';

  };


  //when selecting a user
document.querySelector('#user_select').onsubmit = () => {
if (document.querySelector('#user_input').value.length >0 ){
  let request = new XMLHttpRequest();
request.open('POST', '/chekUser');

request.onload = () => {

  
  let data = JSON.parse(request.responseText);
  if (data.succses == 'yes') {
    const user = document.querySelector('#user_input').value;
    localStorage.setItem('name', user);
    document.querySelector('#user_select').style.display = 'none';
    document.querySelector('#chat').style.display = 'block';
  }
  else {
    document.querySelector('#error').innerHTML = data.error;
    

  };


  };

  const data = new FormData();
  data.append('userName',document.querySelector('#user_input').value)
  
    //send request
    request.send(data);
    

};
return false;
};

  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

socket.on('connect', () => {
  
  //when sending a message (submitting the form)
  document.querySelector('#chat_ms').onsubmit = () => {

    const message = document.querySelector('#msg').value ;

    document.querySelector('#msg').value = '';

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    socket.emit('send message', {'room' : room , 'message' : message,'user':localStorage.getItem('name'),'time':dateTime});

    return false;

  };

});

//when reciving a new room 
socket.on('new room', room_list => {
  if(room_list == 'error'){
    alert('this room name alrady exist , please select another one ');

  }
  else {
  document.querySelector('#list_of_rooms').innerHTML = '';
  room_list.forEach(element => {
  var a = document.createElement('BUTTON');
  a.setAttribute(`data-room`,`${element}`);
  a.setAttribute('class','roomB');
  var  tableRow =document.createElement('tr');
  var tableCell = document.createElement('td');
  a.textContent = element;
  a.setAttribute('onclick',`changeRoom("${element}")`)
  a.setAttribute('href',`/room_change/${element}`);
  tableRow.appendChild(tableCell);
  tableCell.appendChild(a);
  document.querySelector('#list_of_rooms').appendChild(tableRow);
});
  };

  });


//when reciving a new messssage 
socket.on('new message', new_message => {

  if(new_message.room == room ) {
    
  const card = document.createElement('div');
  card.setAttribute('class','card');
  const cardHeader = document.createElement('div');
  cardHeader.setAttribute('class','card-header');
  card.appendChild(cardHeader)
  cardHeader.innerHTML = new_message.user + ' ' + new_message.time
  const cardBody = document.createElement('div');
  cardBody.setAttribute('class','card-body')
  card.appendChild(cardBody)
  const p = document.createElement('p');
  p.innerHTML = new_message.message;
  cardBody.appendChild(p);
  document.querySelector('#messages').appendChild(card) ; 
  };


});

//adding a room 

document.querySelector('#add_room').onsubmit = () => {
  if(document.querySelector('#room_name').value.length > 0){
    const new_room = document.querySelector('#room_name').value;
    document.querySelector('#room_name').value = '';
    socket.emit('add room', new_room);
    return false;
  };
  return false;
};



});

function changeRoom (newRoom){
  room = newRoom ;
  document.querySelector('#messages').innerHTML = '';
  localStorage.setItem('room',newRoom);
  var request = new XMLHttpRequest();
request.open('POST', '/newMessages');

request.onload = () => {

  const data = JSON.parse(request.responseText);
  console.log(data)
  data['newMessages'].forEach(element => {
    const card = document.createElement('div');
    card.setAttribute('class','card');
    const cardHeader = document.createElement('div');
    cardHeader.setAttribute('class','card-header');
    card.appendChild(cardHeader)
    cardHeader.innerHTML = element.user + ' ' + element.time
    const cardBody = document.createElement('div');
    cardBody.setAttribute('class','card-body')
    card.appendChild(cardBody)
    const p = document.createElement('p');
    p.innerHTML = element.message;
    cardBody.appendChild(p);
    document.querySelector('#messages').appendChild(card) ;

  });

};
const data = new FormData();
data.append('newRoom',newRoom)

//send request
request.send(data);
};







/*
bugs to fix : 

1.makeing the rooms a like that a user can click 

2.add room to the list of rooms from server 

3.make rooms a link

4.make the logout butten work 
*/
