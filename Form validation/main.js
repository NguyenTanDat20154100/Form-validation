//Đối tượng `Validator`
function Validator (options){

    //hàm thực hiện validate
    function Validate(rule, inputElement){
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        console.log(errorMessage);

        if(errorMessage){
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        }else{
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    //Lấy element của form cần validate
    var formElement = document.querySelector(options.form);

    if(formElement){
        options.rules.forEach(rule => {

            var inputElement = formElement.querySelector(rule.selector);

            console.log(inputElement);

            if(inputElement){
                //xử lý trường hợp blur ra input
                inputElement.onblur = function(){
                    Validate(rule, inputElement);
                }

                //xử lý trường hợp khi người dùng nhập vào input
                inputElement.oninput = function(){
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    console.log(inputElement.value)
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

Validator.isRequired = function(selector){
    return{
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : "Vui lòng nhập trường này!!!";
        }
    }
}

Validator.isEmail = function(selector){
    return{
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email."; 
        }
    }
}

Validator.isLength = function(selector,min){
    return{
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự.`; 
        }
    }
}