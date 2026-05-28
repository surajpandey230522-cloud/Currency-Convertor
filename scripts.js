
// for ( let select of  dropdowns){
//     for(currCode in countryList){
//     let newOption = document.createElement("option");
//     newOption.innerText=currcode;
//     newOption.value=currCode;
//     select.append(newOption);
//    }
// }
const BASE_URL =
  "https://2024-03-06.currency-api.pages.dev/v1/currencies";

const countryList = {
  USD: "US",
  INR: "IN",
  EUR: "FR",
  GBP: "GB",
  JPY: "JP",
  AUD: "AU",
  CAD: "CA",
};

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {

    let newOption = document.createElement("option");

    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selected values
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    }

    if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  // Update flag on currency change
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

// Update exchange rate
const updateExchangeRate = async () => {

  let amount = document.querySelector(".amount input");

  let amtVal = amount.value;

  // Validation
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL =
    `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  try {

    let response = await fetch(URL);

    let data = await response.json();

    let from = fromCurr.value.toLowerCase();
    let to = toCurr.value.toLowerCase();

    let rate = data[from][to];

    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText =
      `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;

  } catch (error) {

    console.log("Error:", error);

    msg.innerText = "Conversion failed!";
  }
};

// Update flag image
const updateFlag = (element) => {

  let currCode = element.value;

  let countryCode = countryList[currCode];

  let newSrc =
    `https://flagsapi.com/${countryCode}/flat/64.png`;

  let img =
    element.parentElement.querySelector("img");

  if (img) {
    img.src = newSrc;
  }
};

// Button click
btn.addEventListener("click", (evt) => {

  evt.preventDefault();

  updateExchangeRate();
});

// Initial load
window.addEventListener("load", () => {

  updateExchangeRate();

  updateFlag(fromCurr);
  updateFlag(toCurr);
});