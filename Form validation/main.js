//Đối tượng `Validator`
function Validator (options){
    var selectorRules = {};
    
    //hàm thực hiện validate
    function Validate(rule, inputElement){
        
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        //yều cầu khi lỗi
        var errorMessage;

        //Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];

        for(var i = 0; i < rules.length; i++){
            errorMessage = rules[i](inputElement.value);
            // console.log(errorMessage);
            // dùng if errorMessage để có thể khiểm tra từng tường hợp rule
            if(errorMessage) break;
        }

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
    

    // console.log(formElement);
    // console.log(options.rules);

    //nếu là form
    if(formElement){

        //khi submit form
        formElement.onsubmit = function(e){
            e.preventDefault();
            options.rules.forEach(rule =>{
                var inputElement = formElement.querySelector(rule.selector);
                Validate(rule, inputElement);
            })
        }

        //Lặp qua mỗi rule và xử lý (blur, input,...)
        options.rules.forEach(rule => {

            
            //inputElement: #fullname, #email, #password
            var inputElement = formElement.querySelector(rule.selector);
            // console.log(rule.test);
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }else{
                selectorRules[rule.selector] = [rule.test];
            }
            
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


//rule fullname
Validator.isRequired = function(selector){
    return{
        selector: selector,
        test: function(value){
            return value.trim() ? undefined : "Vui lòng nhập trường này!!!";
        }
    }
}

//rule email
Validator.isEmail = function(selector){
    return{
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email."; 
        }
    }
}

//rule password
Validator.isLength = function(selector,min){
    return{
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} kí tự.`; 
        }
    }
}

//rule password_confirmation
Validator.isConfirmed = function(selector, getConfirmValue, message){
    return{
        selector: selector,
        test: function(value){
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không trùng khớp.'; 
        }
    }
}