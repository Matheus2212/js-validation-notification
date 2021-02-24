/**
 * Validation Script by Matheus Marques
 * Check out at github: https://github.com/Matheus2212/JS_Validation
 *
 * Changelog:
 * 2021-02-19 -> Script created (work in progress)
 * 2021-02-24 -> Developed the Box function and Object, using a Object as parameter to make it work. The parameter Object should be like: {title:"optional",message:"string or array",buttons:{key:'Text',otherKey:'Other text'}, actions: {keyKey:action(), otherKeyKey:otherAction()}}
 */

function Box(object) {
  var box = {
    /** It is the Box itself */
    box: null,

    /** It will generate a new HTML div tag to be the Box */
    createBox: function () {
      var div = document.createElement("div"),
        id = this.newId(7);
      div.classList.add("validation");
      div.setAttribute("id", id);
      var HTML =
        '<div class="validationBox"><div><div class="validationHeader">{{validationHeader}}</div><div class="validationBody">{{validationBody}}</div><div class="validationFooter">{{validationFooter}}</div></div></div>';
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
          newId = this.newId(5);
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
        });
      }
      this.ESCClose(box);
    },

    /** It will append the current Box on the page */
    open: function () {
      var id = this.box.getAttribute("id");
      document.getElementsByTagName("body")[0].append(this.box);
      box = document
        .getElementById(id)
        .getElementsByClassName("validationBox")[0]
        .getElementsByTagName("div")[0];
      box.style.marginTop = "-" + box.clientHeight / 2 + "px";
      setTimeout(function () {
        document.activeElement.blur();
      }, 100);
    },

    /** It will destroy the box instance */
    close: function () {
      var id = this.box.getAttribute("id");
      var elm = document.getElementById(id);
      elm.classList.add("validationRemove");
      setTimeout(function () {
        elm.remove();
        var check = function (key) {
          if (key.key == "Escape" || key.keyCode == 27) {
            box.close();
            window.removeEventListener("keydown", check, false);
          }
        };
        window.removeEventListener("keydown", check, false);
      }, 140);
    },

    /** It is the method that will call the method which closes the Box Instance when the ESC key is pressed */
    ESCClose: function () {
      box = this;
      var check = function (key) {
        if (key.key == "Escape" || key.keyCode == 27) {
          box.close();
          window.removeEventListener("keydown", check, false);
        }
      };
      window.addEventListener("keydown", check);
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
        this.createHeader();
      }
      if (typeof object.messages !== "undefined") {
        this.createBody(object.messages);
      } else {
        this.createBody("Alerta!");
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

const validationHelper = {
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

  /** Remove empty spaces at the start and end of the string */
  trim: function (string) {
    return string.replace(/^\s+|\s+$/g, "");
  },
};

/** Will prevent any required form to be submitted */
function preventSend(evt) {
  evt.preventDefault();
  return false;
}

/** This function acts as a "bridge" with the const object validationHelper - will do the verifications and  assign it to the helper */
function validate(evt) {
  var elements = this.elements,
    messages = new Array();
  for (var iterate = 0; iterate < elements.length; iterate++) {
    var element = elements[iterate];
    if (
      validationHelper.isValidTag(element) ||
      (validationHelper.isValidInputType(element) &&
        validationHelper.isRequired(element))
    ) {
      var requiredType = validationHelper.getRequiredType(element);
      switch (requiredType) {
        case "function":
          // function validation
          if (!validationHelper.validateFunction(element)) {
            var message = validationHelper.getRequiredMessage(
              element,
              requiredType
            );
            if (validationHelper.validateMessageInsertion(message, messages)) {
              messages.push(message);
            }
          }
          break;
        case "condition":
          // condition validation (in progress)
          if (!validationHelper.validateCondition(element)) {
            var message = validationHelper.getRequiredMessage(
              element,
              requiredType
            );
            if (validationHelper.validateMessageInsertion(message, messages)) {
              messages.push(message);
            }
          }
          break;
        case "email":
          // email validations
          if (!validationHelper.validateEmail(element)) {
            var message = validationHelper.getRequiredMessage(
              element,
              requiredType
            );
            if (validationHelper.validateMessageInsertion(message, messages)) {
              messages.push(message);
            }
          }
          break;
        default:
          // basic validation
          if (!validationHelper.validateBasic(element)) {
            var message = validationHelper.getRequiredMessage(
              element,
              requiredType
            );
            if (validationHelper.validateMessageInsertion(message, messages)) {
              messages.push(message);
            }
          }
          break;
      }
    }
  }
  if (messages.length > 0) {
    Box(messages);
    evt.preventDefault();
    return false;
  }
}

/**
 * It will bind the validation proccess to the required forms
 */
function init() {
  var forms = document.getElementsByTagName("form");
  for (var iterate = 0; iterate < forms.length; iterate++) {
    var form = forms[iterate],
      dataset = form.dataset;
    if (
      typeof form.parameters !== "undefined" ||
      typeof dataset.validar !== "undefined"
    ) {
      form.addEventListener("submit", preventSend); // will prevent submits
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
      form.addEventListener("submit", validate); // real submit
      form.removeEventListener("submit", preventSend, false); // remove previous prevented submit
    }
  }
}

/**
 * It will start the validation script after the page is loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  init();
});
