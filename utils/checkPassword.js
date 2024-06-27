// utils/checkPassword.js

const checkPassword = (password) => {
    // Regular expressions for each password requirement
    const regexSpecialChar = /[@#$]/;
    const regexUpperCase = /[A-Z]/;
    const regexLowerCase = /[a-z]/;
    const regexNumber = /[0-9]/;
    const regexLength = /.{8,}/; // Minimum length of 8 characters
  
    // Check each requirement against the password
    const isLengthValid = regexLength.test(password);
    const hasLowerCase = regexLowerCase.test(password);
    const hasUpperCase = regexUpperCase.test(password);
    const hasNumber = regexNumber.test(password);
    const hasSpecialChar = regexSpecialChar.test(password);
  
    // Return an object indicating which criteria are met
    return {
      length: isLengthValid,
      lowercase: hasLowerCase,
      uppercase: hasUpperCase,
      number: hasNumber,
      specialChar: hasSpecialChar,
    };
  };
  
  module.exports = checkPassword;
  