/**
 * Validation Script by Matheus Marques
 * Check out at github: https://github.com/Matheus2212/JS_Validation
 * 
 * Changelog:
 * 2021-02-19 -> Script created (work in progress)
 */



function Box(object) {
  var box = {
    box: null,
    createMessages: function (messages) {},
    createButtons: function (object) {},
    createBox: function () {
      var div = document.createElement("div"),
        id = this.newId(7);
      div.classList.add("validation");
      div.setAttribute("id", id);
      var HTML =
        '<div class="validationBox"><div><div class="validationHeader">{{validationHeader}}</div><div class="validationBody">{{validationBody}}</div><div class="validationFooter">{{validationFooter}}</div></div></div>';
    },
    open: function (object) {
      alert(object.join("\n"));
    },
    newId: function (length) {
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
    init: function (object) {
      this.open(object);
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
