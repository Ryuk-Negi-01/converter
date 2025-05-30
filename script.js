document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");
  const currency1 = document.getElementById("currency1");
  const currency2 = document.getElementById("currency2");
  const resultDiv = document.getElementById("result");
  const allCurrencyOptions = Array.from(currency2.options).map((option) => ({
    value: option.value,
    text: option.textContent.trim()
    
  }));

  function updateCurrencyOptions() {
    const selected = currency1.value;
    currency2.innerHTML = "";
    const f = allCurrencyOptions.filter((opt) => opt.value !== selected);

    f.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      currency2.appendChild(option);
    });

    if (f.length > 0) {
      currency2.value = f[0].value;
    }
  }

  function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    const fromCurrency = currency1.value;
    const toCurrency = currency2.value;

    if (amount <= 0) {
      
      resultDiv.textContent = "try again";
      resultDiv.style.color = "#ff9999";
      return;
    }
    else if (isNaN(amount)) {
      resultDiv.textContent = "";
      return;
    }

    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.rates[toCurrency]) {
          const rate = data.rates[toCurrency];
          resultDiv.textContent = `${rate}`;
          resultDiv.style.color = "thistle";
          resultDiv.style.fontStyle = "normal";
        } else {
          resultDiv.textContent = "Try different currency.";
          resultDiv.style.color = "#ff9999";
        }
      })
      .catch((error) => {
        resultDiv.textContent = "Error.";
        resultDiv.style.color = "#ff9999";
        console.error("Error:", error);
      });
  }

  currency1.addEventListener("change", () => {
    updateCurrencyOptions();
    convertCurrency();
  });
  currency2.addEventListener("change", convertCurrency);
  amountInput.addEventListener("input", convertCurrency);
  updateCurrencyOptions();
});
