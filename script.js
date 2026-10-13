
"use strict";

// Switch between the four calculators
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((item) => {
            item.classList.remove("active");
            item.setAttribute("aria-selected", "false");
        });

        panels.forEach((panel) => {
            panel.hidden = true;
        });

        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        const selectedPanel = document.getElementById(tab.dataset.panel);
        selectedPanel.hidden = false;
    });
});

// Display a successful result
function showResult(elementId, label, value, detail = "") {
    const result = document.getElementById(elementId);

    result.classList.remove("error");
    result.innerHTML = "";

    const resultLabel = document.createElement("span");
    resultLabel.className = "result-label";
    resultLabel.textContent = label;

    const resultValue = document.createElement("strong");
    resultValue.className = "result-value";
    resultValue.textContent = value;

    result.append(resultLabel, resultValue);

    if (detail) {
        const resultDetail = document.createElement("div");
        resultDetail.className = "result-detail";
        resultDetail.textContent = detail;
        result.appendChild(resultDetail);
    }

    result.hidden = false;
}

// Display validation errors
function showError(elementId, message) {
    const result = document.getElementById(elementId);

    result.classList.add("error");
    result.textContent = message;
    result.hidden = false;
}

// Read and validate a number
function readNumber(elementId) {
    const input = document.getElementById(elementId);
    const rawValue = input.value.trim();

    if (rawValue === "") {
        return null;
    }

    const value = Number(rawValue);

    return Number.isFinite(value) ? value : null;
}

// 1. Percentage to CGPA
document.getElementById("percentageForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const percentage = readNumber("percentageInput");
    const divisor = readNumber("percentageFormula");

    if (percentage === null || percentage < 0 || percentage > 100) {
        showError("percentageResult", "Enter a percentage between 0 and 100.");
        return;
    }

    const cgpa = percentage / divisor;

    showResult(
        "percentageResult",
        "Your calculated CGPA",
        cgpa.toFixed(2) + " / 10",
        `${percentage.toFixed(2)}% ÷ ${divisor}`
    );
});

// Create SGPA inputs based on the selected semester count
const semesterCount = document.getElementById("semesterCount");
const sgpaInputs = document.getElementById("sgpaInputs");

function createSgpaInputs() {
    const count = Number(semesterCount.value);
    sgpaInputs.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "sgpa-item";

        const label = document.createElement("label");
        label.htmlFor = `sgpa${i}`;
        label.textContent = `Semester ${i}`;

        const input = document.createElement("input");
        input.type = "number";
        input.id = `sgpa${i}`;
        input.min = "0";
        input.max = "10";
        input.step = "any";
        input.placeholder = "0–10";
        input.required = true;
        input.setAttribute("aria-label", `SGPA for semester ${i}`);

        wrapper.append(label, input);
        sgpaInputs.appendChild(wrapper);
    }
}

semesterCount.addEventListener("change", createSgpaInputs);
createSgpaInputs();

// 2. SGPA to CGPA
document.getElementById("sgpaForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const count = Number(semesterCount.value);
    const values = [];

    for (let i = 1; i <= count; i++) {
        const value = readNumber(`sgpa${i}`);

        if (value === null || value < 0 || value > 10) {
            showError(
                "sgpaResult",
                `Enter a valid SGPA between 0 and 10 for semester ${i}.`
            );
            return;
        }

        values.push(value);
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    const cgpa = total / values.length;

    showResult(
        "sgpaResult",
        "Your calculated CGPA",
        cgpa.toFixed(2) + " / 10",
        `Average of ${count} semester${count === 1 ? "" : "s"}`
    );
});

// 3. Total Marks to CGPA
document.getElementById("marksForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const obtained = readNumber("obtainedMarks");
    const maximum = readNumber("maximumMarks");
    const divisor = readNumber("marksFormula");

    if (
        obtained === null ||
        maximum === null ||
        obtained < 0 ||
        maximum <= 0 ||
        obtained > maximum
    ) {
        showError(
            "marksResult",
            "Enter valid marks. Obtained marks cannot exceed maximum marks."
        );
        return;
    }

    const percentage = (obtained / maximum) * 100;
    const cgpa = percentage / divisor;

    showResult(
        "marksResult",
        "Your calculated CGPA",
        cgpa.toFixed(2) + " / 10",
        `${obtained} / ${maximum} marks = ${percentage.toFixed(2)}%`
    );
});

// 4. CGPA to Percentage
document.getElementById("reverseForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const cgpa = readNumber("cgpaInput");
    const multiplier = readNumber("reverseFormula");

    if (cgpa === null || cgpa < 0 || cgpa > 10) {
        showError(
            "reverseResult",
            "Enter a CGPA between 0 and 10."
        );
        return;
    }

    const percentage = cgpa * multiplier;

    showResult(
        "reverseResult",
        "Your calculated percentage",
        percentage.toFixed(2) + "%",
        `${cgpa.toFixed(2)} CGPA × ${multiplier}`
    );
});
