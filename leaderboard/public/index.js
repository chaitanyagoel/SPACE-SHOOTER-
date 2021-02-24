document.addEventListener("DOMContentLoaded", () => {  
  let i;
  myFunction();
  function myFunction() {
    setInterval(function(){ 
      if(i==0){
        i=1;
        var favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.setAttribute('rel', 'shortcut icon');
          var head = document.querySelector('head');
          head.appendChild(favicon);
        }
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href','images/logo4.png');
        document.getElementById("logo").src = 'images/logo3.png' ;
        document.getElementById("heading").style.color = "red" ;
        
      }
      else{
        i=0;
        document.getElementById("logo").src = 'images/logo2.png' ;
        document.getElementById("heading").style.color = "white" ;

        var favicon = document.querySelector('link[rel="shortcut icon"]');
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.setAttribute('rel', 'shortcut icon');
          var head = document.querySelector('head');
          head.appendChild(favicon);
        }
        favicon.setAttribute('type', 'image/png');
        favicon.setAttribute('href','images/logo.png');
      }
     }, 500);
  }
});