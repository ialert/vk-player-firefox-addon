(function(APP) {
    "use strict";

    const button = false;

    window.onload = function() {

        const button = document.getElementById('auth-button');

        if(button) {

            button.addEventListener("click",openAuthTab);
        }
    }

    function openAuthTab() {

        self.port.emit("openAuthTab");
    }


})(window);