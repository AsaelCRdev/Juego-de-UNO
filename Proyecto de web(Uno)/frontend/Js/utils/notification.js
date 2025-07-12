document.addEventListener("DOMContentLoaded", function () {
  const notification = document.getElementById("notification");

  //Función para mostrar la notificación
  function showNotification() {
    notification.style.display = "flex";
    setTimeout(() => {
      notification.style.display = "none";
    }, 10000); //Ocultar después de 10 segundos
  }

  //Seleccionar todos los enlaces que queremos escuchar
  const links = document.querySelectorAll(`
    a[href="/Proyecto de web(Uno)/frontend/Vista/Paginas/poderes.html"],
    a[href="/Proyecto de web(Uno)/frontend/Vista/Paginas/configuracion.html"],
    a[href="/Proyecto de web(Uno)/frontend/Vista/Paginas/acercade.html"]
  `);

  links.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      showNotification();
    });
  });

  //Cerrar la notificación
  const closeButton = notification.querySelector(".cross-icon");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      notification.style.display = "none";
    });
  }
});
