# JS_Validation
A vanilla JS script to validate  forms. 

It uses the DOMContentLoaded event to set all up.


## How to Use


### Form Tag
In your form HTML, add the data-attribute data-validate="ok". You can also add a data-title="Some title or <h3>Title</h3>" to add a Title to the box. 
Your form tag should look like this: 
```
<form data-validate="ok" datat-tile="Some Title here">
```

### Input fields 
To make your fields required using this script, you must add the data-attribute data-required="Some text to show on the alert box". You can choose between: 
``` 
data-required="Some text" 
data-required-email="Some text when field is empty || Some text when email is invalid" 
data-required-function="someFunction(this); Some text when field is empty or unchecked || Some text when function returns false"
``` 

In the end, your input tag should like this: 
```
<input type="text" data-required="Some text to show on Box" name="fieldName" />
```

PLEASE NOTE: the ``` data-required-function ``` only accepts the field as argument. So if you need some other param on your function, add it to your input field and recover it from there on your function. 
