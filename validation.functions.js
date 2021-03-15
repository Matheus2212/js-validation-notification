/**
 * Validation Script by Matheus Marques
 * Check out at github: https://github.com/Matheus2212/JS_Validation
 *
 * [CHANGELOG]
 * 2021-02-19 -> Script created (work in progress)
 * 2021-02-24 -> Developed the Box function and Object, using a Object as parameter to make it work. The parameter Object should be like: {title:"optional",message:"string or array",buttons:{key:'Text',otherKey:'Other text'}, actions: {keyKey:action(), otherKeyKey:otherAction()}}
 * 2021-02-25 -> Created the BoxMessage fast forward function to display messages using the Box function.
 * 2021-03-03 -> Created button click effect Material design look a like (visible when the box is not closed after the click).
 * 2021-03-04 -> Created securityKey function and validateSecurityKey function. Inserted required type: "data-required-securityKey".
 * 2021-03-05 -> Created validateCPF, validateCNPJ, validateCEP and validateURL functions. Inserted required types: data-required-cpf, data-required-cnpj, data-required-cep, data-required-url.
 * 2021-03-08 -> Added a element parameter to the Validation.init() method. It will search for forms inside the given element - usefull for AJAX loaded forms.
 */

function Box(object) {
  var box = {
    /** It is the Box itself */
    box: null,

    /** It will generate a new HTML div tag to be the Box */
    createBox: function () {
      var div = document.createElement("div"),
        id = this.newId();
      div.classList.add("validation");
      div.setAttribute("id", id);
      var HTML =
        '<div class="validationBox"><div><a id="validationClose"></a><div class="validationHeader">{{validationHeader}}</div><div class="validationBody">{{validationBody}}</div><div class="validationFooter">{{validationFooter}}</div></div></div>';
      div.innerHTML = HTML;
      this.box = div;
    },

    /** It will create the Box header, with a title or without a title */
    createHeader: function (title) {
      if (typeof title == "undefined") {
        this.box.innerHTML = this.box.innerHTML.replace(
          "{{validationHeader}}",
          ""
        );
      } else {
        var header = document.createElement("span");
        header.classList.add("validationTitle");
        header.innerText = title;
        this.box.innerHTML = this.box.innerHTML.replace(
          "{{validationHeader}}",
          header.outerHTML
        );
      }
    },

    /** It will create the Box body, with messages */
    createBody: function (messages) {
      var wrapper = document.createElement("div");
      if (typeof messages == "object") {
        var keys = Object.keys(messages);
        for (var i = 0; i < keys.length; i++) {
          var message = document.createElement("span");
          message.innerText = messages[i];
          wrapper.append(message);
        }
      } else {
        var message = document.createElement("span");
        message.innerText = messages;
        wrapper.append(message);
      }
      this.box.innerHTML = this.box.innerHTML.replace(
        "{{validationBody}}",
        wrapper.outerHTML
      );
    },

    /** It will create the Box footer, with buttons */
    createFooter: function (buttons) {
      var keys = Object.keys(buttons),
        wrapper = document.createElement("div"),
        buttonIds = {};
      for (var i = 0; i < keys.length; i++) {
        var button = document.createElement("a"),
          newId = this.newId();
        buttonIds[keys[i]] = newId;
        button.setAttribute("id", newId);
        button.classList.add("validationButton");
        button.innerText = buttons[keys[i]];
        wrapper.append(button);
      }
      this.box.innerHTML = this.box.innerHTML.replace(
        "{{validationFooter}}",
        wrapper.outerHTML
      );
      return buttonIds;
    },

    /** It will apply the effect when the button is clicked */
    createFooterEfect: function (button) {
      var span = document.createElement("span");
      span.classList.add("materialEffect");

      button.append(span);
      setTimeout(function () {
        span.remove();
      }, 140);
    },

    /** It will apply the actions to the buttons of the Box */
    createActions: function (buttonIds, actions) {
      var keys = Object.keys(buttonIds),
        box = this;
      for (var i = 0; i < keys.length; i++) {
        var button = document.getElementById(buttonIds[keys[i]]);
        var action = actions[keys[i]];
        button.addEventListener("click", function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
          action(box);
          box.createFooterEfect(this);
        });
      }
      this.ESCClose(box);
    },

    /** It will append the current Box on the page */
    open: function () {
      var box = this,
        id = box.box.getAttribute("id");
      document.getElementsByTagName("body")[0].append(box.box);
      boxHTML = document
        .getElementById(id)
        .getElementsByClassName("validationBox")[0]
        .getElementsByTagName("div")[0];
      boxHTML.style.marginTop = "-" + boxHTML.clientHeight / 2 + "px";
      document
        .getElementById("validationClose")
        .addEventListener("click", function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
          box.close();
        });
      document.activeElement.blur();
      var buttons = boxHTML.getElementsByTagName("a");
      buttons[1].focus();
    },

    /** It will destroy the box instance */
    close: function () {
      var box = this,
        id = box.box.getAttribute("id"),
        elm = document.getElementById(id);
      elm.classList.add("validationRemove");
      setTimeout(function () {
        elm.remove();
        window.removeEventListener("keydown", window.validateCheck, false);
        delete window.validateCheck;
      }, 100);
    },

    /** It is the method that will call the method which closes the Box Instance when the ESC key is pressed */
    ESCClose: function () {
      box = this;
      window.validateCheck = function (key) {
        if (key.key == "Escape" || key.keyCode == 27) {
          box.close();
          window.removeEventListener("keydown", window.validateCheck, false);
        }
      };
      window.addEventListener("keydown", window.validateCheck);
    },

    /** It is the method that genereates a new ID based on the length passed as parameter */
    newId: function (length) {
      if (typeof length == "undefined") {
        length = 8;
      }
      var result = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },

    /* It is the method called by function Box, to create a new Box instance on the window */
    init: function (object) {
      this.createBox();
      if (typeof object.title !== "undefined") {
        this.createHeader(object.title);
      } else {
        this.createHeader("Warning");
      }
      if (typeof object.messages !== "undefined") {
        this.createBody(object.messages);
      } else {
        this.createBody("Please check the form");
      }
      if (typeof object.buttons !== "undefined") {
        var buttonIds = this.createFooter(object.buttons);
      } else {
        var buttonIds = this.createFooter({ ok: "OK" });
      }
      this.open();
      if (typeof object.actions !== "undefined") {
        this.createActions(buttonIds, object.actions);
      } else {
        this.createActions(buttonIds, {
          ok: function (box) {
            box.close();
          },
        });
      }
    },
  };

  box.init(object);
}

/** Fast display function to show messages using the Box function */
function BoxMessage(messages, title) {
  var obj = {};
  obj.messages = messages;
  if (typeof title !== "undefined") {
    obj.title = title;
  }
  Box(obj);
}

/** This is the whole validation proccess */
const Validation = {
  /** Will check if actual element is of an valid tag */
  isValidTag: function (element) {
    var tag = element.tagName.toLowerCase();
    var validInputs = ["input", "select", "textarea"];
    for (var iterate = 0; iterate < validInputs.length; iterate++) {
      if (tag == validInputs[iterate]) {
        return true;
      }
    }
    return false;
  },

  /** Will check if actual element is a proper input field (not button or submit) */
  isValidInputType: function (element) {
    var type = element.getAttribute("type").toLowerCase();
    var types = [
      "hidden",
      "email",
      "password",
      "text",
      "radio",
      "checkbox",
      "range",
      "file",
      "color",
    ];
    for (var iterate = 0; iterate < types.length; iterate++) {
      if (type == types[iterate]) {
        return true;
      }
    }
    return false;
  },

  /** Will check if actual element is/isn't required */
  isRequired: function (element) {
    var elements = this.getRequiredTypes;
    for (var iterate = 0; iterate < elements.length; iterate++) {
      var check = element.getAttribute(elements[iterate]);
      if (typeof check !== "undefined" && check !== null) {
        return true;
      }
    }
    return false;
  },

  /** Will return the requireds types */
  getRequiredTypes: function () {
    return [
      "data-required",
      "data-required-if",
      "data-required-email",
      "data-required-function",
      "data-required-securityKey",
      "data-required-cpf",
      "data-required-cnpj",
      "data-required-cep",
      "data-required-url",
    ];
  },

  /** Will return the type of the requirement of the field */
  getRequiredType: function (element) {
    var type = "message";
    var elements = this.getRequiredTypes();
    for (var iterate = 0; iterate < elements.length; iterate++) {
      var check = element.getAttribute(elements[iterate]);
      if (typeof check !== "undefined" && check !== null) {
        if (elements[iterate] == "data-required") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "message";
        }
        if (elements[iterate] == "data-required-if") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "condition";
        }
        if (elements[iterate] == "data-required-email") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "email";
        }
        if (elements[iterate] == "data-required-function") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "function";
        }
        if (elements[iterate] == "data-required-securityKey") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "securityKey";
        }
        if (elements[iterate] == "data-required-cpf") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "cpf";
        }
        if (elements[iterate] == "data-required-cnpj") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "cnpj";
        }
        if (elements[iterate] == "data-required-cep") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "cep";
        }
        if (elements[iterate] == "data-required-url") {
          element.requiredAttr = element.getAttribute(elements[iterate]);
          type = "url";
        }
      }
    }
    return type;
  },

  /** It gets the message to be shown using the input context to set the message */
  getRequiredMessage: function (element, type) {
    var message = "";
    if (type == "message") {
      message = element.getAttribute("data-required");
    }
    if (type == "condition") {
      console.log("vish...");
    }
    if (type == "function") {
      var messages = element
        .getAttribute("data-required-function")
        .split(";")[1]
        .split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }
      var tag = element.tagName.toLowerCase(),
        type = element.getAttribute("type");
      if (tag == "select" && this.trim(element.value) == "") {
        message = messages[0];
      } else if (tag == "textarea" && this.trim(element.value) == "") {
        message = messages[0];
      } else if (
        tag == "input" &&
        (type == "radio" || type == "checkbox") &&
        !element.checked
      ) {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    if (type == "email") {
      var messages = element.getAttribute("data-required-email").split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }

      if (this.trim(element.value) == "") {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    if (type == "securityKey") {
      var messages = element
        .getAttribute("data-required-securityKey")
        .split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }

      if (this.trim(element.value) == "") {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    if (type == "cpf") {
      var messages = element.getAttribute("data-required-cpf").split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }

      if (this.trim(element.value) == "") {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    if (type == "cnpj") {
      var messages = element.getAttribute("data-required-cnpj").split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }

      if (this.trim(element.value) == "") {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    if (type == "cep") {
      var messages = element.getAttribute("data-required-cep").split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }

      if (this.trim(element.value) == "") {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    if (type == "url") {
      var messages = element.getAttribute("data-required-url").split("||");
      for (var iterate = 0; iterate < messages.length; iterate++) {
        messages[iterate] = this.trim(messages[iterate]);
      }

      if (this.trim(element.value) == "") {
        message = messages[0];
      } else {
        message = messages[1];
      }
    }
    return message;
  },

  /** Validate messages to be added on the array */
  validateMessageInsertion: function (message, messages) {
    for (var iterate = 0; iterate < messages.length; iterate++) {
      if (messages[iterate] == message) {
        return false;
      }
    }
    return true;
  },

  /** Validate required input fields with basic validation */
  validateBasic: function (element) {
    var tag = element.tagName.toLowerCase(),
      type = element.getAttribute("type");
    if (type == "radio") {
      var name = element.getAttribute("name");
      if (/\[/.test(name)) {
        name = name.split("[")[0];
      }
      var radios = document.getElementsByName(name);
      for (var iterate = 0; iterate < radios.length; iterate++) {
        if (radios[iterate].checked) {
          return true;
        }
      }
      return false;
    }
    if (type == "checkbox") {
      var name = element.getAttribute("name"),
        qty = 1;
      if (/\[/.test(name)) {
        name = name.split("[")[0];
      }
      var checkboxes = document.getElementsByName(name),
        checked = 0;
      for (var iterate = 0; iterate < checkboxes.length; iterate++) {
        var check = checkboxes[iterate].getAttribute("data-minimum");
        if (typeof check !== "undefined" && check !== false && check !== null) {
          qty = parseInt(check);
        }
        if (checkboxes[iterate].checked) {
          checked++;
        }
      }
      if (checked >= qty) {
        return true;
      }
      return false;
    }
    if (tag == "select") {
      if (this.trim(element.value) !== "") {
        return true;
      }
      return false;
    }
    if (tag == "textarea" || type !== "radio" || type !== "checkbox") {
      if (this.trim(element.value) !== "") {
        return true;
      }
      return false;
    }
  },

  /** Validate required input fields with  simple conditions */
  validateCondition: function (element) {
    var strings = element.getAttribute("data-required-if").split(";"),
      condition = this.trim(strings[0]),
      message = this.trim(strings[1]);
    // in progress
  },

  /** Validate required input fields with email function */
  validateEmail: function (element) {
    var email = element.value,
      user = email.substring(0, email.indexOf("@")),
      domain = email.substring(email.indexOf("@") + 1, email.length);
    if (
      user.length >= 1 &&
      domain.length >= 3 &&
      user.search("@") === -1 &&
      domain.search("@") === -1 &&
      user.search(" ") === -1 &&
      domain.search(" ") === -1 &&
      domain.search(".") !== -1 &&
      domain.indexOf(".") >= 1 &&
      domain.lastIndexOf(".") < domain.length - 1
    ) {
      return true;
    } else {
      return false;
    }
  },

  /** Validate required input fields with email function */
  validateSecurityKey: function (element) {
    var key = element.value,
      generatedKey = "",
      nameEQ = "validationSecurityKey=",
      ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) {
        generatedKey = c.substring(nameEQ.length, c.length);
      }
    }
    if (key !== "" && generatedKey !== "" && key == generatedKey) {
      return true;
    } else {
      return false;
    }
  },

  /** Validate required input fields with CPF function */
  validateCPF: function (element) {
    if (
      /[0-9]{3}\.[0-9]{3}\.[0-9]{3}\-[0-9]{2}/.test(element.value) ||
      element.value.replace(/[^0-9]/g, "").length == 11
    ) {
      return true;
    } else {
      return false;
    }
  },

  /** Validate required input fields with CNPJ function */
  validateCNPJ: function (element) {
    if (
      /[0-9]{2}\.[0-9]{3}\.[0-9]{3}\/[0-9]{4}\-[0-9]{2}/.test(element.value) ||
      element.value.replace(/[^0-9]/g, "").length == 14
    ) {
      return true;
    } else {
      return false;
    }
  },

  /** Validate required input fields with CEP function */
  validateCEP: function (element) {
    if (
      /[0-9]{2}\.[0-9]{3}\-[0-9]{3}/.test(element.value) ||
      element.value.replace(/[^0-9]/g, "").length == 8
    ) {
      return true;
    } else {
      return false;
    }
  },

  /** Validate required input fields with URL function */
  validateURL: function (element) {
    if (
      /(http(s)?\:\/\/)?(www\.)?([a-zA-Z0-9]+\.[0-9a-zA-Z]{2,})([a-zA-Z0-9]{2,})?/.test(
        element.value
      )
    ) {
      return true;
    } else {
      return false;
    }
  },

  /** Validate required input fields with functions */
  validateFunction: function (element) {
    var required = element.getAttribute("data-required-function"),
      aux = required.split(";")[0].split("("),
      func = aux[0];
    if (typeof window[func] == "function") {
      var check = true;
      if (!window[func](element)) {
        element.setAttribute("data-status", "0");
        check = false;
      } else {
        element.removeAttribute("data-status");
      }
      return check;
    }
    return false;
  },

  /** This function generates a random number between min and max */
  getRandomNumber: function (min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
  },

  /** This function generates a random hex color */
  getRandomColor: function () {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },

  /** Will make text available to HTML entity - it don't depends on page charset */
  toHTMLFormat: function (array) {
    if (typeof array == "object") {
      var keys = Object.keys(array);
      for (var iterate = 0; iterate < keys.length; iterate++) {
        array[keys[iterate]] = array[keys[iterate]].replace(
          /[\u00A0-\u9999<>\&]/g,
          function (i) {
            return "&#" + i.charCodeAt(0) + ";";
          }
        );
      }
      return array;
    } else {
      return array.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
        return "&#" + i.charCodeAt(0) + ";";
      });
    }
  },

  /** Remove empty spaces at the start and end of the string (trim polyfill) */
  trim: function (string) {
    return string.replace(/^\s+|\s+$/g, "");
  },

  /** Will generate a security key on the page */
  securityKey: function (elmId, renew) {
    var element = document.getElementById(elmId);
    if (typeof element !== "undefined") {
      if (typeof renew !== "undefined") {
        var parent = element.parentNode,
          classes = element.classList,
          data = element.dataset;
        parent.innerHTML = "";
        var img = document.createElement("img");
        img.setAttribute("id", elmId);
        for (var i = 0; i < classes.length; i++) {
          img.classList.add(classes[i]);
        }
        img.dataset = data;
        parent.append(img);
        element = img;
      }
      element.parentNode.style.position = "relative";
      var backgrounds = [
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,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",
        "data:image/jpeg;base64,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",
      ];
      var key = "";
      var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < 6; i++) {
        key += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      key = key.split("");
      for (var i = 0; i < key.length; i++) {
        var span = document.createElement("span");
        span.innerText = key[i];
        span.style.color = this.getRandomColor();
        span.style.position = "absolute";
        span.style.top = "10px";
        span.style.fontSize = "21px";
        span.style.fontWeight = "bold";
        span.style.left = 33.333 * i + 10 + "px";
        span.style.transform =
          "rotate(" + this.getRandomNumber(-30, 30) + "deg)";
        span.style.webkitTransform =
          "rotate(" + this.getRandomNumber(-30, 30) + "deg)";
        span.style.mozTransform =
          "rotate(" + this.getRandomNumber(-30, 30) + "deg)";
        span.style.msTransform =
          "rotate(" + this.getRandomNumber(-30, 30) + "deg)";
        span.style.oTransform =
          "rotate(" + this.getRandomNumber(-30, 30) + "deg)";
        span.style.webkitTextShadow = "0 0 2px rgba(0,0,0,0.5)";
        span.style.mozTextShadow = "0 0 2px rgba(0,0,0,0.5)";
        span.style.msTextShadow = "0 0 2px rgba(0,0,0,0.5)";
        span.style.oTextShadow = "0 0 2px rgba(0,0,0,0.5)";
        span.style.textShadow = "0 0 2px rgba(0,0,0,0.5)";
        element.parentNode.append(span);
      }
      var date = new Date();
      date.setTime(date.getTime() + 1 * 24 * 60 * 60 * 1000);
      document.cookie =
        "validationSecurityKey" +
        "=" +
        key.join("") +
        "; expires=" +
        date.toUTCString() +
        "; path=/";
      /*element.setAttribute("src", backgrounds[this.getRandomNumber(0, 3)]);
      element.style.backgroundRepeat = "repeat";
      element.style.backgroundSize = "100%";
      element.style.width = "200px";
      element.style.overflow = "hidden";
      element.style.height = "40px";*/
      element.parentNode.style.backgroundImage =
        "url('" + backgrounds[this.getRandomNumber(0, 3)] + "')";
      element.parentNode.style.backgroundRepeat = "repeat";
      element.parentNode.style.width = "200px";
      element.parentNode.style.overflow = "hidden";
      element.parentNode.style.height = "40px";
    }
  },

  /** This is the function responsible to check if the form is valid */
  validate: function (evt) {
    var elements = this.elements,
      messages = new Array();
    this.validated = false;
    for (var iterate = 0; iterate < elements.length; iterate++) {
      var element = elements[iterate];
      if (
        Validation.isValidTag(element) ||
        (Validation.isValidInputType(element) && Validation.isRequired(element))
      ) {
        var requiredType = Validation.getRequiredType(element);
        switch (requiredType) {
          case "function":
            // function validation
            if (!Validation.validateFunction(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "condition":
            // condition validation (in progress)
            if (!Validation.validateCondition(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "email":
            // email validations
            if (!Validation.validateEmail(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "securityKey":
            // securityKey validations
            if (!Validation.validateSecurityKey(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "cpf":
            // cpf validations
            if (!Validation.validateCPF(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "cnpj":
            // cnpj validations
            if (!Validation.validateCNPJ(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "cep":
            // cep validations
            if (!Validation.validateCEP(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          case "url":
            // url validations
            if (!Validation.validateURL(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
          default:
            // basic validation
            if (!Validation.validateBasic(element)) {
              var message = Validation.getRequiredMessage(
                element,
                requiredType
              );
              if (Validation.validateMessageInsertion(message, messages)) {
                messages.push(message);
              }
            }
            break;
        }
      }
    }
    if (messages.length > 0) {
      var obj = {
        messages: messages,
      };
      if (typeof this.parameters.title !== "undefined") {
        obj.title = Validation.toHTMLFormat(this.parameters.title);
      }
      Box(obj);
      evt.preventDefault();
      return false;
    } else {
      this.validated = true;
    }
  },

  /** Will prevent any required form to be submitted */
  preventSend: function (evt) {
    evt.preventDefault();
    return false;
  },

  /**
   * It will bind the validation proccess to the required forms
   */
  init: function (element) {
    var forms = "";
    if (typeof element == "undefined") {
      forms = document.getElementsByTagName("form");
    } else {
      forms = element.getElementsByTagName("form");
    }
    for (var iterate = 0; iterate < forms.length; iterate++) {
      var form = forms[iterate],
        dataset = form.dataset;
      if (
        typeof form.parameters !== "undefined" ||
        typeof dataset.validate !== "undefined"
      ) {
        form.addEventListener("submit", this.preventSend); // will prevent submits
        if (typeof dataset !== "undefined") {
          var parameters = {},
            data = Object.keys(dataset);
          for (
            var datasetIterate = 0;
            datasetIterate < data.length;
            datasetIterate++
          ) {
            parameters[data[datasetIterate]] = dataset[data[datasetIterate]];
            form.removeAttribute("data-" + data[datasetIterate]);
          }
          parameters.state = true;
          form.parameters = parameters;
        } else if (typeof form.parameters !== "undefined") {
          var parameters = form.parameters;
        }
        form.addEventListener("submit", this.validate); // real submit
        form.removeEventListener("submit", this.preventSend, false); // remove previous prevented submit
      }
    }
  },
};
