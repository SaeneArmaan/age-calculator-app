const inputs = document.querySelectorAll("input");

const submitButton = document.querySelector(".submitBtn");
const resetButton = document.querySelector(".resetBtn");

const yearDisplay = document.querySelector(".yearDis");
const monthDisplay = document.querySelector(".monthDis");
const dayDisplay = document.querySelector(".dayDis");

const currDate = new Date();

const showError = (input, message) => {
  const label = input.previousElementSibling;
  const errorElement = input.nextElementSibling;
  errorElement.textContent = message;
  label.classList.add("errorLabel");
  input.classList.add("error");
};

const clearError = (input) => {
  const label = input.previousElementSibling;
  const errorElement = input.nextElementSibling;
  errorElement.textContent = "";
  label.classList.remove("errorLabel");
  input.classList.remove("error");
};

function isValidDate(day, month, year) {
  if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
    return day > 0 && day <= 31;
  }

  if ([4, 6, 9, 11].includes(month)) {
    return day > 0 && day <= 30;
  }

  if (month === 2) {
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    return isLeapYear ? day > 0 && day <= 29 : day > 0 && day <= 28;
  }

  return false;
}

function validateInputs(inputs) {
  const updatedValues = {};

  const status = Array.from(inputs).map((input) => {
    if (input.id === "day") {
      input.value = input.value.slice(0, 2);
      const day = input.value;

      if (!day) {
        showError(input, "This field is required");
        return false;
      } else if (day <= 0 || day > 31) {
        showError(input, "Please enter a vaid date");
        return false;
      }

      updatedValues.day = day;
      clearError(input);
    }

    if (input.id === "month") {
      input.value = input.value.slice(0, 2);
      const month = input.value;

      if (!month) {
        showError(input, "This field is required");
        return false;
      } else if (month > 12 || month <= 0) {
        showError(input, "Please enter a valid month");
        return false;
      }

      updatedValues.month = month;
      clearError(input);
    }

    if (input.id === "year") {
      input.value = input.value.slice(0, 4);
      const year = input.value;

      if (!year) {
        showError(input, "This field is required");
        return false;
      } else if (year <= 0) {
        showError(input, "Please enter a valid year");
        return false;
      } else if (year > currDate.getFullYear()) {
        showError(input, "Please enter a year from the past");
        return false;
      }

      updatedValues.year = year;
      clearError(input);
    }

    return true;
  });

  const [dayInput, monthInput, yearInput] = inputs;
  const day = parseInt(dayInput.value, 10);
  const month = parseInt(monthInput.value, 10);
  const year = parseInt(yearInput.value, 10);

  if (status.every((val) => val === true)) {
    if (!isValidDate(day, month, year)) {
      showError(dayInput, "Please enter a valid date");
      return false;
    }
  }

  return updatedValues;
}

const calculateAge = ({ day, month, year }) => {
  const currDay = currDate.getDate();
  const currMonth = currDate.getMonth() + 1;
  const currYear = currDate.getFullYear();

  let ageYears = currYear - year;

  let ageMonths = currMonth - month;
  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }
  let ageDays = currDay - day;
  if (ageDays < 0) {
    ageMonths--;
    let previousMonth = currMonth - 1;
    if (previousMonth < 1) {
      previousMonth = 12;
    }

    let daysInPreviousMonth = new Date(currYear, previousMonth, 0).getDate();
    ageDays += daysInPreviousMonth;
  }

  return (result = {
    day: ageDays,
    month: ageMonths,
    year: ageYears,
  });
};

function animateValue(display, start, end, duration, callback) {
  let startTime = null;

  const step = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);

    display.textContent = value;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else if (callback) {
      callback();
    }
  };
  requestAnimationFrame(step);
}

inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    clearError(input);
  });
});

submitButton.addEventListener("click", () => {
  const validatedValues = validateInputs(inputs);

  if (validatedValues) {
    const result = calculateAge(validatedValues);

    animateValue(yearDisplay, 0, result.year, 1000, () => {
      animateValue(monthDisplay, 0, result.month, 1000, () => {
        animateValue(dayDisplay, 0, result.day, 1000);
      });
    });

    submitButton.parentElement.classList.add("hidden");
    resetButton.parentElement.classList.remove("hidden");
  }
});

resetButton.addEventListener("click", () => {
  inputs.forEach((input) => {
    input.value = "";
  });

  yearDisplay.textContent = "--";
  monthDisplay.textContent = "--";
  dayDisplay.textContent = "--";

  resetButton.parentElement.classList.add("hidden");
  submitButton.parentElement.classList.remove("hidden");
});
