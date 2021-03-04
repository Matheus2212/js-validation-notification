/**
 * Validation Script by Matheus Marques
 * Check out at github: https://github.com/Matheus2212/JS_Validation
 *
 * Changelog:
 * 2021-02-19 -> Script created (work in progress)
 * 2021-02-24 -> Developed the Box function and Object, using a Object as parameter to make it work. The parameter Object should be like: {title:"optional",message:"string or array",buttons:{key:'Text',otherKey:'Other text'}, actions: {keyKey:action(), otherKeyKey:otherAction()}}
 * 2021-02-25 -> Created the BoxMessage fast forward function to display messages using the Box function.
 * 2021-03-03 -> Created button click effect (visible when the box is not closed after the click).
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

  /** This is the function responsible to check if the form is valid */
  validate: function (evt) {
    var elements = this.elements,
      messages = new Array();
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
        obj.title = this.parameters.title;
      }
      Box(obj);
      evt.preventDefault();
      return false;
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
  init: function () {
    var forms = document.getElementsByTagName("form");
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
  }
};
