const socket = io ();
let user; ///Sera el user para que el cliente se identifique.
let chatBox = document.getElementById('chatBox'); 

Swal.fire({
    title: "Identificate",
    input: "text",
    text: "Ingresa el usuario para identificarte en el chat",
    inputValidator : (value) => {
        ///Si toca continuar, sin antes escribir dentro del input.
        return !value && '¡Necesitas un nombre de usuario para continuar!'
    },
    ///Inpide que el usuario toque fuera del modal y se cierre este.
    allowOutsideClick: false
}).then(result => {
    ///Si el usuario se identifico, asignamos el mismo a la variable user.
    user=result.value;
    ///le avisamos al servidor que el usuario se a logueado.
    socket.emit('authenticated', user);
});

///Capturo texto del chatBox.
chatBox.addEventListener('keyup', evt => {
    if(evt.key === "Enter"){
        ///Miramos si la value del chat box NO esta vacio o SOLO contiene espacios.
        if(chatBox.value.trim().length>0){
            ///Envio el nombre de usuario, y el mensaje.
            socket.emit('message',{user: user, message:chatBox.value});
            ///Limpio la caja.
            chatBox.value = "";
        }
    }
})

///Listener de los sockets.
///Este evento es para todos los sockets.
socket.on('messageLogs', data => {
    ///Si no hay ningun usuario logueado no recibe los mensajes.
    if (!user) return;
    ///Capturo los logs en una variable.
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach(texto => {
        ///Luego de reccorer el array, muestro un string con el user y el mensaje.
        messages = messages + `${texto.user} dice: ${texto.message} </br>`
    });
    ///Muestra en el html el string.
    log.innerHTML = messages;
})

///Para mostrar cuando un usuario se conecte.
socket.on('newUserConnected', user => {
    ///Valido que haya un usuario conectado.
    if (!user) return 
    Swal.fire({
        toast: true,
        position: "top-right",
        text: "Nuevo usuario conectado",
        title: `${user} se ha unido al chat`,
        timer: 3000,
        showConfirmButton: false
    })
})