
      /*Variables principales del codigo */
      var pokemons=["pikachu", "bulbasur","cubone","squirtel", "abra", "magikarp"];
      var fondo=["hierba","verde","arena","nieve"];
      var Minicio=parseInt(Math.random() * (6) + 10);   
      var Mreset=parseInt(Math.random() * (6) + 10);  
      const delay = ms => new Promise(res => setTimeout(res, ms));
      /*Funcion inicial con los eventos .onclick y la generacion de las monedas iniciales */
      window.onload=inici;
      
      function inici(){ 
   
        fondos();
        document.querySelector("#reset").onclick=function(){moneda(Mreset);};
        document.querySelector("#background").onclick=fondos;
        document.querySelector("#lanzar").onclick=lanzar;
        document.querySelector("#cruz").onclick=cruz;
        for(let k=0;k<3;k++){
          document.querySelectorAll(".boton")[k].onclick=botones;
        }
        moneda(Minicio);   
      }

      /*Funcion para randomizar el fondo*/
      function fondos(){
        console.log("hola");
        let i=parseInt(Math.random() * fondo.length);
        document.querySelector("body").style=`background-image: url(img/${fondo[i]}.png)`;
      }

      /*Funcion principal de calculo del credito */
      function moneda(credito){
        console.log(credito);
        document.querySelector("#dinero").innerHTML=`${credito}`;
        document.getElementById("monedas").innerHTML="";
        for(let k=0; k<=credito-1; k++){
          if(k%5==0 && k>0 && k<=15){
            document.getElementById("monedas").innerHTML+=("beforebegin",'<br>');
          }
          document.getElementById("monedas").innerHTML+=("beforebegin",'<img src="img/ficha.png">');
           
        }
        Mreset=parseInt(Math.random() * (6) + 10);  
        Minicio=credito;
      }
      const tiempo = async () => {
        document.getElementById("lanzar").disabled=true;
        await delay(2000);
        document.getElementById("animacion").style="visibility:hidden";
        document.getElementById("animacion1").style="visibility:hidden";
        document.getElementById("animacion2").style="visibility:hidden";
        document.getElementById("lanzar").disabled=false;
      }
      /*Funcion del boton principal redondo que deriva en la funcion ComprobarTirada() */
      function lanzar(){
        if(Minicio>0){
        document.querySelector("#lanzar").disable=false;
        let pokemon=document.querySelectorAll(".ventana")
        document.getElementById("audio").play();
        document.getElementById("animacion").style="visibility:visible";
        document.getElementById("animacion1").style="visibility:visible";
        document.getElementById("animacion2").style="visibility:visible";
        tiempo();

        let resul0= parseInt(Math.random() * pokemons.length);
        pokemon[0].innerHTML=`<img src="img/${pokemons[resul0]}.png">`
        let resul1= parseInt(Math.random() * pokemons.length);
        pokemon[1].innerHTML=`<img src="img/${pokemons[resul1]}.png">`
        let resul2= parseInt(Math.random() * pokemons.length);
        pokemon[2].innerHTML=`<img src="img/${pokemons[resul2]}.png">`
        comprobarTirada();
      }else{
        document.querySelector("#lanzar").disable=true;
      }
 
      }

      /*Funcion de comprobacion de botones inferiores y llamada a funcion ComprobarTirada() */
      
      function botones(){
        let boton=this.parentNode.children;
        if(Minicio>0 && (imagen(0)!=imagen(1) || imagen(1)!=imagen(2))){
          document.getElementById("audio4").play();
          boton=this.parentNode.children;
          for(let k=0;k<boton.length;k++){
            if(this==boton[k]){
              let i = parseInt(Math.random() * 5)
              let pokerep = pokemons.filter(pokemon=> pokemon!= palabra(imagen(k)));
              document.querySelectorAll(".ventana")[k].innerHTML=`<img src="img/${pokerep[i]}.png">`
            }          
          }
          comprobarTirada();       
        }     
      }

      /*Funcion derivada del evento .onclick de la cruz que aparece en la ventana oculta y que comprueba el resultado final */
      function cruz(){
        document.querySelector("#velo").style="display:none";
        if(imagen(0)==imagen(1) && imagen(1)==imagen(2)){
          Minicio=Minicio+3;
          moneda(Minicio);
        }
      }

      /*Funciones llamadas segun la comprobacion de comprobarTirada()*/
      function ganar(){
        document.querySelector("#velo").style="display:flex";
        document.querySelector("#mensaje").innerHTML='<img src="img/ice.png"> Has ganado tres <img src="img/ficha.png">fichas extra!<img src="img/ice.png">' 
        document.querySelector("#mensaje").style="padding-top:5%;";
        document.getElementById("audio3").play();
      }

      function perder(){
        document.querySelector("#dinero").innerHTML=`0`;
        document.querySelector("#velo").style="display:flex";
        document.querySelector("#mensaje").innerHTML='<img src="img/pokedoll.png"> Te has quedado sin fichas<img src="img/pokedoll.png">' 
        document.querySelector("#mensaje").style="padding-top:5%;";
        document.querySelector("#cuadro_mensaje").style="background-image: url(img/fondolose.png);";
        document.getElementById("audio2").play();
 
      }

      /*Funcion principal que comprueba el resultado de las tiradas */
      function comprobarTirada(){
        Minicio--;
        moneda(Minicio);
        if(imagen(0)==imagen(1) && imagen(1)==imagen(2)){
          ganar();
        }
        else if(Minicio<0){
          perder();
        }
      }

      function imagen(n){
        return document.querySelectorAll(".ventana")[n].innerHTML;
      }

      function palabra(algo){
        Array.from(algo);
        let i= false;
        let pokes="";
        for(let k=0; k<algo.length; k++){
          if(algo[k]=="/"){
            i=true;
          }
          else if(i==true && algo[k]=="."){
            i=false;
          }
          else if(i==true){
            pokes= pokes+algo[k];
          }
        }
        return pokes;
      }
