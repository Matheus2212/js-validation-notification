# JS Validation, Captcha and Alert Script
A vanilla JS script to validate forms on the Front-end (built to be used on front-end, for the user that doesn't have development skills - please add validation to your backend as well). It is based on Google's Material Design. 

First it was using the DOMContentLoaded event to set all up, but that doesn't work nicely on AJAX/single-page applications, so I've changed to use a "manual trigger" for the script. 

---


## How to Use


### Form Tag

In your form HTML, add the data-attribute data-validate="ok". You can also add a data-title="Some title" attribute to add a Title to the box (optional), and a data-callback on the form, in case it returns `false` or `true` (state) (optional). Please note: The callback function should be in the Window scope. 

Your form tag would look like this: 
```html
<form data-validate="ok" data-callback="true, myCallback" data-title="Some Title here" name="someFormName">
  ...
</form>
```

### Input fields 

To make your fields required using this script, you must add the data-attribute data-required="Some text to show on the alert box". You can choose between: 

* data-required: Accepts only the text that should display when the field is empty/unchecked;
* data-required-email: Accepts the text message when the field is empty and when the email is invalid;
* data-required-phone: Accepts the text message when the field is empty and when the phone is invalid;
* data-required-cpf: Accepts the text message when the field is empty and when the cpf is invalid;
* data-required-cnpj: Accepts the text message when the field is empty and when the cnpj is invalid;
* data-required-cep: Accepts the text message when the field is empty and when the cep is invalid;
* data-required-function: Accepts the function, giving this = input field, the message when field is empty and the message when the function returns false.

The syntax are:
``` 
data-required="Some text" 
data-required-email="Some text when field is empty || Some text when email is invalid" 
data-required-password="Some text when field is empty || Some text when password is not so secure" 
data-required-phone="Some text when field is empty || Some text when phone is invalid" 
data-required-cpf="Some text when field is empty || Some text when cpf is invalid" 
data-required-cnpj="Some text when field is empty || Some text when cnpj is invalid" 
data-required-cep="Some text when field is empty || Some text when cep is invalid" 
data-required-url="Some text when field is empty || Some text when url is invalid" 
data-required-phone="Some text when field is empty || Some text when phone is invalid" 
data-required-function="someFunction(this); Some text when field is empty or unchecked || Some text when function returns false"
(in development) data-required-if="I'm still trying to define a syntax here": It will make the field required, only if a certain condition is attended to. 
``` 

In the end, your input tag should like this: 
```html
<input type="text" data-required="Some text to show on Box" name="fieldName" />
```

PLEASE NOTE: the ``` data-required-function ``` only accepts the self input as argument. So if you need some other param on your function, add it to your input field and recover it on the function. 

### JS Code

Add the following code near to the `</body>` tag: 

```html
<script src="validation.functions.js" type="text/javascript" onload="Validation.init()"></script>
```
PLEASE NOTE: The above code line will automatically trigger the `Validation.init()` method function. This function is the one responsible to bind the validation to the forms.

You can also create a custom box anytime you like, for whatever objective you're aiming. The Box function receives an Object, and returns itself on the button actions. 

The Object propertis are: 
* title: The title that will show up on the box header. It is optional;
* messages: The messages of the box. It can be a String or an Array of messages;
* buttons: It is the buttons that you want to be on the box. It uses {buttonKey:"Button Text"} syntax;
* actions: It is the actions that your buttons will do. It uses {buttonKey: buttonAction} syntax. The "action" is actually a callback, and the box gives itself as a parameter to the callback.


```javascript
Box(
  {
    title: "Title is optional. You can ommit it on your <form> tag",
    messages: "It can be a string",
    //messages: ["or an array", "of messages"],
    buttons: {buttonKey:"Button Text",otherButtonKey:"Other Button Text"},
    actions: {buttonKey: buttonAction, otherButtonKey:otherButtonAction}
  }
)
```

PLEASE NOTE: When you're binding an action to the button, the script will give the current box as a parameter. Here's an example:

```javascript
Box(
  {
    title:"Can you see?",
    messages: "Just an example",
    buttons: {ok:"OK"},// please note the key for the button
    actions:{
      ok:function(box){ // this action will be binded to the "ok" key button
        console.log(box); // it will show the box instance
        box.close(); // it will close the box
      }
    }
  }
)
```

### Example FORM in HTML
```html 
<form data-validate="ok" data-title="My Box Title Text here">
  
  <input type="text" name="name" data-required="My required text message for this input here" />
  <input type="text" name="email" data-required-email="My text message when field is empty || My text message when email is invalid" />
  <input type="email" name="phone" data-required-phone="My text message when field is empty || My text message when phone is invalid" />
  
  <input type="radio" name="radiobox" value="true" data-required="My text when this or none of the radios within same name are not checked" />
  <input type="radio" name="radiobox" value="false" data-required="My text when this or none of the radios within same name are not checked" />
  
  <input type="checkbox" name="checkbox" value="false" data-minimum="2" data-required="My text when this or none of the checkboxes within same name are not checked or doesn't match the minimum number of checked inputs" />
  <input type="checkbox" name="checkbox" value="false" data-minimum="2" data-required="My text when this or none of the checkboxes within same name are not checked or doesn't match the minimum number of checked inputs" />
  
  <input type="submit" value="Submit" />
  
</form>
```


---

### Security Key

One more feature of the script, is a random Security Key generator. It creates a cookie within the generated security key for validation in both frontend and backend. 

To use security Key, insert on your form the code below:

```html
<!-- security key wrapper -->
<div>
  <!-- security key node -->
        <div id="securityKey"></div>
        <!-- security key node -->
      </div>
      <!-- security key wrapper -->

      <!-- security key "new key" button -->
      <button type="button" onclick='Validation.securityKey("securityKey","renew");'>New key</button>
      <!-- security key "new key" button -->

      <!-- security key function call -->
      <script>
        setTimeout(function () {
          Validation.securityKey("securityKey");
        }, 300);
      </script>
      <!-- security key function call -->
      
      <!-- security key input -->
      <input type="text" placeholder="Security Key" name="securityKey" data-required-securityKey="Please inform the security Key || The security key is invalid"/>
      <!-- security key input -->

```

I'm still trying to find a better way to call this securityKey function though... any suggestions? :-)

PLEASE NOTE: The `securityKey` function gives the `validationSecurityKey` name for the cookie. So, you ***CAN'T HAVE MORE THAN ONE SECURITY KEY INPUT ON THE SAME PAGE***. You'll have to build a workaround with this.

---
#### And that's it! 

Just load the JS file and the CSS file anywhere on your page and you're good to go. 
