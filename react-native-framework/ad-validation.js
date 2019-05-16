import AdLocal from "./ad-localization";

export default class AdValidation {
  static buildValidationString(arr) {
    let rv = [];
    let l = arr.length;
    for (let i = 0; i < l; i++) {
      let a = arr[i];
      if (typeof a === "string") rv.push(a.trim());
      else if (typeof a === "object") rv.push(AdLocal.str(a.str).trim());
    }
    return rv.join(" ");
  }

  static _requiredField(title) {
    return [title, { str: "fieldRequired" }];
  }

  static _invalidEmail(title) {
    return [{ str: "invalidEmail" }];
  }

  static _minLength(title, minValue) {
    return [title, { str: "fieldMin1" }, minValue, { str: "fieldMin2" }];
  }

  static _invalidPhone(title) {
    return [{ str: "invalidPhone" }];
  }

  static _customMessage(title) {
    return [title];
  }

  static sameAsError(title) {
    return [title, { str: "isWrong" }];
  }

  static validate(value, validation, title) {
    if (typeof value === "object") {
      if (validation === "required" && value.value === null) {
        return AdValidation._requiredField(title);
      } else {
        return true;
      }
    }

    if (typeof value !== "string") throw "AdValidation Input Type Error";

    let validators = validation.split(",");

    const vl = validators.length;
    const emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    for (let i = 0; i < vl; i++) {
      let validator = validators[i];

      let arr = validator.split("|");

      if (arr.length > 1) {
        let l = arr.length;
        for (let i = 0; i < l; i++) {
          if (AdValidation.doValidation(arr[i], value, title) === true) {
            return true;
          }
        }
        return AdValidation._invalidPhone(title);
      } else {
        return AdValidation.doValidation(validator, value, title);
      }
    }

    return true;
  }

  static doValidation(validator, value, title) {
    switch (validator) {
      case "required":
        if (value === "") {
          return AdValidation._requiredField(title);
        }
        break;
      case "email":
        if (!emailRe.test(String(value).toLowerCase())) {
          return AdValidation._invalidEmail(title);
        }
        break;
      case "phone":
        if (
          value.length > 15 ||
          value.length < 10 ||
          /[^0-9]/.test(value) === true
        ) {
          return AdValidation._invalidPhone(title);
        }
        break;
      case "on":
        if (value === "") {
          return AdValidation._customMessage(title);
        }
    }

    if (validator.indexOf("min:") === 0) {
      let minValue = Number(validator.split(":")[1]);

      if (value.length < minValue) {
        return AdValidation._minLength(title, minValue);
      }
    }

    return true;
  }
}
